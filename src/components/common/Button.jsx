export default function Button({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-colors";

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    outline: "border border-brand-600 text-brand-700 hover:bg-brand-50",
    ghost: "text-brand-700 hover:bg-brand-50",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
