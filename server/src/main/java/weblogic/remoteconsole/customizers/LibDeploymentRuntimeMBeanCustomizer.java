// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Properties;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
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
 * Custom code for processing the LibDeploymentRuntimeMBean
 */
public class LibDeploymentRuntimeMBeanCustomizer {

  private LibDeploymentRuntimeMBeanCustomizer() {
  }

  /**
   * Customize the LibDeploymentRuntimeMBean's redeploy method
   */

  public static Response<Value> redeploy(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    // an empty set of targets mean invoke redeploy on all the servers the library is deployed to:
    Value targetsValue = new ArrayValue(List.of());
    Value deploymentOptionsValue = new PropertiesValue(new Properties());
    BeanActionDef actionDef =
      ic.getBeanTreePath().getTypeDef().getActionDef(new Path("redeploy_targets_deploymentOptions"));
    List<BeanActionArg> args =
      List.of(
        new BeanActionArg(actionDef.getParamDef("targets"), targetsValue),
        new BeanActionArg(actionDef.getParamDef("deploymentOptions"), deploymentOptionsValue)
      );
    return ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
  }

  public static Response<Void> customizeRedeployActionInputForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    BeanTreePath appRtBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    String libraryName = appRtBTP.getLastSegment().getKey();
    Path appCfgPath = new Path("Domain.Libraries").childPath(libraryName); // Domain/LibDeployments/MyLib
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

  private static FormProperty createFormProperty(String propName, List<FormProperty> formProperties, Value propValue) {
    return
        new FormProperty(
            findFormProperty(propName, formProperties).getFieldDef(),
            propValue
        );
  }

  private static FormProperty findFormProperty(String propName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    throw new AssertionError("Missing required form property: " + propName + " " + formProperties);
  }

}
