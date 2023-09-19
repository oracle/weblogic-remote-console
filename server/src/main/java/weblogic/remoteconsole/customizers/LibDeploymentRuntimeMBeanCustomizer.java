// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Properties;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
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
}
