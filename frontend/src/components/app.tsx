/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { registerCustomElement } from "ojs/ojvcomponent";
import { useEffect } from "preact/hooks";
import Context = require("ojs/ojcontext");
import { Content } from "./content/index";
import * as Config from 'ojs/ojconfig';
import CspExpressionEvaluator = require('ojs/ojcspexpressionevaluator');

export const App = registerCustomElement(
  "app-root",
  () => {
    useEffect(() => {
      Context.getPageContext().getBusyContext().applicationBootstrapComplete();
    }, []);
    
    // Use the JET CSP-compliant evaluator because default expression evaluation
    // can be blocked by CSP (unsafe-eval). This must be set before Knockout
    // bindings are applied for the first time.
    Config.setExpressionEvaluator(new CspExpressionEvaluator({}));

    return (
        <Content />
    );
  }
);
