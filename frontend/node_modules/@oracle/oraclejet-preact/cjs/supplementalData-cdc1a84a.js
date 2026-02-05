/* @oracle/oraclejet-preact: undefined */
'use strict';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
// Some day when this is supported on all browsers we can get this information from Intl/Locale/getWeekInfo.
// This returns 1 for Monday, 6 for Saturday and 7 for Sunday so we do the same here.
// Currently it is not supported on Firefox. But it is supported on v18 of nodejs, so we could build it.
// This has more information https://github.com/tc39/proposal-intl-locale-info
// This data shows the first day of the week per region. If the locale is 'en-US',
// and the first day of the week for the United States is Sunday. If the locale is 'en-GB',
// and the first day of the week for Great Britain is Monday.
// This information is used to create a calendar.
// We could generate the data during the build since it looks like nodejs v18 supports this; see
// JET-61345 use Intl.Locale weekInfo during build to generate firstDay data
const weekData = {
    firstDay: {
        '001': 1, // default first day of the week. Monday is the first day of the week according to the international standard ISO 8601.
        AE: 6,
        BH: 6,
        BR: 7,
        DZ: 6,
        EG: 6,
        IQ: 6,
        JO: 6,
        KW: 6,
        LB: 1,
        LY: 6,
        MA: 6,
        OM: 6,
        QA: 6,
        SA: 7,
        SD: 6,
        SY: 6,
        TN: 7,
        YE: 7,
        BY: 1,
        BG: 1,
        ES: 1,
        CZ: 1,
        DK: 1,
        AT: 1,
        CH: 1,
        DE: 1,
        LU: 1,
        CY: 1,
        GR: 1,
        AU: 7,
        CA: 7,
        GB: 1,
        IE: 7,
        IN: 7,
        MT: 7,
        NZ: 7,
        PH: 7,
        SG: 7,
        US: 7,
        ZA: 7,
        AR: 7,
        CL: 1,
        CO: 7,
        CR: 1,
        DO: 7,
        EC: 1,
        GT: 7,
        HN: 7,
        MX: 7,
        NI: 7,
        PA: 7,
        PE: 7,
        PR: 7,
        PY: 7,
        SV: 7,
        UY: 1,
        VE: 7,
        EE: 1,
        FI: 1,
        BE: 1,
        FR: 1,
        IL: 7,
        HR: 1,
        HU: 1,
        ID: 7,
        IS: 1,
        IT: 1,
        JP: 7,
        KR: 7,
        LT: 1,
        LV: 1,
        MK: 1,
        MY: 1,
        NO: 1,
        NL: 1,
        PL: 1,
        PT: 1,
        RO: 1,
        RU: 1,
        SK: 1,
        SI: 1,
        AL: 1,
        BA: 1,
        ME: 1,
        RS: 1,
        SE: 1,
        TH: 7,
        TR: 1,
        UA: 1,
        VN: 1,
        CN: 7,
        HK: 7,
        MO: 7,
        TW: 7
    }
};

exports.weekData = weekData;
//# sourceMappingURL=supplementalData-cdc1a84a.js.map
