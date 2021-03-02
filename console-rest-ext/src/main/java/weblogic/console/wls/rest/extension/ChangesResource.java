// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import org.glassfish.admin.rest.utils.JsonFilter;
import weblogic.management.rest.lib.bean.resources.CustomSingletonChildResource;
import weblogic.management.rest.lib.bean.utils.EditUtils;

/**
 * Returns the unactivated (saved and unsaved) changes in the default edit session.
 */
public class ChangesResource extends CustomSingletonChildResource {

  @Override
  protected JSONObject getModel(JsonFilter.Scope filter) throws Exception {
    return
      ChangesFormatter.formatChanges(
        invocationContext(),
        filter,
        EditUtils.getEditAccess(invocationContext().request()).getUnactivatedChanges()
      );
  }
}
