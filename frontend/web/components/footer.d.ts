import { h } from "preact";
import "ojs/ojswitch";
type Props = {
    links?: FooterLink[];
};
type FooterLink = {
    name: string;
    linkId: string;
    linkTarget: string;
};
export declare function Footer({ links }: Props): h.JSX.Element;
export {};
