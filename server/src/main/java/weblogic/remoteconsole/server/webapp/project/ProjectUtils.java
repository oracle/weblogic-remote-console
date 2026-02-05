// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

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
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Rows contain different data than expected"
      ).build());
    }
    return ret;
  }

}
