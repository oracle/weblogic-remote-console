// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.ws.rs.container.ResourceContext;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProjectUtils {
  public static String pickAName(Collection<String> checkList, String base) {
    String proposedName = null;
    for (int i = 1; i < 100000; i++) {
      proposedName = base + "-" + i;
      if (!checkList.contains(proposedName)) {
        break;
      }
      proposedName = null;
    }
    if (proposedName == null) {
      // This can't happen!
      return "";
    }
    return proposedName;
  }

  public static List<String> rowsToList(
    ResourceContext resContext,
    JsonObject object) {
    List<String> ret = new LinkedList<>();
    try {
      JsonObject rows = object.containsKey("rows")
        ? object.getJsonObject("rows")
        : object.getJsonObject("row");
      JsonArray valueArray = rows.getJsonArray("value");
      for (JsonObject row : valueArray.getValuesAs(JsonObject.class)) {
        ret.add(
          row.getJsonObject("value").getString("resourceData"));
      }
    } catch (Exception e) {
      e.printStackTrace();
      InvocationContext ic =
        WebAppUtils.getInvocationContextFromResourceContext(resContext);
      throw new FailedRequestException(
        ic.getLocalizer().localizeString(
          LocalizedConstants.REQUEST_POORLY_FORMED_MESSAGE)
      );
    }
    return ret;
  }
}
