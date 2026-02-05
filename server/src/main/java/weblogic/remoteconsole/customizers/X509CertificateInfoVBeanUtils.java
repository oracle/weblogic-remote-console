// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing X509CerticateInfoVBeans
 */
public class X509CertificateInfoVBeanUtils {

  private X509CertificateInfoVBeanUtils() {
  }

  public static List<TableRow> processCertificates(InvocationContext ic, JsonArray certificates) {
    Map<String,TableRow> identifierToRow = new TreeMap<>();
    for (int i = 0; certificates != null && i < certificates.size(); i++) {
      TableRow row = processCertificate(ic, certificates.getJsonObject(i));
      String identifier = row.getIdentifier();
      identifierToRow.put(identifier, row);
    }
    return new ArrayList<>(identifierToRow.values());
  }

  private static TableRow processCertificate(InvocationContext ic, JsonObject certificateInfo) {
    TableRow row = new TableRow();
    String alias = getStringField(certificateInfo, "alias");
    row.setIdentifier(alias);
    row.getCells().add(
      new TableCell(
        "Alias",
        new StringValue(alias)
      )
    );
    row.getCells().add(
      new TableCell(
        "EntryType",
        new StringValue(getStringField(certificateInfo, "entryType"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Subject",
        new StringValue(getStringField(certificateInfo, "subject"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Issuer",
        new StringValue(getStringField(certificateInfo, "issuer"))
      )
    );
    row.getCells().add(
      new TableCell(
        "SerialNumber",
        new StringValue(getStringField(certificateInfo, "serialNumber"))
      )
    );
    {
      Long val = getLongField(certificateInfo, "notBefore");
      if (val != null) {
        row.getCells().add(new TableCell("NotBefore", new DateAsLongValue(val)));
      }
    }
    {
      Long val = getLongField(certificateInfo, "notAfter");
      if (val != null) {
        row.getCells().add(new TableCell("NotAfter", new DateAsLongValue(val)));
      }
    }
    return row;
  }

  private static String getStringField(JsonObject jo, String field) {
    if (jo.containsKey(field) && !jo.isNull(field)) {
      return jo.getString(field);
    }
    return null;
  }

  private static Long getLongField(JsonObject jo, String field) {
    return jo.containsKey(field) ? jo.getJsonNumber(field).longValueExact() : null;
  }
}
