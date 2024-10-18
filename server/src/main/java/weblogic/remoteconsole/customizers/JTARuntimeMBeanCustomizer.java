// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the JTARuntimeMBean
 */
public class JTARuntimeMBeanCustomizer {

  private JTARuntimeMBeanCustomizer() {
  }

  public static Response<Value> forceCommitSelectedTransactions(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return SliceTableActionUtils.invokeRowAction(ic, pageActionDef, formProperties, "forceCommit", "xid");
  }

  public static Response<Value> forceRollbackSelectedTransactions(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return SliceTableActionUtils.invokeRowAction(ic, pageActionDef, formProperties, "forceRollback", "xid");
  }

  public static Response<List<TableRow>> getTransactionsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    Response<JsonArray> getResponse = getCurrentTransactions(ic);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    return response.setSuccess(JTATransactionVBeanUtils.processTransactions(ic, getResponse.getResults()));
  }

  private static Response<JsonArray> getCurrentTransactions(InvocationContext ic) {
    Response<JsonArray> response = new Response<>();

    // DomainRuntime.CombinedServerRuntimes.<svr>.ServerRuntime.JTARuntime
    Path cbePath = ic.getBeanTreePath().getPath();

    // domainRuntime.serverRuntimes.<svr>.JTARuntime.currentTransactions
    Path wlsPath = new Path("domainRuntime.serverRuntimes");
    wlsPath.addComponent(cbePath.getComponents().get(2));
    wlsPath.addComponent("JTARuntime");
    wlsPath.addComponent("currentTransactions");

    JsonObjectBuilder args = Json.createObjectBuilder();

    Response<JsonObject> transactionsResponse =
      WebLogicRestInvoker.post(
        ic,
        wlsPath,
        args.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       );
    if (!transactionsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(transactionsResponse);
    }
    JsonObject results = transactionsResponse.getResults();
    JsonArray transactions = results.isNull("return") ? null : results.getJsonArray("return");
    return response.setSuccess(transactions);
  }
}
