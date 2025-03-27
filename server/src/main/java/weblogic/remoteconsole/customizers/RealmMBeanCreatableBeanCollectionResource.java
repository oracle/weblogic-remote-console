// Copyright (c) 2024, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * Custom JAXRS resource for RealmMBeans
 */
public class RealmMBeanCreatableBeanCollectionResource extends CreatableBeanCollectionResource {
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    return (new RealmMBeanCreateHelper()).createBean(getInvocationContext(), requestBody);
  }

  private static class RealmMBeanCreateHelper extends CreateHelper {
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      Response<Void> response = new Response<>();
      // Figure out the bean tree path of the new server
      Response<BeanTreePath> btpResponse = computeNewBeanPath(ic, formProperties);
      if (!btpResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(btpResponse);
      }
      BeanTreePath newRealmBTP = btpResponse.getResults();
      boolean createDefaultProviders = false;
      List<FormProperty> realmFormProperties = new ArrayList<>();
      for (FormProperty formProperty : formProperties) {
        if ("CreateDefaultProviders".equals(formProperty.getName())) {
          createDefaultProviders =
            formProperty.getValue().asSettable().getValue().asBoolean().getValue();
        } else {
          realmFormProperties.add(formProperty);
        }
      }
      {
        Response<Void> r = super.createBean(ic, realmFormProperties);
        if (!r.isSuccess()) {
          return response.copyUnsuccessfulResponse(r);
        }
      }
      if (createDefaultProviders) {
        Response<Void> r = createDefaultProviders(new InvocationContext(ic, newRealmBTP));
        if (!r.isSuccess()) {
          cleanupFailedCreate(ic, newRealmBTP);
          return response.copyUnsuccessfulResponse(r);
        }
      }
      return response.setSuccess(null);
    }

    private Response<Void> createDefaultProviders(InvocationContext newRealmIC) {
      Response<Void> response = new Response<>();
      Response<BeanTreePath> cr = null;
      cr =
        createProvider(
          newRealmIC,
          "AuthenticationProviders",
          "DefaultAuthenticator",
          "weblogic.security.providers.authentication.DefaultAuthenticator"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "AuthenticationProviders",
          "DefaultIdentityAsserter",
          "weblogic.security.providers.authentication.DefaultIdentityAsserter"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "Authorizers",
          "XACMLAuthorizer",
          "weblogic.security.providers.xacml.authorization.XACMLAuthorizer"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "RoleMappers",
          "XACMLRoleMapper",
          "weblogic.security.providers.xacml.authorization.XACMLRoleMapper"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "Adjudicator",
          "DefaultAdjudicator",
          "weblogic.security.providers.authorization.DefaultAdjudicator"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "CredentialMappers",
          "DefaultCredentialMapper",
          "weblogic.security.providers.credentials.DefaultCredentialMapper"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      cr =
        createProvider(
          newRealmIC,
          "CertPathProviders",
          "WebLogicCertPathProvider",
          "weblogic.security.providers.pk.WebLogicCertPathProvider"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      {
        BeanTreePath cppBTP = cr.getResults();
        Response<Void> ur =
          getEditorRepo(newRealmIC).updateBean(
            newRealmIC,
            createPropertyValues(
              newRealmIC.getBeanTreePath(),
              Map.of("CertPathBuilder", cppBTP)
            )
          );
        if (!ur.isSuccess()) {
          return response.copyUnsuccessfulResponse(ur);
        }
      }
      cr =
        createProvider(
          newRealmIC,
          "PasswordValidators",
          "SystemPasswordValidator",
          "com.bea.security.providers.authentication.passwordvalidator.SystemPasswordValidator"
        );
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      {
        BeanTreePath pvBTP = cr.getResults();
        InvocationContext pvIC = new InvocationContext(newRealmIC, pvBTP);
        Response<Void> ur =
          getEditorRepo(pvIC).updateBean(
            pvIC,
            createPropertyValues(
              pvBTP,
              getTypeDef(pvIC, "SystemPasswordValidatorMBean"),
              Map.of(
                "MinPasswordLength", new IntValue(8),
                "MinNumericOrSpecialCharacters", new IntValue(1)
              )
            )
          );
        if (!ur.isSuccess()) {
          return response.copyUnsuccessfulResponse(ur);
        }
      }
      return response.setSuccess(null);
    }

    private Response<BeanTreePath> createProvider(
      InvocationContext realmIC,
      String childName,
      String providerName,
      String providerType
    ) {
      Response<BeanTreePath> response = new Response<>();
      BeanTreePath realmBTP = realmIC.getBeanTreePath();
      BeanTypeDef realmTypeDef = realmBTP.getTypeDef();
      BeanTreePath childBTP = realmBTP.childPath(new Path(childName));
      InvocationContext childIC = new InvocationContext(realmIC, childBTP);
      BeanPropertyValues values =
        createPropertyValues(
          childBTP,
          Map.of(
            "Name", new StringValue(providerName),
            "Type", new StringValue(providerType)
          )
        );
      Response<Void> cr = getEditorRepo(realmIC).createBean(childIC, values);
      if (!cr.isSuccess()) {
        return response.copyUnsuccessfulResponse(cr);
      }
      BeanTreePath spBTP = null;
      if (childBTP.isCollection()) {
        // collection
        spBTP =
          BeanTreePath.create(
            realmBTP.getBeanRepo(),
            childBTP.getPath().childPath(providerName)
          );
      } else {
        // singleton
        spBTP = childBTP;
      }
      return response.setSuccess(spBTP);
    }

    private BeanPropertyValues createPropertyValues(BeanTreePath btp, Map<String,Value> values) {
      return createPropertyValues(btp, btp.getTypeDef(), values);
    }

    private BeanPropertyValues createPropertyValues(BeanTreePath btp, BeanTypeDef typeDef, Map<String,Value> values) {
      BeanPropertyValues rtn = new BeanPropertyValues(btp);
      for (Map.Entry<String,Value> e : values.entrySet()) {
        rtn.addPropertyValue(
          new BeanPropertyValue(
            typeDef.getPropertyDef(new Path(e.getKey())),
            new SettableValue(e.getValue())
          )
        );
      }
      return rtn;
    }
  
    private BeanTypeDef getTypeDef(InvocationContext ic, String typeName) {
      return ic.getPageRepo().getBeanRepo().getBeanRepoDef().getTypeDef(typeName);
    }

    private BeanEditorRepo getEditorRepo(InvocationContext ic) {
      return ic.getPageRepo().getBeanRepo().asBeanEditorRepo();
    }
  }
}
