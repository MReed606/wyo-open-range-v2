type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-3 text-4xl font-bold text-[#1F2933] md:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-[#52606D]">
          {description}
        </p>
      </div>
    </section>
  );
}
