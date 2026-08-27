export function StaticPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 md:px-12 pt-24 sm:pt-28 pb-16 max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-foreground/85 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
