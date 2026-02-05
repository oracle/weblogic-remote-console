/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 *
 * Databus Context for Preact components.
 * - Use DatabusProvider at the app/root level to provide the Databus instance.
 * - Call useDatabus() inside TSX components instead of threading props.
 *
 * For non-UI .ts modules, do not use global/window. Prefer dependency injection;
 * if not feasible, use a typed accessor module (setDatabus/getDatabus) set once at bootstrap.
 */
import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { FunctionalComponent, ComponentChildren } from 'preact';
import type { Databus } from 'wrc/integration/databus';

export const DatabusContext = createContext<Databus | null>(null);

type ProviderProps = {
  databus: Databus;
  children?: ComponentChildren;
};

export const DatabusProvider: FunctionalComponent<ProviderProps> = ({ databus, children }) => {
  return (
    <DatabusContext.Provider value={databus}>{children}</DatabusContext.Provider>
  );
};

/**
 * Hook to retrieve the Databus from context.
 * Throws if the provider is missing to surface wiring errors early (including tests).
 */
export function useDatabus(): Databus {
  const ctx = useContext(DatabusContext);
  if (!ctx) {
    throw new Error('DatabusContext not found. Wrap your tree with <DatabusProvider databus={...}>');
  }
  return ctx;
}
