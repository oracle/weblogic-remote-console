/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import "css!./nav-tree-styles.css";
import "oj-c/button";
import "oj-c/buttonset-single";
import "ojs/ojcollapsible";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import "ojs/ojaccordion";
import { ButtonElement } from "ojs/ojbutton";
import { KeySetImpl } from "ojs/ojkeyset";
import { MutableArrayTreeDataProvider } from "ojs/ojmutablearraytreedataprovider";
import "ojs/ojnavigationlist";
import { ojNavigationList } from "ojs/ojnavigationlist";
import "ojs/ojtoolbar";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import "preact";
import { ComponentProps, ComponentType } from "preact";
import { useEffect, useState, useRef, useMemo, useContext } from "preact/hooks";
import { Root } from "wrc/integration/databus";
import { DatabusContext } from "wrc/integration/DatabusContext";
import { ResourceContext } from "wrc/integration/resource-context";
import { _post } from "wrc/shared/model/transport";
import { Global } from "../shared/global";
import { subscribeToRefresh, RefreshDetail } from "wrc/shared/refresh";
import { Navtree, NavtreeContent } from "./types";
import componentStrings = require("ojL10n!./resources/nls/nav-tree-strings");
import Translations = require("ojs/ojtranslation");
import { CollapsibleElement } from "ojs/ojcollapsible";
import * as Logger from "ojs/ojlogger";

type Props = Readonly<{
  navtreeUrl: string;
  url: string;
  context?: ResourceContext;
  unique: string;
  backendPrefix?: string;
}>;

export const ICONS: Record<string, string> = {
  edit: "oj-ux-ico-add-edit-page",
  serverConfig: "oj-ux-ico-file-view-details",
  domainRuntime: "oj-ux-ico-heart-rate-monitor",
  securityData: "oj-ux-ico-shield",
};

function getIconClass(node: NavtreeContent) {
  switch (node.type) {
    case 'group':
      return "oj-ux-ico-bag";
    case 'collection':
      return "oj-ux-ico-collection-alt";
    case 'collectionChild':
      return "oj-ux-ico-box";
    case 'singleton':
      return "oj-ux-ico-file-text";
    case 'root':
      return "oj-ux-ico-domain";
    default:
      break;
  }

  return "";
}


/**
 *
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/nav-tree"
 */
function NavTreeImpl({ context, unique, backendPrefix }: Props) {
  const databus = useContext(DatabusContext);
  const [navtree, setNavtree] = useState<Navtree>();
  const [navtreeString, setNavtreeString] = useState<string>();

  const [selectedItem, setSelectedItem] = useState<string[]>();
  const [expandedItems, setExpandedItems] = useState<KeySetImpl<string[]>>(new KeySetImpl<string[]>());
  
  const [rootsString, setRootsString] = useState<string>();
  const [roots, setRoots] = useState<Root[]>();

  const [selectedRoot, setSelectedRoot] = useState<string>();
  const [rootLabel, setRootLabel] = useState<string>();

  const [treeMode, setTreeMode] = useState(true);

  const [navtreeUrlState, setNavtreeUrlState] = useState<string>();
  const [rootReady, setRootReady] = useState(true);

  const dataProvider = useMemo(
    () =>
      new MutableArrayTreeDataProvider<NavtreeContent["name"], NavtreeContent>(
        [],
        "name",
        {
          childrenAttribute: "contents",
          keyAttributeScope: "siblings",
        },
      ),
    [],
  );

  // Dark mode support: mirror the global header's dark mode behavior
  const [isDark, setIsDark] = useState(false);
  const getRootEl = () =>
    (document.getElementById('globalBody') ||
     document.getElementById('appContainer') ||
     document.body) as HTMLElement;
  const checkDarkMode = () => {
    const root = getRootEl();
    return !!root?.classList?.contains('oj-color-invert');
  };
  useEffect(() => {
    setIsDark(checkDarkMode());
    const onDarkMode = (e: any) => {
      if (e && e.detail && typeof e.detail.enabled === 'boolean') {
        setIsDark(!!e.detail.enabled);
      } else {
        setIsDark(checkDarkMode());
      }
    };
    window.addEventListener('wrc:darkMode', onDarkMode as any);
    return () => window.removeEventListener('wrc:darkMode', onDarkMode as any);
  }, []);
  // Light vs Dark background classes:
  // - Light: oj-bg-neutral-20 / oj-bg-neutral-30
  // - Dark:  oj-color-invert + oj-bg-neutral-170 / oj-bg-neutral-170
  const navListClass = isDark ? "oj-color-invert oj-bg-neutral-170" : "oj-bg-neutral-20";
  const panelBgClass = isDark ? "oj-color-invert oj-bg-neutral-170" : "oj-bg-neutral-30";

  // Limit children displayed per node by default; user can expand via "Show more"
  const CHILD_LIMIT = 10;
  const [showAllSet, setShowAllSet] = useState<Set<string>>(new Set());

  const triedSelectionsRef = useRef<Set<string>>(new Set());

  const joinPath = (arr: string[]) => arr.join("\u0000");

  // Build a "view" of the server-provided navtree with children clamped and
  // special sentinel items ("Show all"/"Show less") appended as needed.
  const clampContents = (
    contents?: NavtreeContent[],
    path: string[] = [],
  ): NavtreeContent[] => {
    if (!Array.isArray(contents)) return [];
    const out: NavtreeContent[] = [];
    contents.forEach((c) => {
      const nodePath = [...path, c.name || ""];
      const clone: any = { ...c };

      if (Array.isArray(c.contents)) {
        // First, recurse into original children to preserve nested limits
        const originalKids = c.contents;

        // If node has more than limit children, clamp unless this node is expanded in showAllSet
        if (originalKids.length > CHILD_LIMIT && c.type !== "group") {
          const key = joinPath(nodePath);
          if (showAllSet.has(key)) {
            // Show all children + "Show less"
            clone.contents = [
              ...clampContents(originalKids, nodePath),
              {
                name: "__less__",
                label: t["wrc-navtree"].labels.showless,
                type: "action",
                icons: "oj-ux-ico-chevron-double-up",
              } as any,
            ];
          } else {
            // Show first CHILD_LIMIT children + "Show all (N more)"
            const restCount = originalKids.length - CHILD_LIMIT;
            clone.contents = [
              ...clampContents(originalKids.slice(0, CHILD_LIMIT), nodePath),
              {
                name: "__more__",
                label: Translations.applyParameters(
                  t["wrc-navtree"].labels.showmore,
                  [new Number(restCount)],
                ),
                type: "action",
                icons: "oj-ux-ico-chevron-double-down",
              } as any,
            ];
          }
        } else {
          // Children within limit, just recurse normally
          clone.contents = clampContents(originalKids, nodePath);
        }
      }

      out.push(clone);
    });
    return out;
  };

  useEffect(() => {
    if (unique) Global.global.unique = unique;
    if (backendPrefix) Global.global.backendPrefix = backendPrefix;

    // Guard: tests may not supply a databus; avoid calling subscribe on undefined
    if (!databus) {
      return;
    }

    const signal = databus.subscribe((e) => {
      const newRootsString = JSON.stringify(e.providers.current.roots);
      setRootsString(newRootsString);

      const { lastRootUsed } = e.providers.current;

      if (true || lastRootUsed) { 
        const currentRoot = e.providers.current?.roots?.find(
          (r) => r.name === lastRootUsed,
        );

        setRootLabel(currentRoot?.label);
        setSelectedRoot(currentRoot?.name);
        setNavtreeUrlState(currentRoot?.navtree);
      }

      const navigation = e.contexts?.main?.navigation;

      // an empty string is a valid value for navigation...
      if (typeof navigation !== 'undefined') {
        const next = navigation.split('/').map((s: string) => {
          try { return decodeURIComponent(s); } catch { return s; }
        });
        setSelectedItem((prev) => {
          const prevKey = Array.isArray(prev) ? joinPath(prev) : undefined;
          const nextKey = joinPath(next);
          return prevKey === nextKey ? prev : next;
        });
      }
    });

    return () => signal.detach();
  }, []);

  useEffect(() => {
    setRoots(rootsString ? JSON.parse(rootsString) : undefined);
  }, [rootsString]);

  useEffect(() => {
    const buildExpandedSet = (navtree: Navtree) => {
      const newSet: string[][] = new Array();

      let contents = navtree.contents;

      const processContents = (contents: NavtreeContent[], path: string[]) => {
        contents.forEach((content) => {
          const localPath = [...path];

          localPath.push(content.name || "");
          if (content.expanded) {
            newSet.push(localPath);
          }

          if (content.contents) {
            processContents(content.contents, localPath);
          }
        });
      };

      processContents(contents, []);

      // For any expandable node with no contents, add an empty array
      // so oj-navigation-list will allow the user to expand it
      const stubCollections = (contents: NavtreeContent[]) => {
        contents?.forEach((content) => {
          if (content.expandable && !content.contents) {
            content.contents = [];
          }

          stubCollections(content.contents || []);
        });
      };

      stubCollections(contents);

      const newExpanded = new KeySetImpl<string[]>(newSet);

      setExpandedItems(newExpanded);
    };

    if (navtreeString) {
      const newNavtree: Navtree = JSON.parse(navtreeString);

      setNavtree(newNavtree);
      
      dataProvider.data = newNavtree.contents;

      buildExpandedSet(newNavtree);
      // Mark the active root as ready once navtree data has been applied
      setRootReady(true);
    }
  }, [navtreeString]);

  useEffect(() => { 
    if (selectedItem) {

      // special case...
      if (selectedItem.length === 1 && selectedItem[0] === '') {
        return;
      }

      const selectedNode = findNodeFromEvent(selectedItem);
      const key = joinPath(selectedItem);

      // If a node cannot be found corresponding to selectedItem it could be one of two things:
      //   1. it hasn't been fetched yet, in which case a single call to refreshTree will reify the node
      //   2. selectedItem is bogus and refreshTree won't reify the node (should never happen)
      // Prevent repeated async refreshes for the same unresolved selection: only attempt once per key.
      if (!selectedNode || (selectedNode.expandable && !selectedNode.expanded)) {
        if (!triedSelectionsRef.current.has(key)) {
          triedSelectionsRef.current.add(key);
          refreshTree([...expandedItems.values(), selectedItem]);
        }
      } else {
        // If the node is now present, allow future re-attempts for other keys
        triedSelectionsRef.current.delete(key);
      }
    }
  }, [selectedItem]);

  // Rebuild the data provider whenever the server navtree or the local "show all" state changes
  useEffect(() => {
    if (navtree) {
      const clamped = clampContents(navtree.contents, []);
      dataProvider.data = clamped;
    }
  }, [navtree, showAllSet]);

  const refreshTree = (pathsToExpand?: string[][]) => {
    const payload = buildSparseNavtree(pathsToExpand);
    try { Logger.info(JSON.stringify(payload)); } catch { Logger.info(String(payload)); }
    if (navtreeUrlState) {
      _post(navtreeUrlState, JSON.stringify(payload))
        .then((r) => r.text())
        .then((s) => setNavtreeString(s));
    }
  };

  useEffect(refreshTree, [navtreeUrlState]);

  // Listen for global refresh requests (navtree scope)
  useEffect(() => {
    const unsubscribe = subscribeToRefresh((detail: RefreshDetail) => {
      const scope = detail?.scope || {};
      if (scope.navtree) {
        const keysIter = (expandedItems)?.values?.();
        const keys = keysIter ? Array.from(keysIter) : undefined;
        refreshTree(keys);
      }
    });
    return unsubscribe;
  }, [expandedItems, navtreeUrlState]);

  // given an expand or select event, return the corresponding node from the navtree
  const findNodeFromEvent = (path: Array<string>) => {
    if (navtree) {
      let contents = navtree.contents;
      let node: NavtreeContent | undefined;
      path.forEach((segment) => {
        node = contents.find((c) => c.name === segment);

        if (!node) {
          return null;
        }

        contents = node.contents || [];
      });

      return node;
    }
  };

  // When passing the navtree argument to the backend, the only thing that matters is what nodes are expanded,
  // so build a sparsely populated tree to pass in
  const buildSparseNavtree = (pathsToExpand: string[][] | undefined) => {
    const content = {} as NavtreeContent;

    const expandedItemsArray = [];

    if (pathsToExpand) {
      expandedItemsArray.push(...pathsToExpand);
    }

    expandedItemsArray.forEach((key) => {
      let localContent = content;

      key.forEach((pathSegment) => {
        let newNode = localContent.contents?.find(
          (e) => e.name === pathSegment,
        );

        if (!newNode) {
          newNode = {};
          localContent.contents = localContent.contents || [];
          localContent.contents.push(newNode);
        }

        newNode.name = pathSegment;
        newNode.expanded = true;

        localContent = newNode;
      });
    });

    return content;
  };

  // on selectedChanged, expand the selected node (and refresh navtree) and navigate to the resource
  const selectedChangeHandler = (
    event: ojNavigationList.selectionChanged<
      NavtreeContent["name"],
      NavtreeContent
    >,
  ) => {
    if (event.detail.updatedFrom === "internal") {
      // Update active root based on the list where the selection occurred
      const listRoot = (event.target as HTMLElement)?.getAttribute("data-tree") || undefined;
      if (listRoot && listRoot !== selectedRoot) {
        setSelectedRoot(listRoot);
      }

      // find the navtree node by navigating the event path
      const path = event.detail.value as any as Array<string>;
      const last = Array.isArray(path) ? path[path.length - 1] : undefined;
      // Intercept "Show all / Show less" sentinel items
      if (last === "__more__" || last === "__less__") {
        const parentPath = Array.isArray(path) ? path.slice(0, -1) : [];
        const key = joinPath(parentPath);
        const next = new Set(showAllSet);
        if (last === "__more__") next.add(key);
        else next.delete(key);
        setShowAllSet(next);
        return;
      }

      setSelectedItem(path);
      refreshTree([...expandedItems.values(), path]);

      const node = findNodeFromEvent(path);

      if (node?.resourceData?.resourceData) {
        context?.routerController?.navigateToAbsolutePath(
          node?.resourceData.resourceData,
        );
      } else if (node?.type === 'group') {
        context?.routerController?.navigateToAbsolutePath(`/api/-current-/group/${selectedRoot}/${path.map(encodeURIComponent).join('/')}`);
      }
    }
  };

  // on expandedChanged, take the set of expanded elements from the event and apply them to
  // the navtree and refresh
  const expandedChangeHandler = (
    event: ojNavigationList.expandedChanged<
      NavtreeContent["name"],
      NavtreeContent
    >,
  ) => {
    if (event.detail.updatedFrom === "internal") {
      const keys = (
        event.detail.value as any as KeySetImpl<Array<string>>
      ).values();

      refreshTree(Array.from(keys));
    }
  };

  const navItemTemplate = (
    item: ojNavigationList.ItemContext<NavtreeContent["name"], NavtreeContent>,
  ) => {
    return (
      <li>
        <a href="">
          <span
            class={
              "oj-navigationlist-item-icon " +
              item.data.icons +
              " " +
              getIconClass(item.data)
            }
          ></span>
          {item.data.label}
        </a>
      </li>
    );
  };

  const expandHandler = (
    event: CollapsibleElement.ojExpand,
  ): void => {
    const target = event.target as HTMLElement;

    if (target?.tagName.toLowerCase() === "oj-collapsible") {
      const expandingRoot = (event.target as CollapsibleElement).dataset.id;
      if (expandingRoot && expandingRoot !== selectedRoot) {
        // Clear previous root's UI state to avoid flash when switching roots
        setSelectedItem(undefined);
        setExpandedItems(new KeySetImpl<string[]>([]));
        setRootReady(false);
        // Immediately reflect UI state
        setSelectedRoot(expandingRoot);
        // Navigate to the new root; databus will confirm selectedRoot shortly after
        context?.routerController?.navigateToAbsolutePath(
          "/api/-current-/group/" + expandingRoot,
        );
      }
    }
  };

  const rootCollapseHandler = (event: CollapsibleElement.ojCollapse): void => {
    const collapsingRoot = (event.target as CollapsibleElement)?.dataset.id;
    if (collapsingRoot) {
      // Clear UI state for the collapsing root so it reopens from a clean slate
      setSelectedItem(undefined);
      setExpandedItems(new KeySetImpl<string[]>([]));
      if (collapsingRoot === selectedRoot) {
        setSelectedRoot(undefined);
      }
    }
  };

  const collapseHandler = (event: ojNavigationList.ojCollapse) => {
    const key = event.detail.key as string[];

    let newExpandedItems = expandedItems;

    for (const value of newExpandedItems.values()) {
      if (value.length < key.length) {
        continue;
      }

      if (value.join("/").startsWith(key.join("/"))) {
        newExpandedItems = newExpandedItems.delete([value]);
      }
    }
    setExpandedItems(newExpandedItems);
  };


  const getNavTree = (root:string='') => {
    const selectionForList = (!roots || roots.length <= 1)
      ? selectedItem
      : (selectedRoot === root ? selectedItem : undefined);
    const rootObj = roots?.find(r => r.name === root);
    const ariaLabel = rootObj
      ? Translations.applyParameters(t["wrc-navtree"]?.ariaLabel?.provider, [rootObj.label])
      : t["wrc-navtree"]?.ariaLabel?.default;
    return (
      <oj-navigation-list
        key={`${root || 'single'}`}
        class={navListClass}
        data-tree={ root }
        drillMode= "collapsible"
        aria-label={ariaLabel}
        selection={selectionForList}
        expanded={expandedItems}
        data={dataProvider}
        onselectionChanged={selectedChangeHandler}
        onexpandedChanged={expandedChangeHandler}
        onojCollapse={collapseHandler}
        rootLabel={t["wrc-navtree"].labels.root}
      >
        <template slot="itemTemplate" render={navItemTemplate}></template>
      </oj-navigation-list>
    );
  };

  const getAccordion = () => (
    <>
      <oj-accordion
        class={panelBgClass}
        multiple={false}
        expanded={selectedRoot ? [selectedRoot] : []}
      >
        {roots?.map((root) => (
          <oj-collapsible
            id={root.name}
            key={root.name}
            class={panelBgClass}
            data-id={root.name}
            onojExpand={expandHandler}
            onojCollapse={rootCollapseHandler}
            icon-position="start"
            // variant="horizontal-rule"
          >
            <span slot="header" class="">
              <span
                class={ICONS[root.name] + " oj-navigationlist-item-icon"}
              ></span>
              <span class="oj-navigationlist-item-label">
                &nbsp;{root.label}
              </span>
            </span>
            {selectedRoot === root.name && rootReady
              ? getNavTree(root.name)
              : null}
          </oj-collapsible>
        ))}
      </oj-accordion>
      <div style={{ height: "5rem" }} />
    </>
  );

  return (
    <div class="wrc-nav-tree oj-text-color-secondary">
      {roots && roots.length > 1 ? getAccordion() : getNavTree()}
    </div>
  );
}

export const NavTree: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof NavTreeImpl>>
> = registerCustomElement("wrc-nav-tree", NavTreeImpl);
