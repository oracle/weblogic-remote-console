// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;
//import weblogic.remoteconsole.server.webapp.CreateResponseMapper;

public class AdvancedPolicyMBeanCustomizer {

  private AdvancedPolicyMBeanCustomizer() {
  }

  public static BaseResource createNonJMXResource(InvocationContext ic) {
    return createTypedResource(ic, null);
  }

  public static BaseResource createAdminResource(InvocationContext ic) {
    return createTypedResource(ic, "adm");
  }

  public static BaseResource createApplicationResource(InvocationContext ic) {
    return createTypedResource(ic, "app");
  }

  public static BaseResource createCOMResource(InvocationContext ic) {
    return createTypedResource(ic, "com");
  }

  public static BaseResource createEISResource(InvocationContext ic) {
    return createTypedResource(ic, "eis");
  }

  public static BaseResource createEJBResource(InvocationContext ic) {
    return createTypedResource(ic, "ejb");
  }

  public static BaseResource createJDBCResource(InvocationContext ic) {
    return createTypedResource(ic, "jdbc");
  }

  public static BaseResource createJMSResource(InvocationContext ic) {
    return createTypedResource(ic, "jms");
  }

  public static BaseResource createJMXResource(InvocationContext ic) {
    return createTypedResource(ic, "jmx");
  }

  public static BaseResource createJNDIResource(InvocationContext ic) {
    return createTypedResource(ic, "jndi");
  }

  public static BaseResource createServerResource(InvocationContext ic) {
    return createTypedResource(ic, "svr");
  }

  public static BaseResource createURLResource(InvocationContext ic) {
    return createTypedResource(ic, "url");
  }

  public static BaseResource createWebServiceResource(InvocationContext ic) {
    return createTypedResource(ic, "webservices");
  }

  public static BaseResource createWorkContextResource(InvocationContext ic) {
    return createTypedResource(ic, "workcontext");
  }

  private static BaseResource createTypedResource(InvocationContext ic, String type) {
    if (ic.getBeanTreePath().isCollection()) {
      return new CustomizedCollectionResource(type);
    } else {
      return null;
    }
  }

  public static class CustomizedCollectionResource extends CreatableBeanCollectionResource {
    private String type;

    CustomizedCollectionResource(String type) {
      this.type = type;
    }

    @Override
    protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
      return (new CustomizedCreateHelper(type)).createBean(getInvocationContext(), requestBody);
    }
  }

  private static class CustomizedCreateHelper extends CreateHelper {
    private String type;
    private String policyName = null;

    CustomizedCreateHelper(String type) {
      this.type = type;
    }
  
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties) {
      return
        ic.getPageRepo().asPageEditorRepo().create(
          ic,
          List.of(
            new FormProperty(
              new CustomPagePropertyDef(
                ic.getBeanTreePath().getTypeDef().getPropertyDef(new Path("Name"))
              ),
              new SettableValue(new StringValue(policyName))
            )
          )
        );
    }

    @Override
    protected Response<String> getKey(InvocationContext ic, List<FormProperty> properties) {
      // Domain.RealmsSecurityData.<realm>.Authorizers.<provider>:
      Path cbePath = ic.getBeanTreePath().getPath();
      String realm = cbePath.getComponents().get(2);
      String provider = cbePath.getComponents().get(4);
      Path wlsPath =
        (new Path())
          .childPath("serverConfig")
          .childPath("realmsSecurityData")
          .childPath(realm)
          .childPath("authorizers")
          .childPath(provider)
          .childPath("computePolicyName");
      JsonObjectBuilder argsBldr = Json.createObjectBuilder();
      SecurityResourceMBeanCustomizer.copySecurityResourceArgs(
        argsBldr,
        properties,
        (type != null) ? type : SecurityResourceMBeanCustomizer.getStringArg(properties, "type")
      );
      JsonObject args = argsBldr.build();
      JsonObject results =
        WebLogicRestInvoker.post(
          ic,
          wlsPath,
          args,
          false, // expanded values
          false, // save changes
          false // asynchronous
        ).getResults();
      policyName = results.isNull("return") ? null : results.getString("return");
      return (new Response<String>()).setSuccess(policyName);
    }
  }
}
