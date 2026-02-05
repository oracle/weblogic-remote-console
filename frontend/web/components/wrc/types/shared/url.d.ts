import { ComponentProps, h } from "preact";
export declare function assetUrl(path: string): string;
export declare function AssetImg(props: ComponentProps<"img"> & {
    src: string;
}): h.JSX.Element;
export declare function resolveAsset(src: string): string;
export declare function requireAsset(path: string): string;
export declare function RequireImg(props: ComponentProps<"img"> & {
    src: string;
}): h.JSX.Element;
