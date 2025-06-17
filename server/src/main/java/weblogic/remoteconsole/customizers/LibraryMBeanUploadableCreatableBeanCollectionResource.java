// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.Properties;

/**
 * Custom JAXRS resource for uploading and deploying LibraryMBeans
 */
public class LibraryMBeanUploadableCreatableBeanCollectionResource
  extends DeploymentUploadableCreatableBeanCollectionResource {

  @Override
  protected DeploymentCreateHelper createCreateHelper() {
    return new LibraryMBeanCreateHelper();
  }

  private static class LibraryMBeanCreateHelper extends DeploymentCreateHelper {
    @Override
    protected Properties getDeploymentOptions() {
      Properties deploymentOptions = new Properties();
      deploymentOptions.setProperty("library", "true");
      String stageMode = getStringProperty("StagingMode", false);
      if (stageMode != null && !stageMode.equals("default")) {
        deploymentOptions.setProperty("stageMode", stageMode);
      }
      String securityModel = getStringProperty("SecurityModel", false);
      if (securityModel != null && !securityModel.equals("DDOnly")) {
        deploymentOptions.setProperty("securityModel", securityModel);
      }
      return deploymentOptions;
    }
  }
}
