import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

const getDeviceConfig = (width) => {
  if (width < 320) {
    return 'xs';
  } else if (width >= 320 && width < 720) {
    return 'sm';
  } else if (width >= 720 && width < 1024) {
    return 'md';
  } else if (width >= 1024 && width < 1920) {
    return 'lg';
  } else if (width >= 1920 && width < 2130) {
    return 'lgg';
  } else if (width >= 2130 && width < 2400) {
    return 'xlg';
  } else if (width >= 2400 && width < 2560) {
    return 'xlgg';
  } else if (width >= 2560 && width < 2800) {
    return 'xxlg';
  } else if (width >= 2800 && width < 3840) {
    return 'xxlgg';
  } else if (width >= 3840) {
    return 'xxxlg';
  }
};

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() =>
    getDeviceConfig(window.innerWidth),
  );

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window.innerWidth));
    }, 200);
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return brkPnt;
};
export default useBreakpoint;
