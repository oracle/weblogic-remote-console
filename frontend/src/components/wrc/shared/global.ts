/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// This is temporary until we get a store implementation (i.e. react-redux)
import type { Databus } from "wrc/integration/databus";

export namespace Global {
  export type GlobalState = {
    unique: string;
    databus?: Databus;
    backendPrefix?: string;
    killSwitch?: boolean;
  };

  export const global: GlobalState = {
    unique: "",
    databus: undefined,
    killSwitch: false,
  };
}

export {};
