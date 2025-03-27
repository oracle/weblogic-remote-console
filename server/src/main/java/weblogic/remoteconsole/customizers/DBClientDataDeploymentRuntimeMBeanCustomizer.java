// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
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
  public static Value redeploySourceOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
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
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults appResults = searchResults.getBean(appBeanPath);
    if (appResults == null) {
      // the DBClientDataDirectory doesn't exist
      throw Response.notFoundException();
    }
    //Handle the source path
    FormProperty sourcePathProperty = CustomizerUtils.findRequiredFormProperty("SourcePath", formProperties);
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

  private static Value customizeAction(
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
    return response.getResults();
  }

  public static void customizeRedeployActionInputForm(InvocationContext ic, Page page) {
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
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(appCfgBTP);
    if (beanResults == null) {
      throw Response.notFoundException();
    }
    Value sourcePathValue = beanResults.getValue(sourcePathPropertyDef);
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
      List.of(
          CustomizerUtils.createFormProperty("SourcePath", oldProperties, sourcePathValue)
      );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
  }
}
