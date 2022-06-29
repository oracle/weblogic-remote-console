// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CustomViewCreateHelper;

/**
 * Custom JAXRS resource for the CustomViewMBean collection
 */
public class CustomViewMBeanCollectionResource extends CreatableBeanCollectionResource {

  @Override
  protected Response createCollectionChild(JsonObject requestBody) {
    return CustomViewCreateHelper.create(getInvocationContext(), requestBody);
  }
}
