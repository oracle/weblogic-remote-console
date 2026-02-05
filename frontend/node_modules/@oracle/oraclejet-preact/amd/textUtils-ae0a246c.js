define(['exports'], (function(t){"use strict";const e=(t,e,i,r)=>t<=r&&i<=e;t.isHeightOverlap=function(t,i){return e(t.y,t.y+t.height,i.y,i.y+i.height)},t.isWidthOverlap=function(t,i){return e(t.x,t.x+t.width,i.x,i.x+i.width)},t.updateVisTextStyleProperties=function(t){if(t){const{color:e,...i}=t;return{...i,stroke:e}}return t}}));
//# sourceMappingURL=textUtils-ae0a246c.js.map
