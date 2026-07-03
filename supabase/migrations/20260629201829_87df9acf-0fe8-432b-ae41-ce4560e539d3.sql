
-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  specialty text,
  target_country text,
  language text DEFAULT 'uz-latn',
  expat_points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- documents
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  title text NOT NULL,
  expiry_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- resumes
CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_text text NOT NULL,
  transformed_text text,
  target_country text,
  ats_score integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vacancies (public read)
CREATE TABLE public.vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  country text NOT NULL,
  specialty text NOT NULL,
  salary_range text,
  requirements text,
  match_score integer DEFAULT 70,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vacancies TO anon, authenticated;
GRANT ALL ON public.vacancies TO service_role;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads vacancies" ON public.vacancies FOR SELECT USING (true);

-- forum_posts
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  title text NOT NULL,
  body text NOT NULL,
  country text,
  is_sos boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated insert posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Author updates own post" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Author deletes own post" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- chat threads/messages
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own threads" ON public.chat_threads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, language)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'language', 'uz-latn'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed vacancies
INSERT INTO public.vacancies (title, company, country, specialty, salary_range, requirements, match_score) VALUES
('Senior Frontend Developer', 'TechBerlin GmbH', 'Germany', 'Developer', '€70,000 - €90,000', 'React, TypeScript, 5+ years, B1 German', 92),
('Registered Nurse - ICU', 'Charité Berlin', 'Germany', 'Doctor', '€48,000 - €62,000', 'Nursing diploma, B2 German, Anabin recognition', 78),
('Software Engineer', 'Google', 'USA', 'Developer', '$140,000 - $190,000', 'CS degree, 4+ years, H1B sponsorship', 85),
('Physician - Internal Medicine', 'Mass General Hospital', 'USA', 'Doctor', '$220,000 - $300,000', 'USMLE Step 1-3, ECFMG certification', 60),
('English Teacher (EPIK)', 'Korean Ministry of Education', 'South Korea', 'Teacher', '₩2.1M - ₩2.7M/month', 'Bachelor degree, TEFL/TESOL, native English', 88),
('Data Scientist', 'LINE Corporation', 'Japan', 'Developer', '¥8M - ¥12M/year', 'Python, ML, N3 Japanese preferred', 81),
('NHS Doctor (IMG)', 'NHS England', 'UK', 'Doctor', '£40,000 - £88,000', 'PLAB 1-2, GMC registration, IELTS 7.5', 72),
('Backend Engineer (Go)', 'Revolut', 'UK', 'Developer', '£75,000 - £110,000', 'Go, microservices, fintech experience', 90),
('Mathematics Teacher', 'British International School', 'UK', 'Teacher', '£32,000 - £48,000', 'PGCE, QTS, 3+ years secondary school', 70),
('DevOps Engineer', 'Samsung SDS', 'South Korea', 'Developer', '₩60M - ₩90M/year', 'AWS, Kubernetes, Terraform, English OK', 83),
('Pediatrician', 'Seoul National Hospital', 'South Korea', 'Doctor', '₩100M+/year', 'KMLE or Korean medical license', 45),
('University Lecturer', 'Tokyo University', 'Japan', 'Teacher', '¥6M - ¥9M/year', 'PhD, research publications, N2 Japanese', 65);
