import "css!./dialog.css";
import { ComponentChildren, ComponentProps } from "preact";
import type { ojDialog } from "ojs/ojdialog";
type DialogProps = ComponentProps<"oj-dialog"> & {
    children: ComponentChildren;
};
export declare const Dialog: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<DialogProps> & {
    ref?: import("preact").Ref<ojDialog> | undefined;
}>;
export {};
