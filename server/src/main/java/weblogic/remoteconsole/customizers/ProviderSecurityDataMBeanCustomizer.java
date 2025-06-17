// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
//import weblogic.remoteconsole.common.repodef.BeanValueDef;
import weblogic.remoteconsole.common.repodef.CustomActionInputFormDef;
import weblogic.remoteconsole.common.repodef.CustomLegalValueDef;
import weblogic.remoteconsole.common.repodef.CustomPageActionParamDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepo;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing security providers' data
 */
public class ProviderSecurityDataMBeanCustomizer {

  public static PageDef customizeExportDataActionInputFormDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeMigrateDataActionInputFormDef(ic, uncustomizedPageDef, true);
  }

  public static PageDef customizeImportDataActionInputFormDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef
  ) {
    return customizeMigrateDataActionInputFormDef(ic, uncustomizedPageDef, false);
  }

  private static PageDef customizeMigrateDataActionInputFormDef(
    InvocationContext ic,
    PageDef uncustomizedPageDef,
    boolean isExport
  ) {
    MigrationProviderInfo providerInfo = new MigrationProviderInfo(ic, isExport);
    ActionInputFormDef uncustomizedInputFormDef = uncustomizedPageDef.asActionInputFormDef();
    CustomActionInputFormDef customizedInputFormDef = new CustomActionInputFormDef(uncustomizedInputFormDef);
    List<PageActionParamDef> customizedParamDefs = new ArrayList<>();
    for (PageActionParamDef uncustomizedParamDef : uncustomizedInputFormDef.getParamDefs()) {
      String name = uncustomizedParamDef.getParamName();
      if ("Format".equals(name)) {
        if (providerInfo.getSupportedFormats().size() > 1) {
          customizedParamDefs.add(
            customizeFormatParamDef(
              uncustomizedParamDef,
              customizedInputFormDef,
              providerInfo.getSupportedFormats()
            )
          );
        } else {
          // Remove the format property since there's only one choice.
        }
      } else if ("Constraints".equals(name)) {
        if (providerInfo.getSupportedConstraints().isEmpty()) {
          // Remove the constraints property since this provider doesn't support any
        } else {
          customizedParamDefs.add(uncustomizedParamDef);
        }
      } else {
        customizedParamDefs.add(uncustomizedParamDef);
      }
    }
    customizedInputFormDef.setParamDefs(customizedParamDefs);
    return customizedInputFormDef;
  }

  private static CustomPageActionParamDef customizeFormatParamDef(
    PageActionParamDef uncustomizedFormatDef,
    CustomActionInputFormDef customizedInputFormDef,
    List<String> supportedFormats
  ) {
    CustomPageActionParamDef customizedFormatDef =
      new CustomPageActionParamDef(uncustomizedFormatDef).inputFormDef(customizedInputFormDef);
    List<LegalValueDef> legalValueDefs = new ArrayList<>();
    for (String supportedFormat : supportedFormats) {
      legalValueDefs.add(
        new CustomLegalValueDef()
          .fieldDef(customizedFormatDef)
          .value(new StringValue(supportedFormat))
          .label(new LocalizableString(supportedFormat))
      );
    }
    return customizedFormatDef.legalValueDefs(legalValueDefs);
  }

  public static void customizeExportDataActionInputForm(InvocationContext ic, Page page) {
    customizeMigrateDataActionInputForm(ic, page, true);
  }

  public static void customizeImportDataActionInputForm(InvocationContext ic, Page page) {
    customizeMigrateDataActionInputForm(ic, page, false);
  }

  private static void customizeMigrateDataActionInputForm(
    InvocationContext ic,
    Page page,
    boolean isExport
  ) {
    MigrationProviderInfo providerInfo = new MigrationProviderInfo(ic, isExport);
    customizePageIntro(ic, page, isExport, providerInfo.getSupportedConstraints());
    List<FormProperty> customizedProperties = new ArrayList<>();
    Form form = page.asForm();
    for (FormProperty uncustomizedProperty : form.getProperties()) {
      String name = uncustomizedProperty.getName();
      if ("FileName".equals(name)) {
        String fullTypeName = getSecurityProviderTypeDef(ic).getTypeName();
        String providerType = StringUtils.removeSuffix(StringUtils.getLeafClassName(fullTypeName), "MBean");
        customizedProperties.add(
          new FormProperty(
            uncustomizedProperty.getFieldDef(),
            new StringValue(providerType + ".dat") // TBD - should we use the provider's name instead?
          )
        );
      } else if ("Format".equals(name)) {
        customizedProperties.add(
          new FormProperty(
            uncustomizedProperty.getFieldDef(),
            new StringValue(providerInfo.getSupportedFormats().get(0))
          )
        );
      } else if ("Constraints".equals(name)) {
        customizedProperties.add(
          new FormProperty(
            uncustomizedProperty.getFieldDef(),
            new PropertiesValue(new Properties())
          )
        );
      } else {
        customizedProperties.add(uncustomizedProperty);
      }
    }
    form.getProperties().clear();
    form.getProperties().addAll(customizedProperties);
  }

  private static void customizePageIntro(
    InvocationContext ic,
    Page page,
    boolean isExport,
    List<String> supportedConstraints
  ) {
    String intro =
      ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML());
    if (!supportedConstraints.isEmpty()) {
      LocalizableString ls = (isExport)
        ? LocalizedConstants.EXPORT_SECURITY_DATA_CONSTRAINTS_INTRO
        : LocalizedConstants.IMPORT_SECURITY_DATA_CONSTRAINTS_INTRO;
      String constraintsIntro =
        ic.getLocalizer().localizeString(ls, formatSupportedConstraints(supportedConstraints));
      intro = intro + constraintsIntro;
    }
    page.setLocalizedIntroductionHTML(intro);
  }
  
  private static String formatSupportedConstraints(List<String> supportedConstraints) {
    StringBuilder sb = new StringBuilder();
    boolean first = true;
    for (String supportedConstraint : supportedConstraints) {
      if (!first) {
        sb.append(", ");
      }
      sb
        .append("<code>")
        .append(supportedConstraint)
        .append("</code>");
      first = false;
    }
    return sb.toString();
  }

  public static Value exportData(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return migrateData(ic, pageActionDef, formProperties, true);
  }

  public static Value importData(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return migrateData(ic, pageActionDef, formProperties, false);
  }

  public static Value migrateData(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties,
    boolean isExport
  ) {
    MigrationProviderInfo providerInfo = new MigrationProviderInfo(ic, isExport);
    Value filenameValue =
      CustomizerUtils.findRequiredFormProperty("FileName", formProperties).getValue().asSettable().getValue();
    Value formatValue = getFormatValue(formProperties, providerInfo.getSupportedFormats());
    Value constraintsValue = getConstraintsValue(formProperties);
    String actionName = (isExport) ? "exportData" : "importData";
    BeanTreePath providerBTP = getSecurityProviderBTP(ic);
    BeanActionDef actionDef = getSecurityProviderTypeDef(ic).getActionDef(actionName);
    List<BeanActionArg> args = List.of(
      new BeanActionArg(actionDef.getParamDef("format"), formatValue),
      new BeanActionArg(actionDef.getParamDef("filename"), filenameValue),
      new BeanActionArg(actionDef.getParamDef("constraints"), constraintsValue)
    );
    return
      ic
        .getPageRepo()
        .getBeanRepo()
        .asBeanReaderRepo()
        .invokeAction(ic, providerBTP, actionDef, args)
        .getResults();
  }

  private static Value getFormatValue(List<FormProperty> formProperties, List<String> supportedFormats) {
    FormProperty prop = CustomizerUtils.findOptionalFormProperty("Format", formProperties);
    if (prop != null) {
      return prop.getValue().asSettable().getValue();
    } else {
      return new StringValue(supportedFormats.get(0));
    }
  }

  private static Value getConstraintsValue(List<FormProperty> formProperties) {
    FormProperty prop = CustomizerUtils.findOptionalFormProperty("Constraints", formProperties);
    if (prop != null) {
      return prop.getValue().asSettable().getValue();
    } else {
      return new PropertiesValue(new Properties());
    }
  }

  private static class ExportProviderInfo extends MigrationProviderInfo {
    private ExportProviderInfo(InvocationContext ic) {
      super(ic, true);
    }
  }

  private static class ImportProviderInfo extends MigrationProviderInfo {
    private ImportProviderInfo(InvocationContext ic) {
      super(ic, false);
    }
  }

  private static class MigrationProviderInfo {
    private List<String> supportedFormats = new ArrayList<>();
    private List<String> supportedConstraints = new ArrayList<>();

    private MigrationProviderInfo(InvocationContext ic, boolean isExport) {
      String supportedFormatsPropertyName =
        (isExport) ? "SupportedExportFormats" : "SupportedImportFormats";
      String supportedConstraintsPropertyName =
        (isExport) ? "SupportedExportConstraints" : "SupportedImportConstraints";
      BeanTreePath providerBTP = getSecurityProviderBTP(ic);
      BeanTypeDef providerTypeDef = getSecurityProviderTypeDef(ic);
      BeanPropertyDef supportedFormatsPropertyDef =
        providerTypeDef.getPropertyDef(supportedFormatsPropertyName);
      BeanPropertyDef supportedConstraintsPropertyDef =
        providerTypeDef.getPropertyDef(supportedConstraintsPropertyName);
      BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
      builder.addProperty(providerBTP, supportedFormatsPropertyDef);
      builder.addProperty(providerBTP, supportedConstraintsPropertyDef);
      BeanReaderRepoSearchResults searchResults = builder.search().getResults();
      BeanSearchResults providerResults = searchResults.getBean(providerBTP);
      if (providerResults == null) {
        throw Response.notFoundException();
      }
      supportedFormats = getRequiredStringsProperty(providerResults, supportedFormatsPropertyDef);
      supportedConstraints = getRequiredStringsProperty(providerResults, supportedConstraintsPropertyDef);
    }
  
    private List<String> getRequiredStringsProperty(BeanSearchResults providerResults, BeanPropertyDef propertyDef) {
      Value valuesValue = providerResults.getValue(propertyDef);
      if (valuesValue == null) {
        throw new AssertionError(providerResults.getBeanTreePath() + " does not support " + propertyDef);
      }
      List<String> rtn = new ArrayList<>();
      for (Value value : valuesValue.asArray().getValues()) {
        String val = value.asString().getValue();
        if (!StringUtils.isEmpty(val)) {
          rtn.add(val);
        } else {
          // Skip empty strings.
          // e.g. even though DefaultAuthenticator.xml sets the SupportedImportConstraints to a new String[0],
          // the mbean is returning an array with one empty string.
        }
      }
      return rtn;
    }

    private List<String> getSupportedFormats() {
      return supportedFormats;
    }

    private List<String> getSupportedConstraints() {
      return supportedConstraints;
    }
  }

  private static BeanTypeDef getSecurityProviderTypeDef(InvocationContext ic) {
    BeanTreePath providerBTP = getSecurityProviderBTP(ic);
    BeanPropertyDef typePropertyDef = providerBTP.getTypeDef().getPropertyDef("Type");
    BeanReaderRepo beanReader = ic.getPageRepo().getBeanRepo().asBeanReaderRepo();
    BeanReaderRepoSearchBuilder builder = beanReader.createSearchBuilder(ic, false);
    builder.addProperty(providerBTP, typePropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults providerResults = searchResults.getBean(providerBTP);
    if (providerResults == null) {
      throw Response.notFoundException();
    }
    Value typeValue = providerResults.getValue(typePropertyDef);
    if (typeValue != null) {
      String typeName = StringUtils.nonEmpty(typeValue.asString().getValue()) + "MBean";
      return beanReader.getBeanRepoDef().getTypeDef(typeName);
    } else {
      throw Response.notFoundException();
    }
  }

  private static BeanTreePath getSecurityProviderBTP(InvocationContext ic) {
    // Convert
    //   Domain/RealmsSecurityData/<realm>/<providerCollection/<provider>
    // to
    //   Domain/SecurityConfiguration/Realms/<realm>/<providerCollection/<provider>
    Path securityDataProviderPath = ic.getBeanTreePath().getPath();
    Path realmsRelativeProviderPath = securityDataProviderPath.subPath(2, securityDataProviderPath.length());
    Path securityProviderPath =
      new Path("Domain.SecurityConfiguration.Realms").childPath(realmsRelativeProviderPath);
    return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), securityProviderPath);
  }
}
