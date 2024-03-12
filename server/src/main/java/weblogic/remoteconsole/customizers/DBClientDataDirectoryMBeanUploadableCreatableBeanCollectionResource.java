// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Properties;

import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom JAXRS resource for uploading and deploying DBClientDataDirectoryMBeans
 */
public class DBClientDataDirectoryMBeanUploadableCreatableBeanCollectionResource
  extends DeploymentUploadableCreatableBeanCollectionResource {

  @Override
  protected DeploymentCreateHelper createCreateHelper() {
    return new DBClientDataDirectoryMBeanCreateHelper();
  }

  private static class DBClientDataDirectoryMBeanCreateHelper extends DeploymentCreateHelper {
    @Override
    protected List<Value> getTargets() {
      return List.of();
    }

    @Override
    protected Properties getDeploymentOptions() {
      Properties deploymentOptions = new Properties();
      deploymentOptions.setProperty("dbClientData", "true");
      return deploymentOptions;
    }
  }
}
