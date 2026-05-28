/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { downloadResource, DownloadRequest } from "./model/transport";

type Props = {
  children: ComponentChildren;
  class?: string;
  onError?: (error: Error) => void;
  request: DownloadRequest;
};

export const ProxyDownloadLink = ({
  children,
  class: className,
  onError,
  request,
}: Props) => {
  const [downloading, setDownloading] = useState(false);

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (downloading) return;

    setDownloading(true);
    downloadResource(request)
      .catch((error) => {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  return (
    <a
      href="#"
      class={className}
      aria-disabled={downloading}
      data-oj-clickthrough="disabled"
      data-wrc-proxy-download-link="true"
      onClick={onClick as any}
    >
      <span>{children}</span>
      <span
        class="oj-ux-ico-download oj-sm-margin-2x-start"
        aria-hidden="true"
      ></span>
    </a>
  );
};
