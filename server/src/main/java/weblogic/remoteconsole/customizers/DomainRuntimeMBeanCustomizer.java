// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.json.Json;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the DomainRuntimeMBean
 */
public class DomainRuntimeMBeanCustomizer {

  private DomainRuntimeMBeanCustomizer() {
  }

  public static void customizeEditSessionPage(InvocationContext ic, Page page) {
    Set<String> roles = new HashSet<>(WebLogicRoles.ADMIN_ROLES);
    roles.add(WebLogicRoles.DEPLOYER);
    if (!ic.getPageRepo().getBeanRepo().getBeanRepoDef().isAccessAllowed(roles)) {
      // only admins and deployers can view the state of the edit session
      return;
    }
    JsonObject status =
      WebLogicRestInvoker.get(
      ic,
      new Path("edit.changeManager"),
      false // expanded values
    ).getResults(); // throws if the GET failed
    addProperty(page, "editSession", new StringValue(status.getString("editSession")));
    boolean locked = status.getBoolean("locked");
    addProperty(page, "locked", new BooleanValue(locked));
    if (locked) {
      addProperty(page, "lockOwner", new StringValue(status.getString("lockOwner")));
      addProperty(page, "hasChanges", new BooleanValue(status.getBoolean("hasChanges")));
    }
  }

  private static void addProperty(Page page, String propertyName, Value propertyValue) {
    page.asForm().getProperties().add(
      new FormProperty(findPropertyDef(page, propertyName), propertyValue)
    );
  }

  private static PagePropertyDef findPropertyDef(Page page, String propertyName) {
    Path propertyPath = new Path(propertyName);
    for (PagePropertyDef propertyDef : page.getPageDef().getAllPropertyDefs()) {
      if (propertyDef.getPropertyPath().equals(propertyPath)) {
        return propertyDef;
      }
    }
    return null;
  }

  public static Value grabEditLock(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    WebLogicRestInvoker.post(
      ic,
      new Path("edit.consoleChangeManager.grabEditLock"),
      Json.createObjectBuilder().build(), // no args
      false, // expanded values
      false, // save changes
      false // asynchronous
    ).getResults(); // throws if the post failed
    return null;
  }
}