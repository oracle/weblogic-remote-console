/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { ComponentProps } from "preact";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";

type SwitchProps = ComponentProps<"oj-switch"> & {
  readonlyDisplay?: boolean;
};

export const Switch = ({ readonlyDisplay = false, ...restProps }: SwitchProps) => {
  if (readonlyDisplay) {
    const switchValue = restProps.value === true;
    return (
      // Keep this text hidden from assistive technology; screen readers should announce the state from the adjacent oj-switch, while this is visual-only reinforcement.
      <span
        id={restProps.id ? `${restProps.id}-text` : undefined}
        class={restProps.class}
        aria-hidden="true"
      >
        {switchValue ? t["wrc-form"].switch.on.label : t["wrc-form"].switch.off.label}
      </span>
    );
  }

  return <oj-switch {...restProps} readonly={readonlyDisplay || restProps.readonly} />;
};