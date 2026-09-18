import type { LocalLandingPageV6DepartmentConfig } from '../../content/local/types';
import { isLocalRegistryEntryPublished } from '../../content/local/registry';
import NotFound from '../../pages/NotFound';
import LocalLandingPageV6 from './LocalLandingPageV6';

interface DepartmentLandingPageProps {
  config: LocalLandingPageV6DepartmentConfig;
}

export default function DepartmentLandingPage({ config }: DepartmentLandingPageProps) {
  if (!isLocalRegistryEntryPublished(config.departmentId)) {
    return <NotFound />;
  }

  return <LocalLandingPageV6 config={config} />;
}
