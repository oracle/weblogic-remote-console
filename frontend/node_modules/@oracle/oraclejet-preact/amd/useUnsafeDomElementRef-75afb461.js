define(['exports', 'preact/hooks', './unsafeDomAccess-602c5dde'], (function(e,n,t){"use strict";e.useUnsafeDomElementRef=function(e){const c=n.useRef(null);let s=e.current;const r=s;return r?.[t.UNSAFE_DOM_ACCESS]&&(s=r[t.UNSAFE_DOM_ACCESS]),c.current!==s&&(c.current=s),c}}));
//# sourceMappingURL=useUnsafeDomElementRef-75afb461.js.map
