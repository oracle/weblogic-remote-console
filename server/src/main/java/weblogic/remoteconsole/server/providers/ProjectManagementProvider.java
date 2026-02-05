// Copyright (c) 2021, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;

// Clearly, this shouldn't really be an AdminServerDataProvider.  It should
// just be a provider.  The only real things in here are the roots, labels
// and names.
public class ProjectManagementProvider implements Provider {
  private String fakeName = "Project Management";

  @Override
  public String getName() {
    return fakeName;
  }

  @Override
  public String getType() {
    return AdminServerDataProviderImpl.TYPE_NAME;
  }

  @Override
  public Map<String, Root> getRoots() {
    return new HashMap<>();
  }

  @Override
  public boolean start(InvocationContext ic) {
    ic.setProvider(this);
    return true;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    return Json.createObjectBuilder()
      .add("name", getName())
      .add("providerType", getType())
      .add("lastRootUsed", "edit")
      .add("roots", Json.createArrayBuilder()
        .add(Json.createObjectBuilder()
          .add("actionsEnabled", true)
          .add("label", "Edit Tree")
          .add("name", "edit")
          .add("navtree", "/api/project/navtree"))
    ).build();
  }

  @Override
  public boolean isValidPath(String path) {
    return false;
  }

  @Override
  public void updateStatus(InvocationContext ic) {
  }

  @Override
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic) {
    LinkedHashMap<String, String> ret = new LinkedHashMap<>();
    ret.put("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.PROJECT_MANAGEMENT_STATUS_INTRODUCTION));
    return ret;
  }
}
