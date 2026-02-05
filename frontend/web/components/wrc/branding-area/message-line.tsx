/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 */
 
import { registerCustomElement } from "ojs/ojvcomponent";
import { useEffect, useRef, useState, useContext } from "preact/hooks";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { openExternalUrl } from "./header";
import { Message, StatusData } from "wrc/shared/typedefs/rdj";
import { ResourceContext } from "wrc/integration/resource-context";
import { DatabusContext } from "wrc/integration/DatabusContext";

/**
 * @ojmetadata displayName "Message Line (Branding Area)"
 * @ojmetadata description "Displays banner messages under the header. Databus-driven via status.providers.current.messages."
 * @ojmetadata main "wrc/branding-area/message-line"
 */
type Props = { context?: ResourceContext };
function MessageLineImpl({ context }: Props) {
  const [messagesArr, setMessagesArr] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ariaLabel = t["wrc-message-line"]?.ariaLabel?.region?.value;
  const databus = useContext(DatabusContext);


  // Subscribe to Databus and derive message-line content from status.providers.current.messages
  useEffect(() => {
    const bus = databus;
    if (!bus) return;

    const binding = bus.subscribe((status: StatusData) => {
      const current = status.providers.current;
      const msgs: Message[] = Array.isArray(current.messages) ? current.messages! : [];

      setMessagesArr(msgs);
    });

    return () => {
      binding.detach();
    };
  }, []);




  const handleLinkClick = (msg: Message) => (ev: Event) => {
    const link = msg?.link;
    if (!link) return;

    if (link.externalLink) {
      openExternalUrl(link.externalLink);
      return;
    }
    if (link.resourceData) {
      context?.routerController?.navigateToAbsolutePath?.(link.resourceData);
      return;
    }
  };

  // Drive layout offset for fixed stripe/content using the ACTUAL rendered height.
  // This prevents the stripe from overlapping when content wraps or theme sizing changes.
  useEffect(() => {
    const root = document?.documentElement;
    if (!root) return;

    if (messagesArr.length === 0) {
      root.style.setProperty("--wrc-message-line-visible", "0px");
      return () => { root.style.setProperty("--wrc-message-line-visible", "0px"); };
    }

    // Measure current rendered height; fall back to the nominal variable if ref is not ready.
    const el = containerRef.current;
    const measured = el && el.offsetHeight ? `${el.offsetHeight}px` : "var(--message-line-container-height)";
    root.style.setProperty("--wrc-message-line-visible", measured);

    return () => {
      // Defensive reset on unmount
      root.style.setProperty("--wrc-message-line-visible", "0px");
    };
  }, [messagesArr.length]);

  if (messagesArr.length === 0) return <></>;

  const isDark = (document?.getElementById("globalBody")?.classList.contains("oj-color-invert") || document?.body?.classList.contains("oj-color-invert"));
  const containerClass = `oj-flex oj-sm-flex-items-initial ${isDark ? "oj-bg-neutral-180" : "oj-bg-neutral-30"}`;

  return (
    <>
      <div
        id="message-line-container"
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        class={containerClass}
      >
        <div class="oj-flex-item" style="width: 100%;">
          {messagesArr.map((msg) => {
            const { severity } = msg;
            const iconClass =
              severity === "warning"
                ? "oj-ux-ico-warning"
                : severity === "info"
                ? "oj-ux-ico-information"
                : "oj-ux-ico-error";

            const linkObj = msg?.link;
            const linkLabel = linkObj?.label || "Open Link";
            const hasLink = !!(linkObj && (linkLabel || linkObj?.externalLink || linkObj?.resourceData));

            const summaryHTML = msg?.messageSummary ?? "";
            const linkAria = `${summaryHTML ?? ""} ${linkLabel}`.trim();

            return (
              <div class="oj-flex oj-sm-align-items-center oj-text-color-primary" role="group">
                {iconClass ? (
                  <>
                    <span
                      class={`${iconClass} cfe-message-line-icon ${
                        severity === "info" ? "cfe-message-line-icon--info" : ""
                      } ${severity === "warning" ? "oj-text-color-warning" : severity === "error" ? "oj-text-color-danger" : ""}`}
                      aria-hidden="true"
                    ></span>
                    {"\u00A0"}
                  </>
                ) : null}

                <span
                  class={`cfe-message-line-text oj-text-color-primary ${
                    severity === "info" ? "oj-sm-margin-start-3x" : "oj-sm-margin-start-2x"
                  }`}
                  dangerouslySetInnerHTML={{ __html: summaryHTML }}
                ></span>

                {hasLink ? (
                  <span class="oj-helper-margin-start-auto cfe-message-line-link-button">
                    <oj-c-button
                      chroming="outlined"
                      size="xs"
                      label={linkLabel}
                      onojAction={handleLinkClick(msg)}
                      aria-label={linkAria}
                    ></oj-c-button>
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const MessageLine: any = registerCustomElement(
  "wrc-message-line",
  MessageLineImpl
);

export default MessageLine;
