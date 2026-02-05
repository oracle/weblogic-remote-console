export { NavTree } from "./nav-tree";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'nav-tree': any;
        }
    }
}
export { NavTreeElement } from './nav-tree';