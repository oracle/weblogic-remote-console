define(['exports', 'preact/hooks'], (function(e,n){"use strict";const r=["error","warning","confirmation","info","none"];e.useMessageSeverity=function(e){return n.useMemo((()=>void 0===e?void 0:e.reduce(((e,n)=>{const o=n.severity||"error";return r.indexOf(e)<r.indexOf(o)?e:o}),"none")),[e])}}));
//# sourceMappingURL=useMessageSeverity-1d69e1ae.js.map
