// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.FormSectionDefSource;
import weblogic.remoteconsole.common.repodef.schema.PageDefSource;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;

/**
 * Customizes the AppDeploymentMBean's create form's PDY
 */
class AppDeploymentMBeanCreateFormSourceCustomizer extends BasePageDefSourceCustomizer {

  private static final String PROP_NAME = "Name";
  private static final String PROP_TARGETS = "Targets";
  private static final String PROP_UPLOAD = "Upload";
  private static final String PROP_SOURCE = "Source";
  private static final String PROP_SOURCE_PATH = "SourcePath";
  private static final String PROP_PLAN = "Plan";
  private static final String PROP_PLAN_PATH = "PlanPath";

  AppDeploymentMBeanCreateFormSourceCustomizer(PagePath pagePath, PageDefSource pageDefSource) {
    super(pagePath, pageDefSource);
  }

  // Customize the AppDeploymentMBean create form PDY
  void customize() {
    if (getPagePath().getPagesPath().getPageRepoDef() instanceof WebLogicRestEditPageRepoDef) {
      addUploadAndDeploySections();
    } else {
      addDeployProperties();
    }
  }

  private void addUploadAndDeploySections() {
    addMainSection();
    addUploadSection();
    addDeploySection();
  }

  private void addMainSection() {
    FormSectionDefSource section = addSectionToForm();
    addMBeanPropertyToSection(section, PROP_NAME);
    addMBeanPropertyToSection(section, PROP_TARGETS);
    BeanPropertyDefCustomizerSource uploadProp =
      addNonMBeanStringPropertyToSection(
        section,
        PROP_UPLOAD,
        "Upload",
        "Do you want to upload the application to the Administration Server then deploy it or "
        + "do you want to deploy an application that is already on the Administration Server's file system?"
      );
    uploadProp.getDefinition().setType("boolean");
    setDefaultValue(uploadProp, true);
  }

  private void addUploadSection() {
    FormSectionDefSource section = addSectionToForm();
    section.setUsedIf(createUsedIf(PROP_UPLOAD, true));
    BeanPropertyDefCustomizerSource sourceProp =
      addNonMBeanStringPropertyToSection(
        section,
        PROP_SOURCE,
        "Source",
        "Select the deployable unit to upload to the Administration Server and deploy."
    );
    sourceProp.getDefinition().setType("java.io.InputStream");
    sourceProp.setOnlineName("sourcePath");
    BeanPropertyDefCustomizerSource planProp =
      addNonMBeanStringPropertyToSection(
        section,
        PROP_PLAN,
        "Plan",
        "Select the deployment plan document to upload to the Administration Server and deploy."
    );
    planProp.getDefinition().setType("java.io.InputStream");
    planProp.setOnlineName("planPath");
    planProp.setRequired(false);
  }

  private void addDeploySection() {
    FormSectionDefSource section = addSectionToForm();
    section.setUsedIf(createUsedIf(PROP_UPLOAD, false));
    addMBeanPropertyToSection(section, PROP_SOURCE_PATH);
    addMBeanPropertyToSection(section, PROP_PLAN_PATH);
  }

  private void addDeployProperties() {
    addMBeanPropertyToForm(PROP_NAME);
    addMBeanPropertyToForm(PROP_TARGETS);
    addMBeanPropertyToForm(PROP_SOURCE_PATH);
    addMBeanPropertyToForm(PROP_PLAN_PATH);
  }
}
