// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;

import weblogic.console.backend.driver.FormSection;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.driver.WeblogicProperty;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NAME;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_PLAN;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_PLAN_PATH;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE_PATH;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_TARGETS;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_UPLOAD_FILES;

/**
  * Customizes the AppDeploymentMBean's createForm's PDJ
  */
/*package*/ class AppDeploymentMBeanCreateFormPDJCustomizer extends BasePageDefinitionCustomizer {

  private static final Logger LOGGER = Logger.getLogger(AppDeploymentMBeanCreateFormPDJCustomizer.class.getName());

  /*package*/ AppDeploymentMBeanCreateFormPDJCustomizer(WeblogicPage page, WeblogicPageSource pageSource) {
    super(page, pageSource);
  }

  /**
    * Customize the app deployment create form PDJ
    */
  /*package*/ void customize() throws Exception {
    addCommonSection();
    addUploadAndDeploySection();
    addDeploySection();
  }

  private void addCommonSection() throws Exception {
    FormSection section = createSection();
    createAppDeploymentMBeanProperty(section, CREATE_FORM_PROPERTY_NAME);
    WeblogicProperty targets = createAppDeploymentMBeanProperty(section, CREATE_FORM_PROPERTY_TARGETS);
    targets.setType(TYPE_REFERENCE_DYNAMIC_ENUM);
    targets.setArray(true);
    targets.setRequired(false);
    createProperty(section, CREATE_FORM_PROPERTY_UPLOAD_FILES, TYPE_BOOLEAN);
  }

  private void addUploadAndDeploySection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(CREATE_FORM_PROPERTY_UPLOAD_FILES, true));
    createProperty(section, CREATE_FORM_PROPERTY_SOURCE, TYPE_UPLOADED_FILE);
    createProperty(section, CREATE_FORM_PROPERTY_PLAN, TYPE_UPLOADED_FILE).setRequired(false);
  }

  private void addDeploySection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(CREATE_FORM_PROPERTY_UPLOAD_FILES, false));
    createAppDeploymentMBeanProperty(section, CREATE_FORM_PROPERTY_SOURCE_PATH);
    createAppDeploymentMBeanProperty(section, CREATE_FORM_PROPERTY_PLAN_PATH).setRequired(false);
  }

  private WeblogicProperty createAppDeploymentMBeanProperty(
    FormSection section,
    String mbeanPropertyName
  ) throws Exception {
    return
      createMBeanProperty(
        section,
        mbeanPropertyName,
        "AppDeploymentMBean",
        NOT_FOLDED_PATH,
        TYPE_STRING
      );
  }
}
