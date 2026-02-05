define(['exports'], (function(n){"use strict";function t(n,t){let l=null;const e=n.split("-");for(;null===l&&e.length>1;){e.pop();const n=e.join("-");t.has(n)&&(l=n)}return l}n.matchTranslationBundle=function(n,l){let e=null;for(let o=0;null===e&&o<n.length;o++){const u=n[o];e=l.has(u)?u:t(u,l)}return e}}));
//# sourceMappingURL=matchTranslationBundle-e243f90d.js.map
