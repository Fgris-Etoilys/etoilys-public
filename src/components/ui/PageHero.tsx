interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="editorial-section bg-paper text-ink">
      <div className="container-editorial">
        <div className="max-w-3xl">
          <h1 className="editorial-title mb-6">{title}</h1>
          <p className="text-lg md:text-xl text-muted leading-comfortable">{description}</p>
        </div>
      </div>
    </section>
  );
}
