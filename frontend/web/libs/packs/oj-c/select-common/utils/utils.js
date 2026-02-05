define(["require", "exports", "ojs/ojdataprovider", "@oracle/oraclejet-preact/utils/UNSAFE_logger"], function (require, exports, ojdataprovider_1, UNSAFE_logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_VALUE_ITEMS = exports.DEFAULT_VALUE_ITEM = exports.DEFAULT_VALUE = exports.DEFAULT_ITEM_CONTEXT = void 0;
    exports.isEmpty = isEmpty;
    exports.isSetEqual = isSetEqual;
    exports.getFilterCriterion = getFilterCriterion;
    // default values
    exports.DEFAULT_ITEM_CONTEXT = null;
    exports.DEFAULT_VALUE = null;
    exports.DEFAULT_VALUE_ITEM = null;
    exports.DEFAULT_VALUE_ITEMS = null;
    // helpers
    /**
     * Checks if the provided value is empty
     *
     * @param value A single value or an array containing values
     * @returns result of the empty check
     */
    function isEmpty(value) {
        if (!value)
            return true;
        if (Array.isArray(value))
            return value.length === 0;
        if (value instanceof Set || value instanceof Map)
            return value.size === 0;
        return false;
    }
    /**
     * Checks whether the content of two sets are the same.
     *
     * @param a First Set
     * @param b Second Set
     * @returns Equality result
     */
    function isSetEqual(a, b) {
        if (a === b)
            return true;
        if (a?.size !== b?.size)
            return false;
        const aArray = Array.from(a);
        const bArray = Array.from(b);
        return aArray.every((value, index) => value === bArray[index]);
    }
    /**
     * Get the filter criterion to use for fetching data.
     * @param dataProvider The DataProvider to fetch data from
     * @param searchText User-typed search text
     * @param paramMatchBy Array of preferred strategies for matching the search text
     * @returns Filter criterion to use for fetching data
     */
    function getFilterCriterion(dataProvider, searchText, paramMatchBy) {
        const hasSearchText = searchText && searchText.length > 0;
        if (!hasSearchText) {
            return undefined;
        }
        // slightly modify the type of arMatchBy to allow null items so that we can initialize our
        // reducer function with null
        const arMatchBy = paramMatchBy;
        const hasMatchBy = arMatchBy && arMatchBy.length > 0;
        const filterCapability = dataProvider?.getCapability('filter');
        const hasTextFilterCapability = filterCapability && filterCapability.textFilter;
        if (dataProvider && hasSearchText && !hasTextFilterCapability) {
            (0, UNSAFE_logger_1.error)('Core Pack Select: DataProvider does not support text filter.  ' +
                'Filtering results in dropdown may not work correctly.');
        }
        // JET-66079 - Add option to specify the matchBy behavior of the text filter to Core Pack Selects
        // Find the first matchBy behavior in the array that the data provider supports.
        const matchBy = dataProvider && hasTextFilterCapability && hasSearchText && hasMatchBy
            ? arMatchBy.reduce((result, curr) => {
                // if we've already found a supported matchBy, use it
                if (result) {
                    return result;
                }
                // if we've encountered 'unknown' in the array, return it because it's always supported
                if (curr === 'unknown') {
                    return curr;
                }
                // if we haven't found a supported matchBy yet, see if the current one is supported and
                // return it if so; if not log a warning
                if (curr) {
                    if (filterCapability.textFilterMatching &&
                        filterCapability.textFilterMatching.matchBy &&
                        filterCapability.textFilterMatching.matchBy.indexOf(curr) > -1) {
                        return curr;
                    }
                    (0, UNSAFE_logger_1.warn)(`Core Pack Select: DataProvider does not support text filter "${curr}" matching.  ` +
                        'Filtering results in dropdown may not work as expected.');
                }
                // if we haven't found a supported matchBy yet, return undefined and go on
                return undefined;
            }, null)
            : undefined;
        // create filter using FilterFactory so that default local filtering will happen if
        // underlying DP doesn't support its own filtering
        const filterDef = matchBy ? { text: searchText, matchBy } : { text: searchText };
        const fc = ojdataprovider_1.FilterFactory.getFilter({ filterDef });
        return fc;
    }
});
