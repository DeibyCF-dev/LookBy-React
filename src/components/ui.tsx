import { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Activar modo día" : "Activar modo noche"}
      className="flex items-center gap-2 group"
      title={theme === "dark" ? "Modo día" : "Modo noche"}
    >
      <span className="text-[11px] text-dim hidden sm:block select-none">
        {theme === "dark" ? "Día" : "Noche"}
      </span>
      <span className="theme-toggle" />
      <span className="text-[11px]" aria-hidden>
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: "neutral" | "gold" | "success" | "warning" | "danger" | "info";
}) {
  const cls = {
    neutral: "text-[var(--fg-dim)] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]",
    gold:    "text-[#D4AF37] bg-[rgba(212,175,55,0.12)] border-[rgba(212,175,55,0.35)]",
    success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    warning: "text-amber-400 bg-amber-400/10 border-amber-400/25",
    danger:  "text-rose-400 bg-rose-400/10 border-rose-400/25",
    info:    "text-sky-400 bg-sky-400/10 border-sky-400/25",
  }[variant];
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="card-luxury p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        {trend === "up"   && <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">↑ alza</span>}
        {trend === "down" && <span className="text-[10px] text-rose-400 bg-rose-400/10 border border-rose-400/20 px-2 py-0.5 rounded-full">↓ baja</span>}
      </div>
      <p className="font-serif text-2xl text-theme mb-0.5">{value}</p>
      <p className="text-[10px] tracking-widest uppercase text-dim">{label}</p>
      {sub && <p className="text-[11px] text-gold-warm mt-1">{sub}</p>}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${w} ${s <= Math.round(rating) ? "star-filled" : "star-empty"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {eyebrow && <p className="text-[10px] tracking-[0.3em] text-gold-warm uppercase mb-2">{eyebrow}</p>}
        <h2 className="font-serif text-3xl text-theme">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="card-luxury overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-dim font-medium border-b border-[var(--border)]">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-5 py-3.5 text-sm border-b border-[rgba(128,128,128,0.07)] last-of-type:border-0 ${className}`}>
      {children}
    </td>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type NavItem = { key: string; label: string; icon: string };

export function Sidebar({
  items,
  active,
  onSelect,
  title,
  subtitle,
  avatarLetter,
  avatarImg,
  badge,
}: {
  items: NavItem[];
  active: string;
  onSelect: (k: string) => void;
  title: string;
  subtitle?: string;
  avatarLetter?: string;
  avatarImg?: string;
  badge?: ReactNode;
}) {
  return (
    <aside className="w-64 flex-shrink-0 sidebar-bg flex flex-col">
      <div className="px-5 py-8 border-b border-[var(--border)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-theme-surface border border-[rgba(212,175,55,0.25)] mb-3 flex-shrink-0 flex items-center justify-center">
            {avatarImg ? (
              <img src={avatarImg} alt={title} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-2xl text-gold">{avatarLetter}</span>
            )}
          </div>
          <p className="text-theme font-medium text-sm">{title}</p>
          {subtitle && <p className="text-dim text-xs mt-0.5">{subtitle}</p>}
          {badge && <div className="mt-2">{badge}</div>}
        </div>
      </div>
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left ${
              active === item.key
                ? "bg-[rgba(212,175,55,0.12)] text-gold border border-[rgba(212,175,55,0.28)]"
                : "text-dim hover:text-muted hover:bg-[rgba(128,128,128,0.08)]"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ─── PageShell ────────────────────────────────────────────────────────────────

export function PageShell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-full bg-theme text-theme flex flex-col transition-colors duration-300">
      {nav}
      <div className="flex flex-1 min-h-0">{children}</div>
    </div>
  );
}

// ─── TopNav ───────────────────────────────────────────────────────────────────

export function TopNav({
  logo,
  center,
  right,
}: {
  logo: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <nav className="nav-bar flex items-center justify-between px-8 py-4 flex-shrink-0 z-30">
      <div>{logo}</div>
      {center && <div>{center}</div>}
      {right && <div className="flex items-center gap-3">{right}</div>}
    </nav>
  );
}

// ─── MainContent ─────────────────────────────────────────────────────────────

export function MainContent({ children }: { children: ReactNode }) {
  return <main className="flex-1 overflow-y-auto px-10 py-10 bg-theme transition-colors duration-300">{children}</main>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-theme-card border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <h3 className="font-serif text-xl text-theme">{title}</h3>
          <button onClick={onClose} className="text-dim hover:text-theme transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  label,
  ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-[10px] tracking-widest uppercase text-dim mb-2">{label}</label>}
      <input {...props} className="input-base [color-scheme:auto]" />
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────

export function Select({
  label,
  children,
  ...props
}: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="block text-[10px] tracking-widest uppercase text-dim mb-2">{label}</label>}
      <select
        {...props}
        className="input-base cursor-pointer appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23D4AF37' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem", paddingRight: "2.5rem" }}
      >
        {children}
      </select>
    </div>
  );
}
