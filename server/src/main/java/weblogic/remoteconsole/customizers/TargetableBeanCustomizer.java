// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/**
 * Custom code for processing JMS targetable beans.
 */
public class TargetableBeanCustomizer {

  private static final String DEFAULT_TARGETING_ENABLED = "DefaultTargetingEnabled";
  private static final String SUB_DEPLOYMENT_NAME = "SubDeploymentName";

  private TargetableBeanCustomizer() {
  }

  // Customize writable targetable bean collection children.
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getPageRepo().isPageEditorRepo()) {
      BeanTreePath btp = ic.getBeanTreePath();
      if (btp.isCollectionChild()) {
        return new TargetableBeanEditableCollectionChildResource();
      }
    }
    return null;
  }

  // Do not display a derived subdeployment name when default targeting is in use.
  public static SettableValue getSubDeploymentName(
    @Source(property = DEFAULT_TARGETING_ENABLED) SettableValue defaultTargeting,
    @Source(property = SUB_DEPLOYMENT_NAME) SettableValue subDeploymentName
  ) {
    if (isTrue(defaultTargeting) && hasUnsetDerivedValue(subDeploymentName)) {
      return new SettableValue(new StringValue(null), false);
    }
    return subDeploymentName;
  }

  private static boolean hasUnsetDerivedValue(SettableValue settableValue) {
    if (settableValue == null || settableValue.isSet()) {
      return false;
    }
    Value value = settableValue.getValue();
    return value != null && value.isString() && value.asString().getValue() != null;
  }

  private static boolean isTrue(SettableValue settableValue) {
    if (settableValue == null) {
      return false;
    }
    Value value = settableValue.getValue();
    return value != null && value.isBoolean() && value.asBoolean().getValue();
  }
}
