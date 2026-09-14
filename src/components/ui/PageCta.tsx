import type { ReactNode } from 'react';

interface PageCtaProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function PageCta({ title, description, children }: PageCtaProps) {
  return (
    <section className="editorial-section bg-ink text-white">
      <div className="container-editorial text-center">
        <h2 className="editorial-heading mb-6 text-white">{title}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-white/90 leading-comfortable">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">{children}</div>
      </div>
    </section>
  );
}
