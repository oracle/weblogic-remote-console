import type { LabelledLink } from '@oracle/oraclejet-preact/UNSAFE_LabelledLink';
import { ComponentProps } from 'preact';
import type { LabelledLinkProps } from './labelled-link';
type PreactLabelledLinkProps = ComponentProps<typeof LabelledLink>;
/**
 * A custom hook for determining the correct props for the preact
 * LabelledLink component based on the props of the core-pack
 * oj-c-labelled-link component.
 * @param props The props for the hook
 * @returns The props for the preact LabelledLink component
 */
export declare function useLabelledLinkPreact({ 'aria-describedby': ariaDescribedBy, href, labelEdge, labelHint, labelStartWidth, target, text, textAlign, userAssistanceDensity, onOjAction }: LabelledLinkProps): PreactLabelledLinkProps;
export {};
