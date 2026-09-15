import type { ReactNode } from 'react';

interface PageCtaProps {
  title: string;
  description: string;
  children: ReactNode;
  eyebrow?: string;
}

export default function PageCta({ title, description, children, eyebrow }: PageCtaProps) {
  return (
    <section className="editorial-section bg-ink text-white">
      <div className="container-editorial grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="max-w-3xl">
          {eyebrow && <p className="editorial-eyebrow editorial-eyebrow-inverse mb-5">{eyebrow}</p>}
          <h2 className="editorial-heading mb-5 text-white">{title}</h2>
          <p className="max-w-2xl text-lg text-white/80 leading-comfortable">{description}</p>
        </div>
        <div className="flex flex-col gap-3 lg:max-w-xs">{children}</div>
      </div>
    </section>
  );
}
