// Copyright (c) 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * Custom JAXRS resource for ServerMBeans
 */
public class ServerMBeanCreatableBeanCollectionResource extends CreatableBeanCollectionResource {
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    return (new ServerMBeanCreateHelper()).createBean(getInvocationContext(), requestBody);
  }

  private static class ServerMBeanCreateHelper extends CreateHelper {
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      Response<Void> response = new Response<>();
      // Figure out the bean tree path of the new server
      Response<BeanTreePath> btpResponse = computeNewBeanPath(ic, formProperties);
      if (!btpResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(btpResponse);
      }
      BeanTreePath newServerBTP = btpResponse.getResults();
      BeanTreePath serverToCloneBTP = null;
      // We'll handle ServerToClone here.
      // Find it (if present) and make a new set of properties without it
      // (so that the bean repo doesn't try to write it out).
      List<FormProperty> nonCloneFormProperties = new ArrayList<>();
      for (FormProperty formProperty : formProperties) {
        if ("ServerToClone".equals(formProperty.getName())) {
          serverToCloneBTP = formProperty.getValue().asSettable().getValue().asBeanTreePath();
        } else {
          nonCloneFormProperties.add(formProperty);
        }
      }
      {
        Response<Void> r = super.createBean(ic, nonCloneFormProperties);
        if (!r.isSuccess()) {
          return response.copyUnsuccessfulResponse(r);
        }
      }
      if (serverToCloneBTP != null) {
        Response<Void> r = cloneBean(ic, serverToCloneBTP, newServerBTP, nonCloneFormProperties);
        if (!r.isSuccess()) {
          cleanupFailedCreate(ic, newServerBTP);
          return response.copyUnsuccessfulResponse(r);
        }
      }
      return response.setSuccess(null);
    }
  }
}
