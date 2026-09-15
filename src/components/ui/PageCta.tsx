import type { ReactNode } from 'react';

interface PageCtaProps {
  title: string;
  description: string;
  children: ReactNode;
  eyebrow?: string;
  density?: 'default' | 'compact';
}

export default function PageCta({
  title,
  description,
  children,
  eyebrow,
  density = 'default',
}: PageCtaProps) {
  const sectionClassName =
    density === 'compact'
      ? 'bg-ink py-[70px] text-white max-[680px]:py-12'
      : 'editorial-section bg-ink text-white';
  const titleClassName =
    density === 'compact'
      ? 'editorial-heading mb-[22px] text-[clamp(32px,3.3vw,45px)] text-white'
      : 'editorial-heading mb-5 text-white';
  const descriptionClassName =
    density === 'compact'
      ? 'max-w-2xl text-[14px] leading-[1.75] text-white/80'
      : 'max-w-2xl text-lg text-white/80 leading-comfortable';

  return (
    <section className={sectionClassName}>
      <div className="container-editorial grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="max-w-3xl">
          {eyebrow && <p className="editorial-eyebrow editorial-eyebrow-inverse mb-5">{eyebrow}</p>}
          <h2 className={titleClassName}>{title}</h2>
          <p className={descriptionClassName}>{description}</p>
        </div>
        <div className="flex flex-col gap-3 lg:max-w-xs">{children}</div>
      </div>
    </section>
  );
}
