// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * This class contains utilities for localizing strings that are stored in the console backend's
 * resource bundle.
 * <p>
 * They're the resource-bundle module to create the english resource bundle properties file.
 * <p>
 * They're also used by the driver module to create the unlocalized and localized PDJs and to
 * localize the identiies in the RDJs
 */
public class LocalizationUtils {

  private static final String BUNDLE_NAME = "console_backend_resource_bundle";

  public static String getResourceBundleName(String weblogicVersion) {
    // Note: can't have dots in resource bundle names
    return
      BUNDLE_NAME
      + "_"
      + weblogicVersion.replace('.', '_');
  }

  // used for strings that should not be localized
  // e.g.
  //   unlocalizedTextKey("blah blah blah")
  // returns
  //   unlocalized:blah blah blah
  // This will get returned as "blah blah blah" in the PDJ,
  // regardless of the locale.
  public static String unlocalizedTextKey(String unlocalizableText) {
    return Localizer.UNLOCALIZED_PREFIX + unlocalizableText;
  }

  // used for the health state enum
  // e.g.
  //   healthStateLabelKey("ok")
  // returns
  //   healthState.ok.label
  public static final String healthStateLabelKey(String healthState) {
    return labelKey("healthState." + healthState);
  }

  // used for adding constant label, for accessing the msg specified  in LocalizedConstants.java
  public static String constantLabelKey(String constant) {
    return labelKey("constant." + constant);
  }

  // form section's title key
  //   <bean type>.<perspective>.sliceForm.<slice path>.sections.<section>.title
  public static String sectionTitleKey(
    WeblogicPageSource pageSource,
    String section
  ) {
    return sectionKey(pageSource, section) + ".title";
  }

  // form section's introductionHTML key
  //   <bean type>.<perspective>.sliceForm.<slice path>.sections.<section>.introductionHTML
  public static String sectionIntroductionHTMLKey(
    WeblogicPageSource pageSource,
    String section
  ) {
    return sectionKey(pageSource, section) + ".introductionHTML";
  }

  // weblogic bean property's help summary
  //   <bean class name>.<property name>.helpSummaryHTML
  public static String helpSummaryHTMLKey(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty property
  ) {
    return helpSummaryHTMLKey(pageSource, property.getPropertyKey());
  }

  public static String helpSummaryHTMLKey(
    WeblogicPageSource pageSource,
    String propertyKey
  ) {
    return propertyKey(pageSource, propertyKey) + ".helpSummaryHTML";
  }

  // weblogic bean property's help details
  //   <bean class name>.<property name>.detailedHelpHTML
  public static String detailedHelpHTMLKey(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty property
  ) {
    return detailedHelpHTMLKey(pageSource, property.getPropertyKey());
  }

  public static String detailedHelpHTMLKey(
    WeblogicPageSource pageSource,
    String propertyKey
  ) {
    return propertyKey(pageSource, propertyKey) + ".detailedHelpHTML";
  }

  // weblogic bean property's legal value's label
  //   <bean class name>.<property name>.legalValues.<legal value>.label
  public static String legalValueLabelKey(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty property,
    Object legalValue
  ) {
    return legalValueLabelKey(pageSource, property.getPropertyKey(), legalValue);
  }

  public static String legalValueLabelKey(
    WeblogicPageSource pageSource,
    String propertyKey,
    Object legalValue
  ) {
    String legalValueAsString = (legalValue != null) ? legalValue.toString() : "null";
    return labelKey(propertyKey(pageSource, propertyKey) + ".legalValues." + legalValueAsString);
  }

  // table page's introduction
  //   <bean class name>.table.introductionHTML
  // slice form page's introduction
  //   <bean containment path>.sliceForm.<slice path>.introductionHTML
  // create form page's introduction
  //   <bean containment path>.createForm.introductionHTML
  public static String introductionHTMLKey(WeblogicPageSource pageSource) {
    return pageKey(pageSource, false) + ".introductionHTML";
  }

  // table page's help page title
  //   <bean class name>.table.helpPageTitle
  // slice form page's help page title
  //   <bean containment path>.sliceForm.<slice path>.helpPageTitle
  // create form page's help page title
  //   <bean containment path>.createForm.helpPageTitle
  public static String helpPageTitleKey(WeblogicPageSource pageSource) {
    return pageKey(pageSource, false) + ".helpPageTitle";
  }

  // table page's help task's label
  //   <bean class name>.table.helpTasks.<position in help tasks array>.label
  // slice form page's help task's label
  //   <bean containment path>.sliceForm.<slice path>.helpTasks.<position in the help tasks
  // array>.label
  // create form page's help task's label
  //   <bean containment path>.createForm.helpTasks.<position in the help tasks array>.label
  public static String helpTaskLabelKey(
    WeblogicPageSource pageSource,
    int positionInHelpTasksArray
  ) {
    return labelKey(pageKey(pageSource) + ".helpTasks." + positionInHelpTasksArray);
  }

  // table page's help topic's label
  //   <bean class name>.table.helpTopics.<position in help topics array>.label
  // slice form page's help topic's label
  //   <bean type>.<perspective>.sliceForm.<slice path>.helpTopics.<position in the help topics
  // array>.label
  // create form page's help topic's label
  //   <bean type>.<perspective>.createForm.helpTopics.<position in the help topics array>.label
  public static String helpTopicLabelKey(
    WeblogicPageSource pageSource,
    int positionInHelpTopicsArray
  ) {
    return labelKey(pageKey(pageSource) + ".helpTopics." + positionInHelpTopicsArray);
  }

  // table page's column's label
  //   <bean type>.<perspective>.<column name>.label (if the label was defined in an mbean's yaml
  // file)
  //   <bean containment path>.table.properties.<property name>.label (if the label was defined in a
  // table's yaml file)
  // slice form or create form page's property's label
  //   <bean type>.<perspective>.<property name>.label (if the label was defined in an mbean's yaml
  // file)
  public static String propertyLabelKey(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty property,
    String pageLevelPropertyLabel
  ) {
    return propertyLabelKey(pageSource, property.getPropertyKey(), pageLevelPropertyLabel);
  }

  public static String propertyLabelKey(
    WeblogicPageSource pageSource,
    String propertyKey,
    String pageLevelPropertyLabel
  ) {
    if (StringUtils.notEmpty(pageLevelPropertyLabel)) {
      return labelKey(pageKey(pageSource) + ".properties." + propertyKey);
    } else {
      return labelKey(propertyKey(pageSource, propertyKey));
    }
  }

  // slice or create form page's property's inline field help
  public static String inlineFieldHelpKey(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty property
  ) {
    return inlineFieldHelpKey(pageSource, property.getPropertyKey());
  }

  public static String inlineFieldHelpKey(
    WeblogicPageSource pageSource,
    String propertyKey
  ) {
    // Set useActualType to false so that each pseudo-type can have its own inlineFieldHelp
    return pageKey(pageSource, false) + ".properties." + propertyKey + ".inlineFieldHelp";
  }

  // table page's top level action's label
  //   <bean containment path>.table.actions.<action name>.label
  public static String actionLabelKey(
    WeblogicPageSource pageSource,
    WeblogicActionSource action
  ) {
    return actionLabelKey(pageSource, action.getName());
  }

  public static String actionLabelKey(
    WeblogicPageSource pageSource,
    String actionKey
  ) {
    return labelKey(pageKey(pageSource) + ".actions." + actionKey);
  }

  // table page's nested action's label
  //   <bean containment path>.table.actions.<action group name>.<action name>.label
  public static String actionLabelKey(
    WeblogicPageSource pageSource,
    WeblogicActionSource actionGroup,
    WeblogicActionSource action
  ) {
    return actionLabelKey(pageSource, actionGroup.getName(), action.getName());
  }

  public static String actionLabelKey(
    WeblogicPageSource pageSource,
    String actionGroupKey,
    String actionKey
  ) {
    return labelKey(pageKey(pageSource) + ".actions." + actionGroupKey + "." + actionKey);
  }

  // property label for bean names in identities
  //   <bean type>.<<property name>.identity.label
  // note: don't include the perspective since there is never anything
  // perspective specific about identities.
  public static String propertyIdentityLabelKey(WeblogicBeanProperty property) {
    return
      labelKey(
        typeKey(property.getType())
        + "." + property.getPropertyKey()
        + ".property.identity"
      );
  }

  // type label for bean type names in identities
  //   <bean type>.identity.label
  // note: don't include the perspective since there is never anything
  // perspective specific about identities.
  public static String typeIdentityLabelKey(WeblogicBeanType type) {
    return labelKey(typeKey(type) + ".type.identity");
  }

  // slice's label
  //   slices.<grandparentslice.parentslice.childslice>.label
  public static String sliceLabelKey(Path slicePath) {
    return sliceLabelKey(slicePath.getDotSeparatedPath());
  }

  public static String sliceLabelKey(String slicePath) {
    return labelKey("slices." + slicePath);
  }

  public static String linkLabelKey(
    WeblogicPageSource pageSource,
    String label,
    boolean isCollection
  ) {
    return
      pagesKey(pageSource)
      + ".link.label."
      + (isCollection ? "collection." : "instance.")
      + label;
  }

  public static String linkNotFoundKey(
    WeblogicPageSource pageSource,
    String label,
    boolean isCollection
  ) {
    return
      pagesKey(pageSource)
      + ".link.notfound."
      + (isCollection ? "collection." : "instance.")
      + label;
  }

  // navigation group node's label
  //   navigation.groups.<group>.label
  public static String navigationGroupLabelKey(
    NavigationNodeSource navigationNodeSource
  ) {
    if (NavigationNodeSource.Type.group == navigationNodeSource.getType()) {
      return labelKey("navigation.groups." + navigationNodeSource.getLabel());
    } else {
      throw
        new AssertionError(
          "navigationNodeSource is not a group: "
          + navigationNodeSource.getType()
        );
    }
  }

  // navigation node's description
  //   <bean type>.navigation.groups.<group>.descriptionHTML for a group node
  //   <bean type>.navigation.beanProperties.<property>.descriptionHTML for a bean property node
  //   <bean type>.navigation.root.descriptionHTML for a root node
  public static String navigationNodeDescriptionHTMLKey(
    WeblogicBeanType type,
    NavigationNodeSource navigationNodeSource
  ) {
    NavigationNodeSource.Type nodeType = navigationNodeSource.getType();
    StringBuilder sb = new StringBuilder();
    sb.append(typeKey(type) + ".navigation.");
    if (NavigationNodeSource.Type.group == nodeType) {
      sb.append("groups.").append(navigationNodeSource.getLabel());
    } else if (NavigationNodeSource.Type.beanProperty == nodeType) {
      sb.append("beanProperties.").append(navigationNodeSource.getProperty());
    } else if (NavigationNodeSource.Type.root == nodeType) {
      sb.append("root");
    } else {
      throw new AssertionError("navigationNodeSource illegal type: " + nodeType);
    }
    return sb.append(".descriptionHTML").toString();
  }

  private static String pageKey(WeblogicPageSource pageSource) {
    return pageKey(pageSource, true);
  }

  private static String pageKey(WeblogicPageSource pageSource, boolean useActualType) {
    if (pageSource.isSliceForm()) {
      return sliceFormPageKey(pageSource.asSliceForm(),useActualType);
    } else if (pageSource.isTable()) {
      return tablePageKey(pageSource.asTable());
    } else if (pageSource.isCreateForm()) {
      return createFormPageKey(pageSource.asCreateForm());
    } else {
      throw new AssertionError("Invalid page source type for " + pageSource);
    }
  }

  private static String sliceFormPageKey(WeblogicSliceFormPageSource pageSource, boolean useActualType) {
    return
      pagesKey(pageSource, useActualType)
      + ".sliceForm."
      + pageSource.getSlicePagePath().getSlicePath().getDotSeparatedPath();
  }

  private static String tablePageKey(WeblogicTablePageSource pageSource) {
    return pagesKey(pageSource) + ".table";
  }

  private static String createFormPageKey(WeblogicCreateFormPageSource pageSource) {
    return pagesKey(pageSource) + ".createForm";
  }

  private static String propertyKey(WeblogicPageSource pageSource, WeblogicBeanProperty property) {
    return propertyKey(pageSource, property.getPropertyKey());
  }

  public static String propertyKey(WeblogicPageSource pageSource, String propertyKey) {
    return pagesKey(pageSource) + "." + propertyKey;
  }

  public static String sectionKey(WeblogicPageSource pageSource, String section) {
    return pagesKey(pageSource) + ".section." + section;
  }

  private static String pagesKey(WeblogicPageSource pageSource) {
    return pagesKey(pageSource, true);
  }

  private static String pagesKey(WeblogicPageSource pageSource, boolean useActualType) {
    PagesPath pagesPath = pageSource.getPagePath().getPagesPath();
    return
      new StringBuilder()
        .append(typeKey(pagesPath.getBeanType(), useActualType))
        .append(".")
        .append(pagesPath.getPerspectivePath().getPerspective())
        .toString();
  }

  private static String typeKey(WeblogicBeanType type) {
    return typeKey(type, true);
  }

  private static String typeKey(WeblogicBeanType type, boolean useActualType) {
    return (useActualType)
        ? StringUtils.getLeafClassName(type.getActualWeblogicBeanType().getName())
        : StringUtils.getLeafClassName(type.getName());
  }

  private static String labelKey(String baseKey) {
    return baseKey + ".label";
  }

}
