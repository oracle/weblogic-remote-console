// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

/**
 * Handles HTTP methods for an editable mandatory singleton bean.
 */
public class EditableMandatorySingletonBeanResource extends ReadOnlyMandatorySingletonBeanResource {

  @Override
  protected Response defaultPost(JsonObject requestBody) {
    return updateSliceForm(requestBody);
  }

  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }
}
