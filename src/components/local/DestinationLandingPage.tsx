import type { LocalLandingPageV6DestinationConfig } from '../../content/local/types';
import { isLocalRegistryEntryPublished } from '../../content/local/registry';
import NotFound from '../../pages/NotFound';
import LocalLandingPageV6 from './LocalLandingPageV6';

interface DestinationLandingPageProps {
  config: LocalLandingPageV6DestinationConfig;
}

export default function DestinationLandingPage({ config }: DestinationLandingPageProps) {
  if (!isLocalRegistryEntryPublished(config.localEntryId)) {
    return <NotFound />;
  }

  return <LocalLandingPageV6 config={config} />;
}
