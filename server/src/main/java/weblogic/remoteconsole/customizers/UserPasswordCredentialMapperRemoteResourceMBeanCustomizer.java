// Copyright (c) 2022, 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * FortifyIssueSuppression Password Management: Password in Comment
 * Just a class name
 * Custom code for UserPasswordCredentialMapperRemoteResourceMBean
 */
public class UserPasswordCredentialMapperRemoteResourceMBeanCustomizer {

  private UserPasswordCredentialMapperRemoteResourceMBeanCustomizer() {
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
      // FortifyIssueSuppression Key Management: Empty Encryption Key
      // Just a variable name
      String key = "";
      String protocol = null;
      String remoteHost = null;
      String remotePort = null;
      String path = null;
      String method = null;
      if (findOptionalBooleanProperty(new Path("UseCrossDomainProtocol"), properties, false)) {
        protocol = "cross-domain-protocol";
        remoteHost = findOptionalStringProperty(new Path("RemoteDomain"), properties);
      } else {
        protocol = findOptionalStringProperty(new Path("Protocol"), properties);
        remoteHost = findOptionalStringProperty(new Path("RemoteHost"), properties);
        remotePort = findOptionalStringProperty(new Path("RemotePort"), properties);
        path = findOptionalStringProperty(new Path("Path"), properties);
        method = findOptionalStringProperty(new Path("Method"), properties);
      }
      if (StringUtils.notEmpty(method)) {
        key = ", method=" + method;
      }
      if (StringUtils.notEmpty(key) || StringUtils.notEmpty(path)) {
        key = ", path=" + path + key;
      }
      if (StringUtils.notEmpty(key) || StringUtils.notEmpty(remotePort)) {
        key = ", remotePort=" + remotePort + key;
      }
      if (StringUtils.notEmpty(key) || StringUtils.notEmpty(remoteHost)) {
        key = ", remoteHost=" + remoteHost + key;
      }
      if (StringUtils.notEmpty(key) || StringUtils.notEmpty(protocol)) {
        key = "protocol=" + protocol + key;
      }
      if (StringUtils.isEmpty(key)) {
        // FortifyIssueSuppression Key Management: Hardcoded Encryption Key
        // Just a variable name
        key = "protocol=";
      }
      return response.setSuccess(key);
    }
  }
}
