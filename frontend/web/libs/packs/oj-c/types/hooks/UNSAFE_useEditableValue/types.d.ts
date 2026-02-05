import type { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
type Converter<V, DV> = {
    format(value: V): DV;
    parse(displayValue: DV): V;
};
type TranslateParseErrorFunc = (error: any) => ComponentMessageItem | undefined;
type Optional<V> = V | null | undefined;
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
export type { Converter, Optional, TranslateParseErrorFunc, ValidState };
