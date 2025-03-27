// Copyright (c) 2022, 2025, Oracle Corporation and/or its affiliates.
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
 * Custom code for processing the UserPasswordCredentialMappingMBean
 */
public class UserPasswordCredentialMappingMBeanCustomizer {

  private UserPasswordCredentialMappingMBeanCustomizer() {
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
      Response<String> wlsUserResponse = findRequiredStringProperty(ic, new Path("WLSUser"), properties);
      if (!wlsUserResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(wlsUserResponse);
      }
      String wlsUser = wlsUserResponse.getResults();
      String idd = findOptionalStringProperty(new Path("IdentityDomain"), properties);
      // TBD - use shared code from the extension to convert the wls user & idd to the name:
      StringBuilder sb = new StringBuilder();
      sb.append("WLSUser=").append(wlsUser);
      if (StringUtils.notEmpty(idd)) {
        sb.append(", identityDomain=" + idd);
      }
      return response.setSuccess(sb.toString());
    }
  }
}
