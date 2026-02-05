import "oj-c/button";
import { Model } from "wrc/shared/model/common";
export type BookmarkTogglerProps = {
    pageTitle?: string;
    model: Model;
    disabled?: boolean;
    id?: string;
    class?: string;
};
export default function BookmarkToggler(props: BookmarkTogglerProps): import("preact").JSX.Element;
