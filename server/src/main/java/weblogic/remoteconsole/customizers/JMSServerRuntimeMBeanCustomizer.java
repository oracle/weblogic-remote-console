// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
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
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the JMSServerRuntimeMBean
 */
public class JMSServerRuntimeMBeanCustomizer {

  private JMSServerRuntimeMBeanCustomizer() {
  }

  public static Value forceCommitSelectedTransactions(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      SliceTableActionUtils
        .invokeRowAction(ic, pageActionDef, formProperties, "forceCommit", "xid")
        .getResults();
  }

  public static Value forceRollbackSelectedTransactions(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      SliceTableActionUtils
        .invokeRowAction(ic, pageActionDef, formProperties, "forceRollback", "xid")
        .getResults();
  }

  public static List<TableRow> getTransactionsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return JTATransactionVBeanUtils.processTransactions(ic, getCurrentTransactions(ic));
  }

  private static JsonArray getCurrentTransactions(InvocationContext ic) {
    // DomainRuntime.CombinedServerRuntimes.<svr>.ServerRuntime.JMSRuntime.JMSServers.<jmssvr>
    Path cbePath = ic.getBeanTreePath().getPath();

    // domainRuntime.serverRuntimes.<svr>.JMSRuntime.JMSServers.<jmssvr>.currentTransactions
    Path wlsPath = new Path("domainRuntime.serverRuntimes");
    wlsPath.addComponent(cbePath.getComponents().get(2));
    wlsPath.addComponent("JMSRuntime");
    wlsPath.addComponent("JMSServers");
    wlsPath.addComponent(cbePath.getComponents().get(6));
    wlsPath.addComponent("currentTransactions");

    JsonObjectBuilder args = Json.createObjectBuilder();

    JsonObject results =
      WebLogicRestInvoker.post(
        ic,
        wlsPath,
        args.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       ).getResults();
    JsonArray transactions = results.isNull("return") ? null : results.getJsonArray("return");
    return transactions;
  }
}
