/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { JSX } from "preact";
import { useContext } from "preact/hooks";
import { Builder } from "../../shared/controller/builder";
import { UserContext } from "../resource";
import { ListContentModel } from "../../shared/model/listcontentmodel";
import { ListDatum, Reference } from "../../shared/typedefs/rdj";
import "oj-c/card-view";
import "oj-c/action-card";
 import 'ojs/ojdefer';
import { ICONS } from "wrc/nav-tree/nav-tree";
import Breadcrumbs from "../breadcrumbs";
import NavigationToolbar from "../shared/navigationtoolbar";
import { MenuElement, ojMenu } from "ojs/ojmenu";

type Props = { listContent?: ListContentModel; pageContext?: string };

/**
 * ListBuilder renders a read-only list of items as cards.
 * Uses RDJ.data (ListDatum[]) and PDJ.presentationHint === 'cards'.
 */
export class ListBuilder extends Builder {
  readonly type = "list";
  listContent: ListContentModel | undefined;
  pageContext?: string;

  constructor(listContent: ListContentModel | undefined, pageContext?: string) {
    super();
    this.listContent = listContent;
    this.pageContext = pageContext;
  }

  public getPageTitle(): string | undefined {
    return this.listContent?.getPageTitle?.();
  }

  public getHTML() {
    return <List listContent={this.listContent} pageContext={this.pageContext} />;
  }
}

const LIST_ICONS: Record<string, string> = { 
  'edit-tree': ICONS.edit,
  'serverConfig-tree': ICONS.serverConfig,
  'domainRuntime-tree': ICONS.domainRuntime,
  'securityData-tree': ICONS.securityData,
   COLLECTION: 'oj-ux-ico-collection-alt',
   GROUP: 'oj-ux-ico-bag',
   SINGLETON: 'oj-ux-ico-content-item',
   ROOT: 'oj-ux-ico-domain' 
};

const List = ({ listContent, pageContext }: Props) => {
  const ctx = useContext(UserContext);
  const items = listContent?.getItems() || [];


  const navigate = (ref?: Reference) => {
    if (ref?.resourceData) {
      ctx?.context?.routerController?.navigateToAbsolutePath(ref.resourceData);
    }
  };

  return (
    <div>
      <Breadcrumbs model={listContent as any} />
      <NavigationToolbar pageContext={pageContext} />
      <div
        class="cfe-list-content"
        style={{
          margin: "15px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem"
        }}
      >
      {items.map((datum: ListDatum) => (
        <oj-c-action-card
          class="cfe-list-card oj-bg-neutral-30"
          style={{ height:"100%", width: "100%" }}
          onojAction={() => navigate(datum?.resourceData)}
          aria-label={datum?.name}
        >
          <div
            class="cfe-list-card-inner"
            style={{ width: '100vw', display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          >
            <span class={( LIST_ICONS[datum?.type || ''] || 'oj-ux-ico-file-unknown') + ' cfe-list-card-icon' } />
            <div class="cfe-list-card-title">{datum?.resourceData.label}</div>
            <div class="cfe-list-card-description">{datum?.description}</div>
          </div>
        </oj-c-action-card>
      ))}
      </div>
    </div>
  );
};
