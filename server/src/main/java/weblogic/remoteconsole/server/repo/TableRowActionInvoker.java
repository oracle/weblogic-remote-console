// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * This class manages invoking actions on table rows.
 * It's an internal detail of a PageRepo. 
 */
class TableRowActionInvoker extends PageReader {

  private TableActionDef tableActionDef;

  private static final Type CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<Value>>() {}).getType();

  TableRowActionInvoker(InvocationContext invocationContext, TableActionDef tableActionDef) {
    super(invocationContext);
    this.tableActionDef = tableActionDef;
  }

  Response<Void> invokeAction() {
    Response<Void> response = new Response<>();
    Response<Value> invokeResponse = null;
    if (StringUtils.isEmpty(tableActionDef.getActionMethod())) {
      invokeResponse = standardInvokeAction();
    } else {
      invokeResponse = customInvokeAction();
    }
    if (!invokeResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(invokeResponse);
      return response;
    }
    // table row actions don't return anything so ignore the value that the bean action returned
    return response;
  }

  private Response<Value> standardInvokeAction() {
    return
      getInvocationContext().getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        getInvocationContext(),
        tableActionDef,
        new ArrayList<BeanActionArg>() // table row actions don't have any args
      );
  }

  private Response<Value> customInvokeAction() {
    Method method = CustomizerInvocationUtils.getMethod(tableActionDef.getActionMethod());
    CustomizerInvocationUtils.checkSignature(method, CUSTOMIZER_RETURN_TYPE, InvocationContext.class);
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    Object responseAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
    @SuppressWarnings("unchecked")
    Response<Value> customizerResponse = (Response<Value>)responseAsObject;
    return customizerResponse;
  }
}
