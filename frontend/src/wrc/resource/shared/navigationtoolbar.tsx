/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { useContext, useEffect, useState } from "preact/hooks";
import { UserContext } from "../resource";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";

import "oj-c/button";

type NavTargets = {
  back?: string;
  forward?: string;
  home?: string;
};

type Props = {
  pageContext?: string;
};

/**
 * NavigationToolbar
 * - Renders three oj-c-buttons (Back, Next, Home) with placeholder Redwood icons.
 * - Subscribes to the Databus to receive navigation targets from status events:
 *   event.main.context['back-resource-data'], ['forward-resource-data'], ['home-resource-data']
 * - Buttons call routerController.navigateToAbsolutePath with the latest target.
 */
export default function NavigationToolbar({ pageContext }: Props) {
  const ctx = useContext(UserContext);
  const [targets, setTargets] = useState<NavTargets>({});
  const showButtons = pageContext === 'main';

  useEffect(() => {
    // Subscribe to databus from context (preferred; Resource provides it via UserContext)
    const databus = ctx?.databus;

    if (databus) {
      const signal = databus.subscribe((event) => {
        // Defensive access of the path values. Legacy SSE payload puts these in main.context
        const main = event?.contexts?.main || {};
  
        const back = main["back-resource-data"];
        const forward = main["forward-resource-data"];
      
        setTargets((prev) => ({
          back: back ?? prev.back,
          forward: forward ?? prev.forward,
        }));
      });

      return () => (signal as any).detach();
    }
  }, []);

  const go = (path?: string) => {
    if (!path) return;
    ctx?.context?.routerController?.navigateToAbsolutePath?.(path);
  };

  return (
    <div class="wrc-navigation-toolbar">
      {showButtons && (
        <>
          <oj-c-button
            id="back-button"
            chroming="borderless"
            onojAction={() => go(targets.back)}
            disabled={!targets.back}
            tooltip={t["wrc-form-toolbar"].buttons.back.label}
            aria-label={t["wrc-form-toolbar"].buttons.back.label}
          >
            <span slot="startIcon" class="oj-ux-ico-arrow-left"></span>
          </oj-c-button>

          <oj-c-button
            id="forward-button"
            chroming="borderless"
            onojAction={() => go(targets.forward)}
            disabled={!targets.forward}
            tooltip={t["wrc-form-toolbar"].buttons.forward.label}
            aria-label={t["wrc-form-toolbar"].buttons.forward.label}
          >
            <span slot="startIcon" class="oj-ux-ico-arrow-right"></span>
          </oj-c-button>
        </>
      )}
    </div>
  );
}
