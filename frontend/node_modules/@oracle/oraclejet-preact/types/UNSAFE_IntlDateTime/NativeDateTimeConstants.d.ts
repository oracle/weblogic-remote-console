/**
 * @license
 * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare class NativeDateTimeConstants {
    static readonly _YEAR_AND_DATE_REGEXP: RegExp;
    static readonly _YMD_REGEXP: RegExp;
    static readonly _TIME_REGEXP: RegExp;
    static readonly _TIME_FORMAT_REGEXP: RegExp;
    static readonly _YEAR_REGEXP: RegExp;
    static readonly _MONTH_REGEXP: RegExp;
    static readonly _DAY_REGEXP: RegExp;
    static readonly _WEEK_DAY_REGEXP: RegExp;
    static readonly _HOUR_REGEXP: RegExp;
    static readonly _MINUTE_REGEXP: RegExp;
    static readonly _SECOND_REGEXP: RegExp;
    static readonly _FRACTIONAL_SECOND_REGEXP: RegExp;
    static readonly _AMPM_REGEXP: RegExp;
    static readonly _WORD_REGEXP = "(\\D+?\\s*)";
    static readonly _ESCAPE_REGEXP: RegExp;
    static readonly _TOKEN_REGEXP: RegExp;
    static readonly _ZULU = "zulu";
    static readonly _LOCAL = "local";
    static readonly _AUTO = "auto";
    static readonly _INVARIANT = "invariant";
    static readonly _OFFSET = "offset";
    static readonly _ALNUM_REGEXP = "(\\D+|\\d\\d?\\D|\\d\\d?|\\D+\\d\\d?)";
    static readonly _NON_DIGIT_REGEXP = "(\\D+|\\D+\\d\\d?)";
    static readonly _NON_DIGIT_OPT_REGEXP = "(\\D*)";
    static readonly _STR_REGEXP = "(.+?)";
    static readonly _TWO_DIGITS_REGEXP = "(\\d\\d?)";
    static readonly _THREE_DIGITS_REGEXP = "(\\d{1,3})";
    static readonly _FOUR_DIGITS_REGEXP = "(\\d{1,4})";
    static readonly _SLASH_REGEXP = "(\\/)";
    static readonly _PROPERTIES_MAP: {
        MMM: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        MMMM: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        MMMMM: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        LLL: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        LLLL: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        LLLLL: {
            token: string;
            style: string;
            mLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        E: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        EE: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        EEE: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        EEEE: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        EEEEE: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        c: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        cc: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        ccc: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        cccc: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        ccccc: {
            token: string;
            style: string;
            dLen: string;
            matchIndex: number;
            key: string;
            value: string;
            regExp: string;
        };
        h: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        hh: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        K: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        KK: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        H: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        HH: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        k: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        kk: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        m: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        mm: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        s: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        ss: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        S: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        SS: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        SSS: {
            token: string;
            timePart: string;
            start1: number;
            end1: number;
            start2: number;
            end2: number;
            key: string;
            value: string;
            regExp: string;
        };
        d: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        dd: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        M: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        MM: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        L: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        LL: {
            token: string;
            key: string;
            value: string;
            getPartIdx: number;
            regExp: string;
        };
        y: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        yy: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        yyyy: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        a: {
            token: string;
            key: string;
            value: undefined;
            regExp: string;
        };
        z: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        v: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        zz: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        zzz: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        zzzz: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        Z: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        ZZ: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        ZZZ: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        X: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        XX: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        XXX: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        VV: {
            token: string;
            key: string;
            value: string;
            regExp: string;
            type: string;
        };
        G: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        GG: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        GGG: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        GGGG: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        GGGGG: {
            token: string;
            key: string;
            value: string;
            regExp: string;
        };
        '/': {
            token: string;
            regExp: string;
        };
    };
    static readonly FRACTIONAL_SECOND_MAP: {
        a: {
            key: string;
            token: string;
            value: string;
        };
        SSS: {
            key: string;
            token: string;
            value: number;
        };
        SS: {
            key: string;
            token: string;
            value: number;
        };
        S: {
            key: string;
            token: string;
            value: number;
        };
    };
    static readonly _tokenMap: {
        era: {
            short: string;
            long: string;
            narrow: string;
        };
        month: {
            short: string;
            long: string;
            narrow: string;
            numeric: string;
            '2-digit': string;
        };
        weekday: {
            short: string;
            long: string;
            narrow: string;
        };
        year: {
            numeric: string;
            '2-digit': string;
        };
        day: {
            numeric: string;
            '2-digit': string;
        };
        hour: {
            numeric: string;
            '2-digit': string;
        };
        minute: {
            numeric: string;
            '2-digit': string;
        };
        second: {
            numeric: string;
            '2-digit': string;
        };
        fractionalSecond: {
            1: string;
            2: string;
            3: string;
        };
        timeZoneName: {
            short: string;
            long: string;
        };
    };
    static readonly _dateTimeFormats: {
        dateStyle: {
            full: {
                year: string;
                month_s: string;
                month_m: string;
                weekday: string;
                day: string;
            };
            long: {
                year: string;
                month_s: string;
                month_m: string;
                day: string;
            };
            medium: {
                year: string;
                month_s: string;
                month_m: string;
                day: string;
            };
            short: {
                year: string;
                month_s: string;
                month_m: string;
                day: string;
            };
        };
        timeStyle: {
            full: {
                hour: string;
                minute: string;
                second: string;
                timeZoneName: string;
            };
            long: {
                hour: string;
                minute: string;
                second: string;
                timeZoneName: string;
            };
            medium: {
                hour: string;
                minute: string;
                second: string;
            };
            short: {
                hour: string;
                minute: string;
            };
        };
    };
    static readonly _ALPHA_REGEXP: RegExp;
    static readonly _HOUR12_REGEXP: RegExp;
    static readonly _hourCycleMap: {
        h12: string;
        h23: string;
        h11: string;
        h24: string;
    };
    static readonly _zh_tw_locales: string[];
    static readonly _zh_tw_pm_symbols: string[];
}
