// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * FortifyIssueSuppression Password Management: Password in Comment
 * Just a class name
 * Custom code for UserPasswordCredentialMapperJDBCModuleMBean
 */
public class UserPasswordCredentialMapperJDBCModuleMBeanCustomizer {

  private UserPasswordCredentialMapperJDBCModuleMBeanCustomizer() {
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
      Response<String> moduleResponse = findRequiredStringProperty(ic, new Path("Module"), properties);
      if (!moduleResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(moduleResponse);
      }
      Response<String> dataSourceResponse = findRequiredStringProperty(ic, new Path("DataSource"), properties);
      if (!dataSourceResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(dataSourceResponse);
      }
      return
        response.setSuccess(
          "module=" + moduleResponse.getResults() + ", dataSource=" + dataSourceResponse.getResults()
        );
    }
  }
}
