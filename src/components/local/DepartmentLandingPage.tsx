import type { LocalLandingPageV6DepartmentConfig } from '../../content/local/types';
import LocalLandingPageV6 from './LocalLandingPageV6';

interface DepartmentLandingPageProps {
  config: LocalLandingPageV6DepartmentConfig;
}

export default function DepartmentLandingPage({ config }: DepartmentLandingPageProps) {
  return <LocalLandingPageV6 config={config} />;
}
