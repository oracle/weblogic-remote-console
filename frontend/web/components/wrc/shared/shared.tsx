/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!wrc/shared/shared-styles.css";

type Props = Readonly<{
  message?: string;
}>;

/**
 * 
 * 
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/shared"
 */
function SharedImpl(
  { message = "Hello from  wrc-shared" }: Props
) {
  return <p>{message}</p>
}

export const Shared: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof SharedImpl>>
> = registerCustomElement(
    "wrc-shared",
  SharedImpl
);
