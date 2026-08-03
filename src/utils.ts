import type { Language } from "./i18n";

export interface CommonProps {
  lang: Language;
}

export const isMobile = ! window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const MOBILE_LANDSCAPE_MIN_RATIO = 1.5;

export const isMobileLandscape = () => {
  if(! isMobile) return false;

  const { innerHeight, innerWidth } = window;

  return innerWidth > innerHeight && innerWidth / innerHeight >= MOBILE_LANDSCAPE_MIN_RATIO;
};
