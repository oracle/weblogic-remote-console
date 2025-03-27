// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * FortifyIssueSuppression Password Management: Password in Comment
 * Just a class name
 * Custom code for UserPasswordCredentialMapperRAConnectionPoolMBean
 */
public class UserPasswordCredentialMapperRAConnectionPoolMBeanCustomizer {

  private UserPasswordCredentialMapperRAConnectionPoolMBeanCustomizer() {
  }

  // FortifyIssueSuppression Password Management: Password in Comment
  // Just a class name
  // Customize the UserPasswordCredentialMapping collection's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection()) {
      return new CustomizedCollectionResource();
    } else {
      return null;
    }
  }

  public static class CustomizedCollectionResource extends CreatableBeanCollectionResource {
    @Override
    protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
      return (new CustomizedCreateHelper()).createBean(getInvocationContext(), requestBody);
    }
  }

  private static class CustomizedCreateHelper extends CreateHelper {
    @Override
    protected Response<String> getKey(InvocationContext ic, List<FormProperty> properties) {
      Response<String> response = new Response<>();
      StringBuilder sb = new StringBuilder();
      Response<String> propertyResponse = findRequiredStringProperty(ic, new Path("Module"), properties);
      if (!propertyResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(propertyResponse);
      }
      String module = propertyResponse.getResults();
      sb.append("module=").append(module);
      propertyResponse = findRequiredStringProperty(ic, new Path("EISType"), properties);
      if (!propertyResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(propertyResponse);
      }
      String eisType = propertyResponse.getResults();
      sb.append(", eisType=").append(eisType);
      String connectionPool = findOptionalStringProperty(new Path("ConnectionPool"), properties);
      if (!StringUtils.isEmpty(connectionPool)) {
        sb.append(", connectionPool=").append(connectionPool);
      }
      return response.setSuccess(sb.toString());
    }
  }
}
