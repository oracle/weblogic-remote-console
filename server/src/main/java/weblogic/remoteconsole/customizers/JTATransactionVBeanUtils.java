// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing JTATransactionVBeans.
 */
public class JTATransactionVBeanUtils {

  private static final Map<String,LocalizableString> STATUS_TO_LS = new HashMap<>();

  static {
    STATUS_TO_LS.put("active", LocalizedConstants.TX_STATUS_ACTIVE);
    STATUS_TO_LS.put("pre-preparing", LocalizedConstants.TX_STATUS_PRE_PREPARING);
    STATUS_TO_LS.put("pre-prepared", LocalizedConstants.TX_STATUS_PRE_PREPARED);
    STATUS_TO_LS.put("preparing", LocalizedConstants.TX_STATUS_PREPARING);
    STATUS_TO_LS.put("prepared", LocalizedConstants.TX_STATUS_PREPARED);
    STATUS_TO_LS.put("logging", LocalizedConstants.TX_STATUS_LOGGING);
    STATUS_TO_LS.put("committing", LocalizedConstants.TX_STATUS_COMMITTING);
    STATUS_TO_LS.put("committed", LocalizedConstants.TX_STATUS_COMMITTED);
    STATUS_TO_LS.put("rolling-back", LocalizedConstants.TX_STATUS_ROLLING_BACK);
    STATUS_TO_LS.put("marked-rollback", LocalizedConstants.TX_STATUS_MARKED_ROLLBACK);
    STATUS_TO_LS.put("rolledback", LocalizedConstants.TX_STATUS_ROLLEDBACK);
    STATUS_TO_LS.put("new", LocalizedConstants.TX_STATUS_NEW);
    STATUS_TO_LS.put("suspended", LocalizedConstants.TX_STATUS_SUSPENDED);
    STATUS_TO_LS.put("unknown", LocalizedConstants.TX_STATUS_UNKNOWN);
  }

  private JTATransactionVBeanUtils() {
  }

  public static List<TableRow> processTransactions(InvocationContext ic, JsonArray transactions) {
    List<TableRow> rows = new ArrayList<>();
    for (int i = 0; transactions != null && i < transactions.size(); i++) {
      rows.add(processTransaction(ic, transactions.getJsonObject(i)));
    }
    return rows;
  }

  private static TableRow processTransaction(InvocationContext ic, JsonObject transaction) {
    TableRow row = new TableRow();
    row.setIdentifier(getStringField(transaction, "xid"));
    row.getCells().add(
      new TableCell(
        "Name",
        new StringValue(getStringField(transaction, "name"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Xid",
        new StringValue(getStringField(transaction, "xid"))
      )
    );
    row.getCells().add(
      new TableCell(
        "CoordinatorURL",
        new StringValue(getStringField(transaction, "coordinatorURL"))
      )
    );
    row.getCells().add(
      new TableCell(
        "TimeoutSeconds",
        new IntValue(transaction.getInt("timeoutSeconds"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Status",
        new StringValue(localizeStatus(ic, getStringField(transaction, "status")))
      )
    );
    row.getCells().add(
      new TableCell(
        "RollbackReason",
        new StringValue(getStringField(transaction, "rollbackReason"))
      )
    );
    row.getCells().add(
      new TableCell(
        "SecondsActive",
        new IntValue(transaction.getInt("secondsActive"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Servers",
        new PropertiesValue(getNamesAndStatuses(ic, transaction, "servers"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Resources",
        new PropertiesValue(getNamesAndStatuses(ic, transaction, "resources"))
      )
    );
    row.getCells().add(
      new TableCell(
        "GlobalProperties",
        new PropertiesValue(getPropertiesField(transaction, "globalProperties"))
      )
    );
    row.getCells().add(
      new TableCell(
        "LocalProperties",
        new PropertiesValue(getPropertiesField(transaction, "localProperties"))
      )
    );
    return row;
  }

  private static Properties getNamesAndStatuses(InvocationContext ic, JsonObject jo, String field) {
    Properties props = new Properties();
    JsonArray ja = jo.getJsonArray(field);
    for (int i = 0; ja != null && i < ja.size(); i++) {
      JsonObject j = ja.getJsonObject(i);
      props.setProperty(
        getStringField(j, "name"),
        localizeStatus(ic, getStringField(j, "status"))
      );
    }
    return props;
  }

  private static String localizeStatus(InvocationContext ic, String status) {
    String s = StringUtils.nonNull(status);
    LocalizableString ls = STATUS_TO_LS.get(s);
    return (ls != null) ? ic.getLocalizer().localizeString(ls) : s; 
  }

  private static Properties getPropertiesField(JsonObject jo, String field) {
    Properties props = new Properties();
    JsonObject jprops = jo.getJsonObject(field);
    if (jprops != null) {
      for (String key : jprops.keySet()) {
        props.setProperty(key, StringUtils.nonNull(getStringField(jprops, key)));
      }
    }
    return props;
  }

  private static String getStringField(JsonObject jo, String field) {
    if (jo.containsKey(field) && !jo.isNull(field)) {
      return jo.getString(field);
    }
    return null;
  }
}
