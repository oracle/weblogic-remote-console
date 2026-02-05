define("oj-c/area-chart-series/area-chart-series",["require","exports","@oracle/oraclejet-preact/translationBundle","ojs/ojvcomponent"],(function(require,e,r,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AreaChartSeries=e.AreaChartSeriesDefaults=void 0,e.AreaChartSeriesDefaults={drilling:"inherit"},e.AreaChartSeries=(0,t.registerCustomElement)("oj-c-area-chart-series",(({drilling:r=e.AreaChartSeriesDefaults.drilling,...t})=>null),"AreaChartSeries",{properties:{assignedToY2:{type:"string",enumValues:["off","on"]},categories:{type:"Array<string>"},color:{type:"string"},drilling:{type:"string",enumValues:["inherit","off","on"]},lineType:{type:"string",enumValues:["curved","straight"]},markerShape:{type:"string",enumValues:["auto","square","circle","diamond","human","plus","star","triangleDown","triangleUp"]},markerColor:{type:"string"},markerDisplayed:{type:"string"},markerSize:{type:"number"},name:{type:"string"},shortDesc:{type:"string"}}},{drilling:"inherit"},{"@oracle/oraclejet-preact":r.default})})),
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define("oj-c/area-chart-series",["require","exports","oj-c/area-chart-series/area-chart-series"],(function(require,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AreaChartSeries=void 0,Object.defineProperty(e,"AreaChartSeries",{enumerable:!0,get:function(){return r.AreaChartSeries}})}));
//# sourceMappingURL=area-chart-series.js.map