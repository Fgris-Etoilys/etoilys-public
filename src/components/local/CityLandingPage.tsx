import type { LocalLandingPageV6CityConfig } from '../../content/local/types';
import LocalLandingPageV6 from './LocalLandingPageV6';

interface CityLandingPageProps {
  config: LocalLandingPageV6CityConfig;
}

export default function CityLandingPage({ config }: CityLandingPageProps) {
  return <LocalLandingPageV6 config={config} />;
}
