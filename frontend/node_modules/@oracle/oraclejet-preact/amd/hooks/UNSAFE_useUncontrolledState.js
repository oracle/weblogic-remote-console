define(['exports', 'preact/hooks'], (function(e,t){"use strict";e.useUncontrolledState=function(e,r){const[u,n]=t.useState(e),c=t.useRef(u),s=t.useRef(r);return s.current=r,[u,t.useCallback(((e,...t)=>{n(e),c.current!==e&&(s.current?.(e,...t),c.current=e)}),[])]},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useUncontrolledState.js.map
