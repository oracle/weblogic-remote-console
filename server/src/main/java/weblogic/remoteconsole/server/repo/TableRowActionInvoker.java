// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
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
    Response<PageDef> pageDefResponse = getPageDef();
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    if (pageDef.isSliceTableDef()) {
      invokeResponse = sliceTableInvokeAction(pageDef.asSliceTableDef());
    } else {
      if (StringUtils.isEmpty(tableActionDef.getActionMethod())) {
        invokeResponse = standardInvokeAction();
      } else {
        invokeResponse = customInvokeAction();
      }
    }
    if (!invokeResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(invokeResponse);
      return response;
    }
    response.copyMessages(invokeResponse);
    // table row actions don't return anything so ignore the value that the bean action returned
    return response;
  }

  private Response<Value> sliceTableInvokeAction(SliceTableDef sliceTableDef) {
    Method method = CustomizerInvocationUtils.getMethod(sliceTableDef.getActionMethod());
    CustomizerInvocationUtils.checkSignature(
      method,
      CUSTOMIZER_RETURN_TYPE,
      InvocationContext.class,
      TableActionDef.class
    );
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    args.add(tableActionDef);
    Object responseAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
    @SuppressWarnings("unchecked")
    Response<Value> customizerResponse = (Response<Value>)responseAsObject;
    return customizerResponse;
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
