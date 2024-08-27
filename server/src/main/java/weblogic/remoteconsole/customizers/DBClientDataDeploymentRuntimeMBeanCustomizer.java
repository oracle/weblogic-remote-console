// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for processing the DBClientDataDeploymentRuntimeMBean
 */

public class DBClientDataDeploymentRuntimeMBeanCustomizer {

  private DBClientDataDeploymentRuntimeMBeanCustomizer() {
  }

  /*
   * Redeploy the DBClientDataDirectory for the case where the source is on the server.
   * User may have changed location of the source.
   */
  public static Response<Value> redeploySourceOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    Response<Value> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    String appName = ic.getBeanTreePath().getLastSegment().getKey();
    BeanTreePath appBeanPath =
        BeanTreePath.create(
            ic.getBeanTreePath().getBeanRepo(),
            (new Path("Domain.DBClientDataDirectories")).childPath(appName)
        );
    BeanPropertyDef planPropertyDef =
        appBeanPath.getTypeDef().getPropertyDef(new Path("AbsoluteSourcePath"));
    builder.addProperty(appBeanPath, planPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults appResults = searchResponse.getResults().getBean(appBeanPath);
    if (appResults == null) {
      // the DBClientDataDirectory doesn't exist
      return response.setNotFound();
    }
    //Handle the source path
    FormProperty sourcePathProperty = findRequiredFormProperty("SourcePath", formProperties);
    Value sourcePathValue = sourcePathProperty.getValue().asSettable().getValue();
    Properties deploymentOptions = new Properties();
    // Now invoke the low level redeploy action:
    return
        customizeAction(
            ic,
            "redeploy_dbclient_data_directory_deploymentOptions",
            deploymentOptions,
            sourcePathValue
        );
  }


  private static FormProperty createFormProperty(
      String propName,
      List<FormProperty> oldProperties,
      Value propValue
  ) {
    return
        new FormProperty(
            findRequiredFormProperty(propName, oldProperties).getFieldDef(),
            propValue
        );
  }

  private static FormProperty findRequiredFormProperty(String propertyName, List<FormProperty> formProperties) {
    FormProperty formProperty = findOptionalFormProperty(propertyName, formProperties);
    if (formProperty == null) {
      throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
    } else {
      return formProperty;
    }
  }

  private static FormProperty findOptionalFormProperty(String propertyName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propertyName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    return null;
  }

  private static Response<Value> customizeAction(
      InvocationContext ic,
      String action,
      Properties deploymentOptions,
      Value applicationPathValue
  ) {
    Value deploymentOptionsValue = new PropertiesValue(deploymentOptions);
    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path(action));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("applicationPath"), applicationPathValue));
    args.add(new BeanActionArg(actionDef.getParamDef("deploymentOptions"), deploymentOptionsValue));
    Response<Value> response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
    if (response.isUserBadRequest() && response.getMessages().isEmpty()) {
      response.addFailureMessage(
          ic.getLocalizer().localizeString(LocalizedConstants.REFER_TO_DEPLOYMENT_TASKS_DASHBOARD)
      );
    }
    return response;
  }

  public static Response<Void> customizeRedeployActionInputForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    BeanTreePath appRtBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    String dbClientDataDirectoryName = appRtBTP.getLastSegment().getKey();
    Path appCfgPath = new Path("Domain.DBClientDataDirectories").childPath(dbClientDataDirectoryName);
    BeanTreePath appCfgBTP = BeanTreePath.create(appRtBTP.getBeanRepo(), appCfgPath);
    InvocationContext appCfgIc = new InvocationContext(ic, appCfgBTP);
    BeanTypeDef appCfgTypeDef = appCfgBTP.getTypeDef();
    BeanPropertyDef sourcePathPropertyDef = appCfgTypeDef.getPropertyDef(new Path("AbsoluteSourcePath"));
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appCfgIc, false);
    builder.addProperty(appCfgBTP, sourcePathPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(appCfgBTP);
    if (beanResults == null) {
      return response.setNotFound();
    }
    Value sourcePathValue = beanResults.getValue(sourcePathPropertyDef);
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
        List.of(
            createFormProperty("SourcePath", oldProperties, sourcePathValue)
        );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
    response.setSuccess(null);
    return response;
  }
}
