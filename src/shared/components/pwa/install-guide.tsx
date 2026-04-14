'use client';

import { useEffect, useState } from 'react';

import { useInstallPrompt } from '@/shared/hooks';

import { AndroidInstallBanner } from './android-install-banner';
import { IosInstallGuide } from './ios-install-guide';

export function InstallGuide() {
  const { isInstallable, triggerInstall } = useInstallPrompt();
  const [showManual, setShowManual] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isDismissed =
      localStorage.getItem('ios-install-dismissed') ||
      sessionStorage.getItem('ios-install-dismissed');

    if (isStandalone || isDismissed) return;

    const supportsInstallPrompt = 'onbeforeinstallprompt' in window;
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;

    if (!supportsInstallPrompt && isSafari) {
      const isMobile = window.matchMedia('(pointer: coarse)').matches;
      setIsDesktop(!isMobile);
      setShowManual(true);
    }
  }, []);

  if (isInstallable)
    return <AndroidInstallBanner triggerInstall={triggerInstall} />;
  if (showManual) return <IosInstallGuide isDesktop={isDesktop} />;
  return null;
}
