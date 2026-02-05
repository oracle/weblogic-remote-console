import "css!./dialog.css";
import { ComponentChildren, ComponentProps } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import type { ojDialog } from "ojs/ojdialog";

type DialogProps = ComponentProps<"oj-dialog"> & {
  children: ComponentChildren;
};

export const Dialog = forwardRef<ojDialog, DialogProps>((dialogProps, ref) => {
  // Extract incoming position so we can apply it imperatively after upgrade
  const { position: incomingPosition, ...restProps } = dialogProps;

  // Keep oj-dialog defaults simple so resizable works reliably.
  // Initial size comes from caller (e.g., style width: '60vw') and CSS caps.
  const newDialogProps: ComponentProps<"oj-dialog"> = {
    // Drop wrc_popup_full to avoid app.css forcing width/height:100%
    class: ["cfe-generic-dialog"].filter(Boolean).join(" "),
    modality: "modal",
    cancelBehavior: "icon",
    dragAffordance: "title-bar",
    // No default position here; attachRef/effect will set a centered position or caller-provided one
    resizeBehavior: "resizable",
    ...restProps,
  };

  // Merge/augment classes and mirror root dark-mode class to the dialog host
  try {
    const incomingClass = (restProps as any)?.class as string | undefined;
    const classes = [incomingClass, "cfe-generic-dialog"];
    const root =
      typeof document !== "undefined"
        ? (document.getElementById("globalBody") ||
           document.getElementById("appContainer") ||
           document.body)
        : null;
    const dark = !!root?.classList?.contains?.("oj-color-invert");
    if (dark) {
      classes.push("oj-color-invert", "oj-c-colorscheme-dependent");
    }
    (newDialogProps as any).class = classes.filter(Boolean).join(" ");
  } catch (e) {
    // no-op (e.g., SSR)
  }

  (newDialogProps as any)["header-decoration"] = "off";

  // Maintain an internal ref so we can set complex-typed properties after upgrade
  const localRef = useRef<ojDialog | null>(null);

  // Imperatively apply incoming position so 'of:' works
  useEffect(() => {
    if (!localRef.current || !incomingPosition) return;
    const pos: any = { ...incomingPosition };

    // Map "window" sentinel to the real window object for JET positioning
    if (pos?.of === "window") {
      pos.of = window;
    }

    try {
      (localRef.current).setProperty?.("position", pos);
    } catch (_e) {
      try {
        (localRef.current).position = pos;
      } catch (_e2) {
        // no-op
      }
    }
  }, [incomingPosition]);

  // Keep dialog color-scheme in sync with root (supports live theme toggle)
  useEffect(() => {
    const el = localRef.current as unknown as HTMLElement | null;
    if (!el || typeof document === "undefined") return;

    const root = (document.getElementById("globalBody") ||
                  document.getElementById("appContainer") ||
                  document.body) as HTMLElement | null;

    const apply = () => {
      const dark = !!root?.classList?.contains?.("oj-color-invert");
      try {
        el.classList.toggle("oj-color-invert", dark);
        el.classList.toggle("oj-c-colorscheme-dependent", dark);
      } catch {
        /* no-op */
      }
    };

    apply();

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && (m.attributeName === "class")) {
          apply();
        }
      }
    });

    if (root) mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => mo.disconnect();
  }, []);


  /**
   * attachRef
   *
   * Purpose:
   * - Bridge the element reference to both our internal localRef (used for imperative property
   *   setting) and the forwarded ref provided by callers.
   * - Immediately apply the caller-provided `position` to the upgraded oj-dialog element so that
   *   a subsequent `open()` uses the correct placement. Complex-typed properties like `position`
   *   are not reliably applied via declarative JSX attributes (especially when they include values
   *   like `of: window`), so we set them imperatively once the element exists.
   *
   * Behavior:
   * 1) Store the element in localRef so effects and other code paths can access the upgraded element.
   * 2) If an incoming position was provided and the element exists, set it via
   *    `setProperty("position", pos)` (with a direct property assignment fallback).
   * 3) Forward the element to the external ref (function or object ref) so callers can also control it.
   *
   * Timing:
   * - Runs during ref attachment (mount), before the first `open()` call, ensuring the dialog uses the
   *   correct position on initial display.
   */
  const attachRef = (el: ojDialog | null) => {
    localRef.current = el;

    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  return <oj-dialog ref={attachRef as any} {...newDialogProps}>{dialogProps.children}</oj-dialog>;
});
