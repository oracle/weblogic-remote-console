// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * This class manages invoking actions.
 * It's an internal detail of a PageRepo. 
 */
class ActionInvoker extends PageReader {

  private PageActionDef pageActionDef;
  private List<FormProperty> formProperties;

  private static final Type CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<Value>>() {}).getType();

  private static final Type FORM_PROPERTIES_TYPE =
    (new TypeReference<List<FormProperty>>() {}).getType();

  ActionInvoker(InvocationContext invocationContext, PageActionDef pageActionDef, List<FormProperty> formProperties) {
    super(invocationContext);
    this.pageActionDef = pageActionDef;
    this.formProperties = formProperties;
  }

  Response<Void> invokeAction() {
    Response<Void> response = new Response<>();
    Response<Value> invokeResponse = null;
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    if (StringUtils.isEmpty(pageActionDef.getActionMethod())) {
      invokeResponse = standardInvokeAction();
    } else {
      invokeResponse = customInvokeAction();
    }
    if (!invokeResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(invokeResponse);
      return response;
    }
    response.copyMessages(invokeResponse);
    // table row actions don't return anything so ignore the value that the bean action returned
    return response;
  }

  private Response<Value> standardInvokeAction() {
    List<BeanActionArg> args = new ArrayList<>();
    for (FormProperty formProperty: formProperties) {
      args.add(
        new BeanActionArg(
          formProperty.getFieldDef().asBeanActionParamDef(),
          formProperty.getValue().asSettable().getValue()
        )
      );
    }
    return
      getInvocationContext().getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        getInvocationContext(),
        pageActionDef,
        args
      );
  }

  private Response<Value> customInvokeAction() {
    Method method = CustomizerInvocationUtils.getMethod(pageActionDef.getActionMethod());
    CustomizerInvocationUtils.checkSignature(
      method,
      CUSTOMIZER_RETURN_TYPE,
      InvocationContext.class,
      PageActionDef.class,
      FORM_PROPERTIES_TYPE
    );
    Object responseAsObject =
      CustomizerInvocationUtils.invokeMethod(
        method,
        List.of(
          getInvocationContext(),
          pageActionDef,
          formProperties
        )
      );
    @SuppressWarnings("unchecked")
    Response<Value> customizerResponse = (Response<Value>)responseAsObject;
    return customizerResponse;
  }
}
