/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!wrc/assets/assets-styles.css";

type Props = Readonly<{
  message?: string;
}>;

/**
 * 
 * 
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/assets"
 */
function AssetsImpl(
  { message = "Hello from  wrc-assets" }: Props
) {
  return <p>{message}</p>
}

export const Assets: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof AssetsImpl>>
> = registerCustomElement(
    "wrc-assets",
  AssetsImpl
);
