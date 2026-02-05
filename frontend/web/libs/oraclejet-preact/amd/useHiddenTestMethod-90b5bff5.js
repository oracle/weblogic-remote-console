define(['exports', 'preact/hooks', './LayerHost-daf96749', 'preact/jsx-runtime', 'preact/compat'], (function(e,t,n,o,r){"use strict";e.useHiddenTestMethod=function({elementRef:e,method:o,name:r}){const c=t.useContext(n.EnvironmentContext);t.useEffect((()=>{e.current&&"production"!==c.mode&&(e.current[r]=o)}),[c.mode,e,o,r])}}));
//# sourceMappingURL=useHiddenTestMethod-90b5bff5.js.map
