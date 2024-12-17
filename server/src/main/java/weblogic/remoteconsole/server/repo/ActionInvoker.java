// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;

/**
 * This class manages invoking actions.
 * It's an internal detail of a PageRepo. 
 */
class ActionInvoker extends PageReader {

  private PageActionDef pageActionDef;
  private List<FormProperty> formProperties;

  private static final Type CUSTOMIZER_RESULTS_RETURN_TYPE =
    (new TypeReference<Value>() {}).getType();

  private static final Type CUSTOMIZER_RESPONSE_RETURN_TYPE =
    (new TypeReference<Response<Value>>() {}).getType();

  private static final Type FORM_PROPERTIES_TYPE =
    (new TypeReference<List<FormProperty>>() {}).getType();

  ActionInvoker(InvocationContext invocationContext, PageActionDef pageActionDef, List<FormProperty> formProperties) {
    super(invocationContext);
    this.pageActionDef = pageActionDef;
    this.formProperties = formProperties;
  }

  // Invoke the action. Ensure it is done in a configuration transaction if needed.
  Response<Void> invokeAction() {
    String impact = pageActionDef.getImpact();
    if (BeanActionDef.IMPACT_ACTION.equals(impact) || BeanActionDef.IMPACT_ACTION_INFO.equals(impact)) {
      // The impact is either action, action_info or unknown.
      // This action might modify mbeans. Wrap it in a config transaction.
      return ConfigurationTransactionHelper.editConfiguration(
        getInvocationContext(),
        new ConfigurationTransactionHelper.ConfigurationEditor() {
          @Override
          public Response<Void> editConfiguration() {
            return doInvokeAction();
          }
        }
      );
    } else {
      // This action doesn't modify mbeans.  Call it directly.
      return doInvokeAction();
    }
  }

  private Response<Void> doInvokeAction() {
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
      addFailureMessage(response);
      response.copyUnsuccessfulResponse(invokeResponse, true); // retain the failure message
      return response;
    }
    addSuccessMessage(response);
    response.copyMessages(invokeResponse);
    // table row actions don't return anything so ignore the value that the bean action returned
    return response;
  }

  private void addFailureMessage(Response response) {
    LocalizableString message = pageActionDef.getFailureMessage();
    if (message == null) {
      return;
    }
    response.addFailureMessage(
      getInvocationContext().getLocalizer().localizeString(message, getBeanName())
    );
  }

  private void addSuccessMessage(Response response) {
    LocalizableString message = pageActionDef.getSuccessMessage();
    if (message == null) {
      return;
    }
    response.addSuccessMessage(
      getInvocationContext().getLocalizer().localizeString(message, getBeanName())
    );
  }

  private String getBeanName() {
    BeanTreePath btp = getInvocationContext().getBeanTreePath();
    List<BeanTreePathSegment> segments = btp.getSegments();
    for (int i = segments.size() - 1; i >= 0; i--) {
      BeanTreePathSegment segment = segments.get(i);
      if (segment.isKeySet()) {
        return segment.getKey();
      }
    }
    // Must be a Domain level action.
    // The corresponding message shouldn't use {0}.
    return "";
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

  @SuppressWarnings("unchecked")
  private Response<Value> customInvokeAction() {
    Method method = CustomizerInvocationUtils.getMethod(pageActionDef.getActionMethod());
    // Most actions just return a value but some actions (e.g. downloading a log) need to return a value plus messages.
    // Support this by allowing the customizer to return to either be a Value or a Response<Value>
    boolean returnsResponse = CustomizerInvocationUtils.isReturnType(method, CUSTOMIZER_RESPONSE_RETURN_TYPE);
    CustomizerInvocationUtils.checkSignature(
      method,
      (returnsResponse) ? CUSTOMIZER_RESPONSE_RETURN_TYPE : CUSTOMIZER_RESULTS_RETURN_TYPE,
      InvocationContext.class,
      PageActionDef.class,
      FORM_PROPERTIES_TYPE
    );
    Response<Value> response = new Response<>();
    try {
      Object rtn =
        CustomizerInvocationUtils.invokeMethod(
          method,
          List.of(
            getInvocationContext(),
            pageActionDef,
            formProperties
          )
        );
      if (returnsResponse) {
        response = (Response<Value>)rtn;
      } else {
        Value results = (Value)rtn;
        response.setSuccess(results);
      }
      return response;
    } catch (ResponseException re) {
      return response.copyUnsuccessfulResponse(re.getResponse());
    }
  }
}
