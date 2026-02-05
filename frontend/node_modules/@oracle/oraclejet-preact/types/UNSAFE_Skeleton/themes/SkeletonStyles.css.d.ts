import { ComponentThemeType } from '../../UNSAFE_Theme';
type SkeletonStyles = typeof styles;
type SkeletonTheme = ComponentThemeType<SkeletonStyles>;
declare const skeletonAnimation: string;
declare const skeletonBase: string;
declare const styles: {
    skeletonBase: string;
};
export type { SkeletonStyles, SkeletonTheme };
export { skeletonBase, styles, skeletonAnimation };
