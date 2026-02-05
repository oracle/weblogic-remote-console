define("oj-c/tag-cloud-item/tag-cloud-item",["require","exports","@oracle/oraclejet-preact/translationBundle","ojs/ojvcomponent"],(function(require,e,t,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TagCloudItem=e.TagCloudItemDefaults=void 0,e.TagCloudItemDefaults={categories:[]},e.TagCloudItem=(0,o.registerCustomElement)("oj-c-tag-cloud-item",(({categories:t=e.TagCloudItemDefaults.categories,...o})=>null),"TagCloudItem",{properties:{categories:{type:"Array<string>"},color:{type:"string"},label:{type:"string"},value:{type:"number|null"},url:{type:"string"},shortDesc:{type:"string"}}},{categories:[]},{"@oracle/oraclejet-preact":t.default})})),
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define("oj-c/tag-cloud-item",["require","exports","oj-c/tag-cloud-item/tag-cloud-item"],(function(require,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TagCloudItem=void 0,Object.defineProperty(e,"TagCloudItem",{enumerable:!0,get:function(){return t.TagCloudItem}})}));
//# sourceMappingURL=tag-cloud-item.js.map