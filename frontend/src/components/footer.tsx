/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import "ojs/ojswitch";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";

type Props = {
  links?: FooterLink[]
}

type FooterLink = {
  name: string;
  linkId: string;
  linkTarget: string;
}

const _DEFAULT_LINKS: FooterLink[] = [
  {
    name: "About Oracle",
    linkId: "aboutOracle",
    linkTarget: "http://www.oracle.com/us/corporate/index.html#menu-about"
  },
  {
    name: "Contact Us",
    linkId: "contactUs",
    linkTarget: "http://www.oracle.com/us/corporate/contact/index.html"
  },
  {
    name: "Legal Notices",
    linkId: "legalNotices",
    linkTarget: "http://www.oracle.com/us/legal/index.html"
  },
  {
    name: "Terms Of Use",
    linkId: "termsOfUse",
    linkTarget: "http://www.oracle.com/us/legal/terms/index.html"
  },
  {
    name: "Your Privacy Rights",
    linkId: "yourPrivacyRights",
    linkTarget: "http://www.oracle.com/us/legal/privacy/index.html"
  }
]

export function Footer({ links = _DEFAULT_LINKS } : Props ) {
  const darkModeLabel = t["wrc"].prefs.darkmode;
  const [darkEnabled, setDarkEnabled] = useState(false);
  const KEY = 'wrc:darkMode';
  const darkClasses = ['oj-bg-neutral-170', 'oj-color-invert', 'oj-c-colorscheme-dependent'];

  const getRootEl = () =>
    (document.getElementById('globalBody') ||
     document.getElementById('appContainer') ||
     document.body) as HTMLElement;

  const applyDarkMode = (enabled: boolean) => {
    const root = getRootEl();
    if (!root) return;
    if (enabled) {
      darkClasses.forEach(c => root.classList.add(c));
    } else {
      darkClasses.forEach(c => root.classList.remove(c));
    }
  };

  useEffect(() => {
    try {
      setDarkEnabled(localStorage.getItem(KEY) === 'on');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyDarkMode(darkEnabled);
    try {
      localStorage.setItem(KEY, darkEnabled ? 'on' : 'off');
    } catch {
      // ignore
    }
  }, [darkEnabled]);

  useEffect(() => {
    const onExternalToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.enabled === 'boolean') {
        setDarkEnabled(!!detail.enabled);
      }
    };
    window.addEventListener('wrc:darkMode', onExternalToggle as EventListener);
    return () => window.removeEventListener('wrc:darkMode', onExternalToggle as EventListener);
  }, []);

  const onToggle = (e: any) => {
    if (e?.detail?.updatedFrom === 'internal') {
      const enabled = !!e.detail.value;
      setDarkEnabled(enabled);
      window.dispatchEvent(new CustomEvent('wrc:darkMode', { detail: { enabled } }));
    }
  };

  return (
    <div class="oj-web-applayout-footer-item oj-web-applayout-max-width oj-text-color-secondary oj-typography-body-sm oj-flex oj-sm-justify-content-flex-end oj-sm-align-items-center" role="contentinfo">
      <span class="oj-typography-body-sm oj-sm-margin-2x-end">{darkModeLabel}</span>
      <oj-switch id="dark-mode-switch-preact" value={darkEnabled} onvalueChanged={onToggle} aria-label={darkModeLabel}></oj-switch>
    </div>
  );
}
