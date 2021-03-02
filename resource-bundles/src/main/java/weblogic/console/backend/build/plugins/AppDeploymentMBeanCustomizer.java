// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build.plugins;

import java.util.Properties;
import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.WeblogicPageSource;

import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_PLAN;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_UPLOAD_FILES;

/** Custom code for adding AppDeploymentMBean info to the english resource bundle during the build */
public class AppDeploymentMBeanCustomizer extends BaseEnglishResourceDefinitionsCustomizer {

  private static final Logger LOGGER = Logger.getLogger(AppDeploymentMBeanCustomizer.class.getName());

  public static void customizeCreateFormEnglishResourceDefinitions(
    Properties englishResourceDefinitions,
    WeblogicPageSource pageSource
  ) throws Exception {
    (new AppDeploymentMBeanCustomizer(englishResourceDefinitions, pageSource)).customize();
  }

  private AppDeploymentMBeanCustomizer(
    Properties englishResourceDefinitions,
    WeblogicPageSource pageSource
  ) {
    super(englishResourceDefinitions, pageSource);
  }

  private void customize() throws Exception {
    addProperty(
      CREATE_FORM_PROPERTY_UPLOAD_FILES,
      "Upload Files",
      "Do you want to upload the application to the Administration Server then deploy it or do you want to"
      + " deploy an application that is already on the Administration Server's file system?"
    );
    addProperty(
      CREATE_FORM_PROPERTY_SOURCE,
      "Source",
      "Select the deployable unit to upload to the Administration Server and deploy."
    );
    addProperty(
      CREATE_FORM_PROPERTY_PLAN,
      "Plan",
      "Select the deployment plan document to upload to the Administration Server and deploy."
    );
  }
}
