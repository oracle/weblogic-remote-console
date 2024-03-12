// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.Properties;

/**
 * Custom JAXRS resource for uploading and deploying AppDeploymentMBeans
 */

public class AppDeploymentMBeanUploadableCreatableBeanCollectionResource
  extends DeploymentUploadableCreatableBeanCollectionResource {

  @Override
  protected DeploymentCreateHelper createCreateHelper() {
    return new AppDeploymentMBeanCreateHelper();
  }

  private static class AppDeploymentMBeanCreateHelper extends DeploymentCreateHelper {
    @Override
    protected String getPlan() {
      return getStringProperty("PlanPath", false);
    }

    @Override
    protected Properties getDeploymentOptions() {
      Properties deploymentOptions = new Properties();
      String stageMode = getStringProperty("NonNullStagingMode", false);
      if (stageMode != null && !stageMode.equals("default")) {
        deploymentOptions.setProperty("stageMode", stageMode);
      }
      boolean adminMode = getBooleanProperty("AdminMode", false, false);
      if (adminMode) {
        deploymentOptions.setProperty("adminMode", "true");
      }
      return deploymentOptions;
    }
  }
}
