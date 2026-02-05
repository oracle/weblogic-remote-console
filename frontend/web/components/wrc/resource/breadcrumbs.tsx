/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { JSX } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { UserContext } from "./resource";
import { FormContentModel } from "../shared/model/formcontentmodel";
import { TableContentModel } from "../shared/model/tablecontentmodel";
import { ListContentModel } from "../shared/model/listcontentmodel";
import { Reference } from "../shared/typedefs/rdj";
import "ojs/ojmenu";

import "ojs/ojoption";
import BookmarkToggler from "./bookmarktoggler";
import PagesBookmarkLauncher from "./pagesbookmarklauncher";
import HistoryLauncher from "./historylauncher";
import ShoppingCartMenu from "./shoppingcartmenu";
import { Model } from "../shared/model/common";
import { ProjectMenu } from "wrc/project-menu";
import 'oj-c/conveyor-belt';


type Props = {
  model: FormContentModel | TableContentModel | ListContentModel;
};

/**
 * Lightweight breadcrumbs for WRC pages.
 * - Uses RDJ.breadCrumbs + RDJ.self (last/current).
 * - Optional cross-links via RDJ.links rendered in a simple select.
 * - Clicks navigate using routerController.
 *
 * Avoids pulling detailed MVVM behaviors; focuses on a clean, accessible trail.
 */
export default function Breadcrumbs({ model }: Props) {
  const ctx = useContext(UserContext);
  const [isInsecure, setIsInsecure] = useState<boolean>(false);

  useEffect(() => {
    const databus = ctx?.databus;

    const signal = databus?.subscribe((e) => {
      setIsInsecure(e.providers.current?.insecure || false);
    });

    return () => (signal as any)?.detach();
  }, []);

  const { crumbs, links } = useMemo<{
    crumbs: Reference[];
    links: Reference[];
  }>(() => {
    const crumbs = model?.getBreadcrumbs?.() || [];
    const links = model?.getLinks?.() || [];
    return { crumbs, links };
  }, [model]);

  const navigateTo = (ref?: Reference) => {
    const path = ref?.resourceData || ref?.unresolvedReference || "";
    if (path) {
      ctx?.context?.routerController?.navigateToAbsolutePath?.(path);
    }
  };

  const onMenuAction = (e: CustomEvent) => {
    const v = e?.detail?.selectedValue;
    const index = Number(v);
    if (!Number.isNaN(index)) {
      navigateTo(links[index]);
    }
  };

  const clazz =
    links && links.length > 0 ? "breadcrumb-crosslink" : "breadcrumb-link";

  const pageTitle = crumbs.map(m => m.label).join('/');
  return (
    <>
      <div class="wrc-breadcrumbs-row oj-flex oj-sm-flex-wrap-nowrap">
        <ProjectMenu />

        {isInsecure && (
          <span class="oj-ux-ico-warning wrc-insecure-warning-icon"></span>
        )}
        <nav id="breadcrumbs-container" class="oj-flex-item oj-sm-flex-1">
          <oj-c-conveyor-belt class="oj-sm-11" arrowVisibility="auto">
            <ul class={clazz}>
              {crumbs.map((c: Reference, idx: number) => {
                const isLast = idx === crumbs.length - 1;
                return !isLast ? (
                  <li
                    key={(c.label || c.resourceData || String(idx)) + "_" + idx}
                    class="oj-sm-margin-1x oj-flex-item"
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(c);
                      }}
                    >
                      {c.label || c.resourceData}
                    </a>
                  </li>
                ) : (
                  <></>
                );
              })}
              {links && links.length > 0 ? (
                <li>
                  <oj-menu-button chroming="borderless">
                    {crumbs[crumbs.length - 1].label}
                    <oj-menu slot="menu" onojMenuAction={onMenuAction}>
                      {links.map((l: Reference, i: number) => (
                        <oj-option
                          id={
                            (l.resourceData ||
                              l.unresolvedReference ||
                              "") as string
                          }
                          value={String(i)}
                        >
                          {l.label || l.resourceData || ""}
                        </oj-option>
                      ))}
                    </oj-menu>
                  </oj-menu-button>
                </li>
              ) : (
                <li>{crumbs[crumbs.length - 1].label}</li>
              )}
            </ul>
          </oj-c-conveyor-belt>
        </nav>

        <BookmarkToggler
          id="breadcrumbs-bookmark-toggler"
          pageTitle={pageTitle}
          model={model as unknown as Model}
        />
        <PagesBookmarkLauncher />
        <ShoppingCartMenu />
        <HistoryLauncher />
      </div>
      {/* <div id="content-area-header-container-strip"></div> */}
    </>
  );
}
