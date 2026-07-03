export function Card({ children, className = "" }) {
  return <div className={`glass rounded-xl p-6 ${className}`}>{children}</div>;
}

export function NeonCard({ children, className = "" }) {
  return <div className={`glass neon-border rounded-xl p-6 ${className}`}>{children}</div>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}) {
  const v = {
    primary: "bg-neon text-primary-foreground hover:emerald-glow",
    ghost: "hover:bg-surface-2 text-foreground",
    outline: "border border-neon/40 text-neon hover:bg-neon/10",
    danger: "bg-danger text-destructive-foreground hover:opacity-90",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${v} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 placeholder:text-muted-foreground/60 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 placeholder:text-muted-foreground/60 scrollbar-thin ${props.className ?? ""}`}
    />
  );
}

export function Badge({ children, tone = "neon" }) {
  const t = {
    neon: "bg-neon/15 text-neon border border-neon/30",
    emerald: "bg-emerald-glow/15 text-emerald-glow border border-emerald-glow/30",
    warn: "bg-warn/15 text-warn border border-warn/30",
    danger: "bg-danger/15 text-danger border border-danger/30",
    muted: "bg-surface-2 text-muted-foreground border border-border",
  }[tone];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${t}`}>{children}</span>;
}