/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "./DateRestrictionValidator"], function (require, exports, hooks_1, DateRestrictionValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateRestrictionValidator = void 0;
    /**
     * Custom hook that creates an implicit DateRestrictionValidator for oj-c-input-date-picker
     * if there is a dayFormatter property. Otherwise it will return null.
     *
     * @returns A DateRestrictionValidator instance or null
     */
    const useImplicitDateRestrictionValidator = ({ converter, dateRestrictionMessageDetail, dayFormatter, defaultRestrictionMessageDetail }) => (0, hooks_1.useMemo)(() => {
        if (!dayFormatter)
            return undefined;
        return new DateRestrictionValidator_1.DateRestrictionValidator({
            converter,
            dateRestrictionMessageDetail,
            dayFormatter,
            defaultRestrictionMessageDetail
        });
    }, [converter, dateRestrictionMessageDetail, dayFormatter, defaultRestrictionMessageDetail]);
    exports.useImplicitDateRestrictionValidator = useImplicitDateRestrictionValidator;
});
