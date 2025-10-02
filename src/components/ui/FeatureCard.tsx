import { ReactNode } from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: 'primary' | 'bicolor';
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = 'primary',
}: FeatureCardProps) {
  const iconClasses =
    iconColor === 'primary'
      ? 'text-primary-300'
      : 'text-primary-300 group-hover:text-tertiary-1';

  return (
    <div className='group text-center p-6'>
      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 transition-all duration-300 group-hover:scale-110'>
        <Icon className={`h-8 w-8 ${iconClasses} transition-colors duration-300`} />
      </div>
      <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
        {title}
      </h3>
      <p className='text-textLight leading-comfortable'>{description}</p>
    </div>
  );
}
