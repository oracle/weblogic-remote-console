/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import "oj-c/button";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { Model } from "wrc/shared/model/common";
import { _post, getData } from "wrc/shared/model/transport";
import { UserContext } from "./resource";

export type BookmarkTogglerProps = {
  pageTitle?: string;
  model: Model;

  disabled?: boolean;
  id?: string;
  class?: string;
};

/**
 * BookmarkToggler
 * - Displays a clickable star icon.
 * - Highlighted when bookmarked (filled star), unhighlighted when not (outline star).
 * - Emits onToggle(next) when clicked. Caller is responsible for persisting bookmark state.
 *
 * This component is "peer" to breadcrumbs.tsx (same directory) and intentionally
 * avoids coupling to RDJ/model. The parent decides when/what to pass in.
 */
export default function BookmarkToggler(props: BookmarkTogglerProps) {
  const ctx = useContext(UserContext);

  const { disabled, id, class: className } = props;

  useEffect(() => {
    const databus = ctx?.databus;

    if (databus) {
      const signal = databus.subscribe((event) => {
        const main = event?.contexts?.main;

        setIsBookmarked(main?.isBookmarked || false);
      });

      return () => (signal as any).detach();
    }
  }, []);

  const tooltipOn = t["wrc-pages-bookmark"].menus.bookmark.add.label;
  const tooltipOff = t["wrc-pages-bookmark"].menus.bookmark.remove.label;
  const ariaLabelOn = tooltipOn;
  const ariaLabelOff = tooltipOff;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const iconClass = isBookmarked
    ? "oj-ux-ico-star-full wrc-hightlighted-bookmark"
    : "oj-ux-ico-star";
  const tooltip = isBookmarked ? tooltipOff : tooltipOn;
  const ariaLabel = isBookmarked ? ariaLabelOff : ariaLabelOn;

  const handleToggle = () => {
    const body = {
      resourceData: props.model.rdj.self.resourceData,
      label: props.pageTitle,
    };

    const next = !isBookmarked;
    const command = next ? 'add' : 'delete';

    _post(
      `/api/bookmarks/${command}`,
      JSON.stringify(body),
    ).then(
      () => {
        // throwaway call to refetch the rdj to get a new statusData with isBookmarked=true
        getData(props.model.rdjUrl, undefined, 'main');
      }
    );
  };

  // Stable props for the button
  const buttonProps = useMemo(
    () => ({
      chroming: "borderless",
      disabled: !!disabled,
      display: "icons",
      tooltip,
      // Ensure JET audit passes by providing a label for accessibility
      label: ariaLabel,
      "aria-pressed": isBookmarked ? "true" : "false",
    }),
    [disabled, tooltip, ariaLabel, isBookmarked],
  );

  return (
    <div
      id={id}
      class={["wrc-bookmark-toggler", className].filter(Boolean).join(" ")}
    >
      <oj-c-button {...(buttonProps as any)} onojAction={handleToggle}>
        <span slot="startIcon" class={iconClass}></span>
      </oj-c-button>
    </div>
  );
}
