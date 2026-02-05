/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * VDOM Simple Search component used in the header.
 * - Subscribes to Global.databus to detect provider/root simpleSearch endpoint.
 * - Issues search via transport._post (no DataOperations).
 * - Dispatches a navigation event with the resource path on success.
 *
 * The MVVM host (frontend) should include <wrc-simple-search> and listen for the
 * "wrc:navigateToResource" event to route as needed (e.g., /resource/<encoded>).
 */

import "ojs/ojinputsearch";
import t = require("ojL10n!wrc/shared/resources/nls/frontend");
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { useEffect, useState, useContext } from "preact/hooks";
import { _post } from "../shared/model/transport";
import { Response } from "wrc/shared/typedefs/common";
import { ResourceContext } from "wrc/integration/resource-context";
import { DatabusContext } from "wrc/integration/DatabusContext";
import * as Logger from "ojs/ojlogger";


type Props = {
  context?: ResourceContext;
}

function SimpleSearchImpl({ context }: Props) {
  const databus = useContext(DatabusContext);
  
  const [enabled, setEnabled] = useState(false);
  const [endpoint, setEndpoint] = useState<string | undefined>(undefined);
  const [value, setValue] = useState("");

  useEffect(() => {
    
    if (!databus) {
      return;
    }

    const signal = databus.subscribe((statusData) => {
      try {
        const current = statusData?.providers?.current;
        const lastRootUsed = current?.lastRootUsed;
        const currentRoot = current?.roots?.find((r) => r?.name === lastRootUsed);
        const simpleSearch = currentRoot?.simpleSearch as string | undefined;
        if (simpleSearch) {
          setEnabled(true);
          setEndpoint(simpleSearch);
        } else {
          setEnabled(false);
          setEndpoint(undefined);
          setValue("");
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          Logger.error(e.message);
        } else {
          Logger.error(String(e));
        }
        setEnabled(false);
        setEndpoint(undefined);
      }
    });

    return () => signal?.detach();
  }, []);

  const placeholder =
    t["wrc-common"]?.placeholders?.search?.value || '';

  const doSearch = async (searchValue: string) => {
    if (!enabled || !endpoint || !searchValue || searchValue.length === 0) return;

    // Post using transport._post with a { data: { value } } payload (mirrors typical WRC patterns)
    const res = await _post(endpoint, JSON.stringify({ contains: searchValue }));
    const body = (await res.json()) as Response;

    // Messages are reported via transport statusData reporter already; nothing extra here.
    const resourcePath =
      body?.resourceData?.resourceData ||
      (body as any)?.resourceData ||
      undefined;

    if (resourcePath) {
      context?.routerController?.navigateToAbsolutePath(resourcePath);
    }
  };


  useEffect(() => {
    const host = document.getElementById("cfe-simple-search");
    const input = host?.querySelector("input[type='text']") as HTMLInputElement | null;
    if (host) {
      host.classList.toggle("oj-disabled", !enabled);
    }
    if (input) {
      input.disabled = !enabled;
    }
  }, [enabled]);

  Logger.info('enabled: ' + enabled);

  return (
    <div class="branding-area-simple-search oj-sm-align-self-center oj-flex-item">
      <oj-input-search
        id="cfe-simple-search"
        class="oj-form-control-max-width-md oj-bg-neutral-170 oj-flex-item"
        {...({ disabled: !enabled } as any)}
        value={value}
        placeholder={placeholder}
        onvalueChanged={(e) => setValue(e?.detail?.value || "")}
        onojValueAction={(e) => {
          const v = e?.detail?.value || value;
          doSearch(v);
        }}
      ></oj-input-search>
    </div>
  );
}

export const SimpleSearch: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof SimpleSearchImpl>>
> = registerCustomElement("wrc-simple-search", SimpleSearchImpl);

export default SimpleSearch;
