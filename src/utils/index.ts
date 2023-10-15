import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { inRange } from 'lodash';

export const useLocationInfo = () => {
  const location = useLocation();
  const current = location.pathname;
  const isBusinessCard = location.pathname.includes('/business-card');

  return {
    current,
    isBusinessCard,
  };
};

export const useEnvironmentInfo = () => {
  const development = window.location.hostname === 'localhost';
  const production = window.location.hostname === 'dariodumlijan.com';
  const staging = window.location.hostname === 'staging.dariodumlijan.com';
  const invalidHost = !development && !production && !staging;

  return {
    isDevelopment: development,
    isProduction: production,
    isStaging: staging,
    isInvalidHost: invalidHost,
  };
};

export const useScreenSize = (): boolean => {
  const mediaQuery = window.matchMedia('(max-width: 991px)');
  const [isSmallScreen, setIsSmallScreen] = useState(mediaQuery.matches);

  useEffect(() => {
    const handler = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isSmallScreen;
};

export const elementInView = (
  body: HTMLBodyElement,
  elementPosition: number,
): boolean => {
  if (!body) return false;

  const smallOffset = 100;
  if (
    inRange(
      elementPosition + smallOffset,
      body.scrollTop,
      body.scrollTop + body.clientHeight,
    )
  ) {
    return true;
  }

  return false;
};
