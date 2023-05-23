// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageDef;

/**
 * This class manages reading an action's input form.
 */
public class ActionInputFormReader extends FormReader {

  ActionInputFormReader(InvocationContext invocationContext) {
    super(invocationContext);
  }

  Response<Page> getInputForm() {
    Response<Page> response = new Response<>();
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    Form form = new Form();
    setPageDef(form, pageDefResponse.getResults());
    addPageInfo(form);
    for (PageActionParamDef paramDef : form.getPageDef().asActionInputFormDef().getParamDefs()) {
      form.getProperties().add(new FormProperty(paramDef, paramDef.getDefaultValue()));
    }
    return response.setSuccess(form);
  }
}
