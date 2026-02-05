/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { ExtendGlobalProps, registerCustomElement, TemplateSlot } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType, JSX, Ref, RefObject } from "preact";
import { useState, useRef, useContext } from 'preact/hooks';
import { MenuElement, ojMenu } from "ojs/ojmenu";
import "ojs/ojoption";
import "ojs/ojdialog";
import { ojDialog } from "ojs/ojdialog";
import { UserContext } from "../resource";
//To typecheck the element APIs, import as below.
import { CMenuButtonElement } from "oj-c/menu-button";

//For the transpiled javascript to load the element's module, import as below
import "oj-c/menu-button";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Resource } from "wrc/resource";
import { ModalDialogResourceContext } from "../../integration/resource-context";
import { requireAsset } from "wrc/shared/url";
import { Dialog } from "wrc/display/dialog";
import * as Logger from "ojs/ojlogger";

export type MenuItem = {
  classes: string[],
  role: string,
  dataIndex: number,
  id: string,
  value: string,
  disabled: boolean,
  path: string
};

export type MenuItemCallbackEvent = {
  menuItem: MenuItem,
  menuId: string
}

type Props = Readonly<{
  id: string,
  tooltip?: string,
  menuItems?: MenuItem[],
  selected?: (selectedValue: any) => void;
}>;

let kebabId = 0;

/**
 * 
 * 
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/kebab-menu"
 */
function KebabMenuImpl(
  { id, menuItems, selected }: Props
) {

  const ctx = useContext(UserContext);

  const menuItemRenderer = (menuId: string, menuItem: MenuItem) => {
    const e: MenuItemCallbackEvent = {
      menuItem,
      menuId
    };

    return (<oj-option id={menuItem.id} value={e}>{menuItem.value}</oj-option>);
  }

  const dialogRef = useRef<ojDialog>(null);

  const [createRDJForCreate, setRDJForCreate] = useState('');


  const handleMenuItemAction = (event: MenuElement.ojMenuAction) => {
    try { Logger.info(JSON.stringify(event.detail)); } catch { Logger.info(String(event.detail)); }

    if (event.detail.selectedValue.menuItem.id === 'create') {
      const path = event.detail.selectedValue.menuItem.path;

      // add view=createForm to url .. this really should be done in the back end...
      const u = new URL(path, 'http://localhost');

      u.searchParams.set('view', 'createForm');

      const updatedUrl = `${u.pathname}${u.search}${u.hash}`;
     
      setRDJForCreate(updatedUrl);
      dialogRef.current!.open();
    } else {
      selected?.(event.detail.selectedValue);
    }
  };

  
  const attrs = {
    src: requireAsset("wrc/assets/images/more-vertical-brn-8x24.png"),
    style: { visibility: 'visible;' },
    title: t["wrc-common"].tooltips.more.value
  }

  const menuRef = useRef<ojMenu>(null);

  const openMenu: JSX.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const anchor = e.currentTarget;

    menuRef?.current!.open(e);
  }

  // specify a resource context to dispose of the dialog when finished rather than navigating away..
  const resourceContext = new ModalDialogResourceContext(dialogRef);
  
  // focusable launcher element required for oj-menu to open properly..
  const launcherId = `launcher_${kebabId++}`;
  
  return (<>
    <oj-menu ref={menuRef} onojMenuAction={handleMenuItemAction} openOptions={{ launcher: launcherId }}>
      {
        menuItems?.map((menuItem) =>
          menuItemRenderer(id, menuItem)
        )
      }
    </oj-menu>
    <a id={launcherId} href='#' onClick={openMenu}>
      <img class='more-vertical-icon' src={attrs.src}
        title={attrs.title}></img>
    </a>
    <Dialog cancelBehavior='icon' ref={dialogRef}>
      <div slot="body">
        <Resource rdj={createRDJForCreate} unique={ctx?.unique} context={resourceContext} />
      </div>
    </Dialog>
  </>
  );
}

export const KebabMenu: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof KebabMenuImpl>>
> = registerCustomElement(
  "wrc-kebab-menu",
  KebabMenuImpl
);
