import type { LocalLandingPageV6CityConfig } from '../../content/local/types';
import { isLocalRegistryEntryPublished } from '../../content/local/registry';
import NotFound from '../../pages/NotFound';
import LocalLandingPageV6 from './LocalLandingPageV6';

interface CityLandingPageProps {
  config: LocalLandingPageV6CityConfig;
}

export default function CityLandingPage({ config }: CityLandingPageProps) {
  if (!isLocalRegistryEntryPublished(config.localEntryId)) {
    return <NotFound />;
  }

  return <LocalLandingPageV6 config={config} />;
}
