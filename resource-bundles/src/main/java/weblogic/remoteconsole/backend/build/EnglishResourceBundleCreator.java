// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.backend.build;

import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

import weblogic.console.backend.build.PropertiesSorter;
import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.GroupNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.HelpTopicDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LinkDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConsoleRestExtensionConstants;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionExternalHelpDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicLocalizationUtils;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicPageDefWalker;
import weblogic.remoteconsole.common.repodef.yaml.UsageTracker;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BuiltinFilteringDashboard;
import weblogic.remoteconsole.server.repo.DashboardManager;
import weblogic.remoteconsole.server.repo.PersistedDashboard;
import weblogic.remoteconsole.server.repo.PersistedDashboards;
import weblogic.remoteconsole.server.repo.PersistedFilteringDashboard;

/**
 * The yaml files for all of the console pages (and the weblogic bean types they represent) contain
 * english strings that need to be localized.
 * <p>
 * This class reads in all of these yaml files (by starting at the domain's pages and walking
 * down to all of the other pages and types) and creates an english resource bundle for all of these
 * strings, assigning each string a resource key.
 * <p>
 * It writes this out in java properties file format to the file
 * build/console_backend_resource_bundle.properties
 */
public class EnglishResourceBundleCreator extends WebLogicPageDefWalker {

  private static final Logger LOGGER =
    Logger.getLogger(EnglishResourceBundleCreator.class.getName());

  private String bundleDir;

  private String getBundleDir() {
    return this.bundleDir;
  }

  private Properties resourceDefinitions = new Properties();

  private Properties getResourceDefinitions() {
    return this.resourceDefinitions;
  }

  private EnglishResourceBundleCreator(WebLogicMBeansVersion mbeansVersion, String bundleDir) {
    super(mbeansVersion);
    this.bundleDir = bundleDir;
  }

  public static void main(String[] args) {
    try {
      LOGGER.info("EnglishResourceBundleCreator.main");
      String bundleDir = args[0];
      UsageTracker.trackUsage();
      for (WebLogicVersion weblogicVersion : WebLogicVersions.getSupportedVersions()) {
        WebLogicMBeansVersion mbeansVersion =
          WebLogicMBeansVersions.getVersion(
            weblogicVersion,
            WebLogicMBeansVersion.ALL_CAPABILITIES
          );
        (new EnglishResourceBundleCreator(mbeansVersion, bundleDir)).create();
      }
      UsageTracker.reportMissing();
    } catch (Throwable t) {
      t.printStackTrace();
      // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
      // This is a utility and terminating the JVM is fine.
      System.exit(1);
    }
  }

  private void create() throws Exception {
    walk();
    for (LocalizableString ls : LocalizedConstants.getAllConstants()) {
      addResourceDefinition(ls);
    }
    for (LocalizableString ls : LocalizedConsoleRestExtensionConstants.getAllConstants()) {
      addResourceDefinition(ls);
    }
    addBuiltinDashboards();
    writeResourceBundles();
  }

  private void writeResourceBundles() throws Exception {
    writeResourceBundle("US English", "");
  }

  private void writeResourceBundle(String language, String languagePath) throws Exception {
    String domainVersion = getMBeansVersion().getWebLogicVersion().getDomainVersion();
    String fileName =
      getBundleDir()
        + "/"
        + WebLogicLocalizationUtils.getResourceBundleName(domainVersion)
        + languagePath
        + ".properties";
    // FortifyIssueSuppression Path Manipulation
    // This is a build utility and, therefore, such an issue is irrelevant
    FileOutputStream os = new FileOutputStream(fileName);
    try {
      PropertiesSorter.store(
        getResourceDefinitions(),
        os,
        "Remote Console WebLogic " + domainVersion + " " + language + " Resource Definitions"
      );
    } finally {
      os.close();
    }
  }

  @Override
  protected void processPageDef(PageDef pageDef) {
    addResourceDefinition(pageDef.getIntroductionHTML());
    addResourceDefinition(pageDef.getHelpPageTitle());
    processHelpTopicDefs(pageDef.getHelpTopicDefs());
    processPageActionDefs(pageDef.getActionDefs());
    if (pageDef.isSliceFormDef()) {
      processSliceFormDef(pageDef.asSliceFormDef());
    } else if (pageDef.isSliceTableDef()) {
      processSliceTableDef(pageDef.asSliceTableDef());
    } else if (pageDef.isCreateFormDef()) {
      processCreateFormDef(pageDef.asCreateFormDef());
    } else if (pageDef.isTableDef()) {
      processTableDef(pageDef.asTableDef());
    } else if (pageDef.isActionInputFormDef()) {
      processActionInputFormDef(pageDef.asActionInputFormDef());
    } else {
      throw new AssertionError("Unknown PageDef type: " + pageDef.getPagePath());
    }
  }

  private void processHelpTopicDefs(List<HelpTopicDef> helpTopicDefs) {
    for (HelpTopicDef helpTopicDef : helpTopicDefs) {
      addResourceDefinition(helpTopicDef.getLabel());
    }
  }

  private void processSliceFormDef(SliceFormDef sliceFormDef) {
    processPagePropertyDefs(sliceFormDef.getAllPropertyDefs());
    processSectionDefs(sliceFormDef.getAllSectionDefs());
  }

  private void processSliceTableDef(SliceTableDef sliceTableDef) {
    processPagePropertyDefs(sliceTableDef.getAllPropertyDefs());
  }

  private void processCreateFormDef(CreateFormDef createFormDef) {
    processPagePropertyDefs(createFormDef.getAllPropertyDefs());
    processSectionDefs(createFormDef.getAllSectionDefs());
  }

  private void processSectionDefs(List<FormSectionDef> sectionDefs) {
    for (FormSectionDef sectionDef : sectionDefs) {
      addResourceDefinition(sectionDef.getTitle());
      addResourceDefinition(sectionDef.getIntroductionHTML());
    }
  }

  private void processTableDef(TableDef tableDef) {
    processPagePropertyDefs(tableDef.getAllPropertyDefs());
  }

  private void processActionInputFormDef(ActionInputFormDef inputFormDef) {
    for (PageActionParamDef paramDef : inputFormDef.getParamDefs()) {
      processPageActionParamDef(paramDef);
    }
  }

  private void processPageActionParamDef(PageActionParamDef paramDef) {
    addResourceDefinition(paramDef.getLabel());
    addResourceDefinition(paramDef.getHelpSummaryHTML());
    addResourceDefinition(paramDef.getDetailedHelpHTML());
    for (LegalValueDef legalValueDef : paramDef.getLegalValueDefs()) {
      addResourceDefinition(legalValueDef.getLabel());
    }
  }

  private void processPageActionDefs(List<PageActionDef> actionDefs) {
    for (PageActionDef actionDef : actionDefs) {
      processPageActionDef(actionDef);
    }
  }

  private void processPageActionDef(PageActionDef actionDef) {
    addResourceDefinition(actionDef.getLabel());
    if (actionDef.isInvokable()) {
      addResourceDefinition(actionDef.getHelpLabel());
      {
        LocalizableString message = actionDef.getSuccessMessage();
        if (message != null) {
          addResourceDefinition(message);
        }
      }
      {
        LocalizableString message = actionDef.getFailureMessage();
        if (message != null) {
          addResourceDefinition(message);
        }
      }
      addResourceDefinition(actionDef.getHelpSummaryHTML());
      addResourceDefinition(actionDef.getDetailedHelpHTML());
      PageActionExternalHelpDef externalHelpDef = actionDef.getExternalHelpDef();
      if (externalHelpDef != null) {
        addResourceDefinition(externalHelpDef.getLabel());
        addResourceDefinition(externalHelpDef.getIntroLabel());
        addResourceDefinition(externalHelpDef.getTitle());
      }
      ActionInputFormDef inputFormDef = actionDef.getInputFormDef();
      if (inputFormDef != null) {
        processPageDef(inputFormDef);
      }
    }
    processPageActionDefs(actionDef.getActionDefs());
  }

  private void processPagePropertyDefs(List<PagePropertyDef> propertyDefs) {
    for (PagePropertyDef propertyDef : propertyDefs) {
      processPagePropertyDef(propertyDef);
    }
  }

  private void processPagePropertyDef(PagePropertyDef propertyDef) {
    addResourceDefinition(propertyDef.getLabel());
    addResourceDefinition(propertyDef.getHelpSummaryHTML());
    addResourceDefinition(propertyDef.getDetailedHelpHTML());
    addResourceDefinition(propertyDef.getPresentationDef().getInlineFieldHelp());
    for (LegalValueDef legalValueDef : propertyDef.getLegalValueDefs()) {
      addResourceDefinition(legalValueDef.getLabel());
    }
    PagePropertyExternalHelpDef externalHelpDef = propertyDef.getExternalHelpDef();
    if (externalHelpDef != null) {
      addResourceDefinition(externalHelpDef.getLabel());
      addResourceDefinition(externalHelpDef.getIntroLabel());
      addResourceDefinition(externalHelpDef.getTitle());
    }
    // Get the property's default values to force them to be constructed and validated
    // (since we don't have a separate walker during the build that we use to detect yaml/customizer errors).
    propertyDef.getSecureDefaultValue();
    propertyDef.getProductionDefaultValue();
    propertyDef.getDefaultValue();
  }

  @Override
  protected void processTypeDef(BeanTypeDef typeDef) {
    addResourceDefinition(typeDef.getInstanceNameLabel());
    for (BeanChildDef childDef : typeDef.getChildDefs()) {
      addResourceDefinition(childDef.getLabel());
      addResourceDefinition(childDef.getSingularLabel());
    }
    // Get all the customizers to force them to be constructed and validated
    // (since we don't have a separate walker during the build that we use to detect yaml/customizer errors).
    typeDef.getDeleteCustomizerDef();
    for (BeanPropertyDef propertyDef : typeDef.getPropertyDefs()) {
      propertyDef.getGetValueCustomizerDef();
      propertyDef.getGetOptionsCustomizerDef();
    }
  }

  @Override
  protected void processGroupNavTreeNodeDef(GroupNavTreeNodeDef def) {
    if (def.getDescription() != null) {
      addResourceDefinition(def.getDescription());
    }
    addResourceDefinition(def.getLabel());
  }

  @Override
  protected void processNavTreeNodeDef(NavTreeNodeDef navTreeNodeDef) {
    addResourceDefinition(navTreeNodeDef.getLabel());
  }

  @Override
  protected void processSliceDef(SliceDef sliceDef) {
    addResourceDefinition(sliceDef.getLabel());
  }

  @Override
  protected void processLinkDef(LinkDef linkDef) {
    addResourceDefinition(linkDef.getLabel());
    LocalizableString nfm = linkDef.getNotFoundMessage();
    if (nfm != null) {
      addResourceDefinition(linkDef.getNotFoundMessage());
    }
  }

  private void addBuiltinDashboards() {
    PersistedDashboards dashboards = DashboardManager.createPersistedBuiltinDashboards();
    for (Map.Entry<String,PersistedDashboard> entry : dashboards.getDashboards().entrySet()) {
      addBuiltinDashboard(entry.getKey(), entry.getValue());
    }
  }

  private void addBuiltinDashboard(String name, PersistedDashboard dashboard) {
    if (dashboard.isFilteringDashboard()) {
      addBuiltinFilteringDashboard(name, dashboard.asFilteringDashboard());
    }
  }

  private void addBuiltinFilteringDashboard(String name, PersistedFilteringDashboard dashboard) {
    addResourceDefinition(
      BuiltinFilteringDashboard.getNameLabel(name)
    );
    addResourceDefinition(
      BuiltinFilteringDashboard.getDescriptionLabel(name, dashboard.getDescription())
    );
  }

  private void addResourceDefinition(LocalizableString localizableString) {
    if (localizableString.isUnlocalized()) {
      return;
    }
    if (localizableString.isEmpty()) {
      return;
    }
    getResourceDefinitions().setProperty(localizableString.getResourceBundleKey(), localizableString.getEnglishText());
  }
}
