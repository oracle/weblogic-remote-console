/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type PictoChartContextValue = {
    supportsSelection?: boolean;
};
declare const PictoChartContext: import("preact").Context<PictoChartContextValue>;
declare const usePictoChartContext: () => PictoChartContextValue;
export { PictoChartContext, usePictoChartContext };
