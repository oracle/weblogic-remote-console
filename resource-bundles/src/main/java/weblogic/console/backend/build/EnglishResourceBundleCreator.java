// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build;

import java.io.FileOutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.HelpTopicSource;
import weblogic.console.backend.pagedesc.LinkSource;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.NavigationNodeSource;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PageSourceWalker;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.pagedesc.SlicePagePath;
import weblogic.console.backend.pagedesc.SliceSource;
import weblogic.console.backend.pagedesc.WeblogicActionSource;
import weblogic.console.backend.pagedesc.WeblogicColumnSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormSource;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.pagedesc.WeblogicPropertyPresentationSource;
import weblogic.console.backend.pagedesc.WeblogicPropertySource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormSource;
import weblogic.console.backend.pagedesc.WeblogicTablePageSource;
import weblogic.console.backend.pagedesc.WeblogicTableSource;
import weblogic.console.backend.typedesc.ConsoleWeblogicBeanLegalValue;
import weblogic.console.backend.typedesc.SubType;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicVersion;
import weblogic.console.backend.typedesc.WeblogicVersions;
import weblogic.console.backend.utils.HealthStateUtils;
import weblogic.console.backend.utils.LocalizedConstants;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

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
public class EnglishResourceBundleCreator extends PageSourceWalker {

  private static final Logger LOGGER =
    Logger.getLogger(EnglishResourceBundleCreator.class.getName());

  private static final String PARA_BEGIN = "<p>";
  private static final String PARA_END = "</p>";

  private Properties resourceDefinitions = new Properties();

  private String bundleDir;

  private String getBundleDir() {
    return this.bundleDir;
  }

  private EnglishResourceBundleCreator(String weblogicVersion, String bundleDir) {
    super(
      weblogicVersion,
      true // only visit each type once
    );
    this.bundleDir = bundleDir;
  }

  public static void main(String[] args) {
    try {
      LOGGER.info("EnglishResourceBundleCreator.main");
      String bundleDir = args[0];
      for (WeblogicVersion weblogicVersion : WeblogicVersions.getSupportedVersions()) {
        (new EnglishResourceBundleCreator(weblogicVersion.getDomainVersion(), bundleDir)).create();
      }
    } catch (Throwable t) {
      t.printStackTrace();
      // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
      // This is a utility and terminating the JVM is fine.
      System.exit(1);
    }
  }

  private void create() throws Exception {
    walk();
    addIdentityLabels();
    addHealthStateLabels();
    addConstants();
    writeResourceBundles();
  }

  private Properties mockTranslateResourceDefinitions(String language) {
    Properties translatedProperties = new Properties();
    for (String key : getResourceDefinitions().stringPropertyNames()) {
      String englishValue = getResourceDefinitions().getProperty(key);
      String translatedValue = language + ": " + englishValue;
      translatedProperties.setProperty(key, translatedValue);
    }
    return translatedProperties;
  }

  private void writeResourceBundles() throws Exception {
    writeResourceBundle(getResourceDefinitions(), "US English", "");
    // Uncomment to create a mock translation for hand testing localization
    // writeResourceBundle(mockTranslateResourceDefinitions("French"), "French", "_fr");
  }

  private void writeResourceBundle(
      Properties resourceDefinitions, String language, String languagePath) throws Exception {
    String weblogicVersion = getTypes().getWeblogicVersion();
    String fileName =
      getBundleDir()
        + "/"
        + LocalizationUtils.getResourceBundleName(weblogicVersion)
        + languagePath
        + ".properties";
    // FortifyIssueSuppression Path Manipulation
    // This is a build utility and, therefore, such an issue is irrelevant
    FileOutputStream os = new FileOutputStream(fileName);
    try {
      resourceDefinitions.store(
        os,
        "Console backend " + weblogicVersion + " " + language + " resource definitions"
      );
    } finally {
      os.close();
    }
  }

  private void processPageLevelProperty(String labelKey, String propertyLabel) {
    addResourceDefinition(labelKey, propertyLabel);
  }

  private void processDetailedHelpHTML(String detailsKey, String detailedHelpHTML) {
    addResourceDefinition(detailsKey, detailedHelpHTML);
  }

  private void processHelpSummaryHTML(String summaryKey, String helpSummaryHTML) {
    addResourceDefinition(summaryKey, helpSummaryHTML);
  }

  private void processLegalValue(String key, String label) {
    addResourceDefinition(key, label);
  }

  private void processHelpTask(String name, String label) {
    addResourceDefinition(name, label);
  }

  private void processHelpTopic(String key, String label) {
    addResourceDefinition(key, label);
  }

  private Properties getResourceDefinitions() {
    return this.resourceDefinitions;
  }

  void addResourceDefinition(String key, String englishText) {
    if (StringUtils.notEmpty(englishText)) {
      getResourceDefinitions().setProperty(key, englishText);
    }
  }

  private void processPropertyPresentation(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty prop,
    WeblogicPropertySource propertySource
  ) throws Exception {
    WeblogicPropertyPresentationSource presentation = propertySource.getPresentation();
    String inlineFieldHelp = null;
    if (presentation != null) {
      inlineFieldHelp = presentation.getInlineFieldHelp();
    }
    addResourceDefinition(
      LocalizationUtils.inlineFieldHelpKey(pageSource, prop),
      inlineFieldHelp
    );
  }

  private void processBeanProperty(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty prop,
    String pageLevelPropertyLabel
  ) throws Exception {
    validateHelpHTMLProperties(pageSource, prop);
    String helpSummaryKey = LocalizationUtils.helpSummaryHTMLKey(pageSource, prop);
    String helpSummaryHTML = StringUtils.nonNull(getHelpSummaryHTML(prop));
    processHelpSummaryHTML(helpSummaryKey, helpSummaryHTML);
    String detailedHelpKey = LocalizationUtils.detailedHelpHTMLKey(pageSource, prop);
    String detailedHelpHTML = StringUtils.nonNull(getDetailedHelpHTML(pageSource, prop));
    processDetailedHelpHTML(detailedHelpKey, detailedHelpHTML);
    String labelKey = LocalizationUtils.propertyLabelKey(pageSource, prop, pageLevelPropertyLabel);
    processPageLevelProperty(labelKey, getPropertyLabel(prop, pageLevelPropertyLabel));
    collectLegalValues(pageSource, prop);
  }

  private void validateHelpHTMLProperties(WeblogicPageSource pageSource, WeblogicBeanProperty prop) {
    if (StringUtils.notEmpty(prop.getHelpHTML())) {
      if (StringUtils.notEmpty(prop.getHelpSummaryHTML())) {
        throw new AssertionError("Specified HelpHTML and HelpSummaryHTML for " + prop + " " + pageSource.getPagePath());
      }
      if (StringUtils.notEmpty(prop.getHelpDetailsHTML())) {
        throw new AssertionError("Specified HelpHTML and HelpDetailsHTML for " + prop + " " + pageSource.getPagePath());
      }
    }
  }

  private String getHelpSummaryHTML(WeblogicBeanProperty prop) {
    String pdyHelp = prop.getHelpHTML();
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified HelpHTML.
      // Use it as the summary.
      return pdyHelp;
    }
    String pdySummary = prop.getHelpSummaryHTML();
    if (StringUtils.notEmpty(pdySummary)) {
      // The PDY specified HelpDetailsHTML.
      // Use it as the summary.
      return pdySummary;
    }
    // The PDY didn't specify HelpHTML or HelpDetailsHTML.
    // Use the first sentenc of the description harvested from the bean info.
    String harvestedHelp = prop.getDescriptionHTML();
    return getSummary(harvestedHelp);
  }

  private String getDetailedHelpHTML(WeblogicPageSource pageSource, WeblogicBeanProperty prop) {
    String pdyHelp = prop.getHelpHTML();
    if (StringUtils.notEmpty(pdyHelp)) {
      // The PDY specified HelpHTML.
      // Use it as the full help.
      return pdyHelp;
    }
    String pdySummary = prop.getHelpSummaryHTML();
    String pdyDetails = prop.getHelpDetailsHTML();
    String harvestedHelp = prop.getDescriptionHTML();
    if (StringUtils.notEmpty(pdySummary)) {
      if (StringUtils.notEmpty(pdyDetails)) {
        // The PDY customized the summary and details.
        // Combine them to get the full help.
        return pdySummary + pdyDetails;
      } else {
        // The PDY customized the summary but not the details.
        // Replace the first sentence of the harested help
        // with the summary from the PDY.
        return replaceSummary(harvestedHelp, pdySummary);
      }
    } else {
      if (StringUtils.isEmpty(pdyDetails)) {
        // The PDY didn't customize the summary or details.
        // Return all the harvested help.
        return harvestedHelp;
      } else {
        // The PDY customized the details but not the summary.
        // This isn't allowed.
        throw new AssertionError(
          prop
          + " specifies helpSummaryHTML but not helpDetailsHTML: "
          + pageSource.getPagePath()
        );
      }
    }
  }

  private void collectLegalValues(WeblogicPageSource pageSource, WeblogicBeanProperty prop) {
    Map<String, String> legalValueToLabelMap = createLegalValueToLabelMap(prop);
    for (Object legalValue : prop.getLegalValues()) {
      String key = LocalizationUtils.legalValueLabelKey(pageSource, prop, legalValue);
      String label = legalValueToLabelMap.get(legalValueAsNonNullString(legalValue));
      if (label == null) {
        label = computeDefaultLegalValueLabel(legalValue);
      }
      processLegalValue(key, label);
    }
  }

  private Map<String, String> createLegalValueToLabelMap(WeblogicBeanProperty prop) {
    Map<String, String> map = new HashMap<>();
    for (ConsoleWeblogicBeanLegalValue lv : prop.getLegalValueLabels()) {
      map.put(legalValueAsNonNullString(lv.getValue()), lv.getLabel());
    }
    return map;
  }

  private String legalValueAsNonNullString(Object legalValue) {
    return (legalValue != null) ? legalValue.toString() : "";
  }

  private String getPropertyLabel(WeblogicBeanProperty prop, String pageLevelPropertyLabel) {
    String val = pageLevelPropertyLabel;
    if (StringUtils.isEmpty(val)) {
      val = prop.getLabel();
    }
    return getLabel(val, prop.getName());
  }

  private String replaceSummary(String harvestedHelp, String pdySummary) {
    String harvestedSummary = getSummary(harvestedHelp); // strips off <p> stuff
    pdySummary = getFirstParagraph(pdySummary); // strips off <p> stuff
    int idx = harvestedHelp.indexOf(harvestedSummary);
    String harvestedBeforeSummary = harvestedHelp.substring(0, idx);
    String harvestedAfterSummary = harvestedHelp.substring(idx + harvestedSummary.length());
    return harvestedBeforeSummary + pdySummary + harvestedAfterSummary;
  }

  private String getSummary(String html) {
    if (html == null) {
      return null;
    }
    return getFirstSentenceInParagraph(getFirstParagraph(html.trim()));
  }

  private String getFirstSentenceInParagraph(String paragraph) {
    // Look for first dot followed by whitespace.
    // If not found, return the entire paragraph.
    for (int i = 0; i < paragraph.length();) {
      int idx = paragraph.indexOf('.', i);
      if (idx != -1) {
        // Found the next dot.
        // Bump the cursor past the dot.
        i = idx + 1;
        if (i < paragraph.length()) {
          // There's a character following the dot.
          char next = paragraph.charAt(i);
          if (Character.isWhitespace(next)) {
            // The dot is followed by whitespace.
            // Return the characters up to and including the dot.
            return paragraph.substring(0, i);
          } else {
            // The dot is not followed by whitespace.
            // Keep going so we can look for another dot.
            // We've already bumped the cursor past this dot.
          }
        } else {
          // There isn't a character following the dot.
          // Bump the cursor to the end of the paragraph.
          i = paragraph.length();
        }
      } else {
        // Didn't find another dot.
        // Bump the cursor to the end of the paragraph.
        i = paragraph.length();
      }
    }
    // Didn't find a dot followed by whitespace.
    // Return the entire paragraph;
    return paragraph;
  }

  private String getFirstParagraph(String trimmedHTML) {
    if (trimmedHTML.startsWith(PARA_BEGIN)) {
      int idx = trimmedHTML.indexOf(PARA_END);
      if (idx != -1) {
        // <p>blah</p> - return blah
        return trimmedHTML.substring(PARA_BEGIN.length(), idx);
      } else {
        // <p>blah - return blah
        return trimmedHTML.substring(PARA_BEGIN.length());
      }
    } else {
      int idx = trimmedHTML.indexOf(PARA_BEGIN);
      if (idx != -1) {
        // blah<p> - return blah
        return trimmedHTML.substring(0, idx);
      } else {
        // blah - return blah
        return trimmedHTML;
      }
    }
  }

  private String computeDefaultLegalValueLabel(Object legalValue) {
    String legalValueAsString = (legalValue != null) ? legalValue.toString() : null;
    StringBuilder sb = new StringBuilder();
    boolean first = true;
    for (StringTokenizer st = new StringTokenizer("" + legalValueAsString, "_- "); st.hasMoreTokens();) {
      String word = st.nextToken();
      if (StringUtils.notEmpty(word)) {
        if (!first) {
          sb.append(" ");
        }
        if (word.contains(".")) {
          sb.append(word);
        } else {
          sb.append(StringUtils.camelCaseToUpperCaseWords(word));
        }
        first = false;
      }
    }
    return sb.toString();
  }

  @Override
  protected void processPage(WeblogicPageSource pageSource, Path foldedBeanPath) throws Exception {
    if (pageSource.isSliceForm()) {
      processSliceFormPage(pageSource.asSliceForm());
    } else if (pageSource.isTable()) {
      processTablePage(pageSource.asTable());
    } else if (pageSource.isCreateForm()) {
      processCreateFormPage(pageSource.asCreateForm());
    }
    processHelpPageTitle(pageSource);
    collectHelpTasks(pageSource, pageSource.getHelpTasks());
    collectHelpTopics(pageSource, pageSource.getHelpTopics());
    String introKey = LocalizationUtils.introductionHTMLKey(pageSource);
    String introductionHTML = pageSource.getIntroductionHTML();
    if (StringUtils.isEmpty(introductionHTML)) {
      introductionHTML = pageSource.getType().getDescriptionHTML();
    }
    addResourceDefinition(introKey, introductionHTML);
    customizePage(pageSource);
  }

  private void customizePage(WeblogicPageSource pageSource) throws Exception {
    String methodName = pageSource.getCustomizeEnglishResourceDefinitionsMethod();
    if (methodName == null) {
      return;
    }
    String context = "customizePage";
    Method method = PluginInvocationUtils.getMethod(context, methodName);
    PluginInvocationUtils.checkSignature(context, method, Void.TYPE, Properties.class, WeblogicPageSource.class);
    List<Object> args = new ArrayList<>();
    args.add(getResourceDefinitions());
    args.add(pageSource);
    PluginInvocationUtils.invokeMethod(method, args);
  }

  private void processHelpPageTitle(WeblogicPageSource pageSource) {
    addResourceDefinition(
      LocalizationUtils.helpPageTitleKey(pageSource),
      getHelpPageTitle(pageSource)
    );
  }

  private String getHelpPageTitle(WeblogicPageSource pageSource) {
    StringBuilder sb = new StringBuilder();
    if (pageSource instanceof WeblogicCreateFormPageSource) {
      sb.append("New ");
    }
    sb.append(getBeanType(pageSource));
    if (pageSource instanceof WeblogicSliceFormPageSource) {
      WeblogicSliceFormPageSource slicePageSource = pageSource.asSliceForm();
      SlicePagePath slicePagePath = slicePageSource.getSlicePagePath();
      List<SliceSource> sliceSources = slicePageSource.getSliceSources();
      for (String sliceName : slicePagePath.getSlicePath().getComponents()) {
        SliceSource sliceSource = findSliceSource(sliceName, sliceSources);
        if (sliceSource == null) {
          throw new AssertionError("Can't find slice " + sliceName + " " + pageSource.getPagePath());
        }
        sb.append(": ");
        sb.append(getSliceLabel(sliceSource));
        sliceSources = sliceSource.getSlices();
      }
    }
    return sb.toString();
  }

  private SliceSource findSliceSource(String sliceName, List<SliceSource> sliceSources) {
    for (SliceSource sliceSource : sliceSources) {
      if (sliceName.equals(sliceSource.getName())) {
        return sliceSource;
      }
    }
    return null;
  }

  private String getBeanType(WeblogicPageSource pageSource) {
    String type = pageSource.getType().getDisplayName();
    if (pageSource instanceof WeblogicTablePageSource) {
      type = StringUtils.getPlural(type);
    }
    return type;
  }

  private void processTablePage(WeblogicTablePageSource pageSource) throws Exception {
    LOGGER.finest("processTablePage " + pageSource.getPagePath());
    WeblogicTableSource tableSource = pageSource.getTableSource();
    for (WeblogicColumnSource columnSource : tableSource.getDisplayedColumns()) {
      collectTableColumn(pageSource, columnSource);
    }
    for (WeblogicColumnSource columnSource : tableSource.getHiddenColumns()) {
      collectTableColumn(pageSource, columnSource);
    }
    for (WeblogicActionSource actionSource : tableSource.getActions()) {
      collectTableAction(pageSource, actionSource);
    }
    processLinks(pageSource, pageSource.getCollectionLinks(), true);
  }

  private void collectTableColumn(
    WeblogicTablePageSource pageSource,
    WeblogicColumnSource columnSource
  ) throws Exception {
    WeblogicBeanProperty prop = pageSource.getProperty(columnSource.getName());
    if (prop == null) {
      return;
    }
    processBeanProperty(pageSource, prop, columnSource.getLabel());
  }

  private void collectTableAction(
    WeblogicTablePageSource pageSource,
    WeblogicActionSource actionSource
  ) throws Exception {
    addResourceDefinition(
      LocalizationUtils.actionLabelKey(pageSource, actionSource),
      getLabel(
        actionSource.getLabel(),
        actionSource.getName()
      )
    );
    // Actions are at most two levels deep.
    for (WeblogicActionSource subActionSource : actionSource.getActions()) {
      addResourceDefinition(
        LocalizationUtils.actionLabelKey(pageSource, actionSource, subActionSource),
        getLabel(
          subActionSource.getLabel(),
          subActionSource.getName()
        )
      );
    }
  }

  private void processCreateFormPage(WeblogicCreateFormPageSource pageSource) throws Exception {
    LOGGER.finest("processCreateFormPage " + pageSource.getPagePath());
    WeblogicCreateFormSource createFormSource = pageSource.getCreateFormSource();
    for (WeblogicPropertySource propSource : createFormSource.getProperties()) {
      collectFormProperty(pageSource, propSource);
    }
  }

  private void processSliceFormPage(WeblogicSliceFormPageSource pageSource) throws Exception {
    LOGGER.finest("processSliceFormPage " + pageSource.getPagePath());
    WeblogicSliceFormSource sliceFormSource = pageSource.getSliceFormSource();
    for (WeblogicPropertySource propSource : sliceFormSource.getProperties()) {
      collectFormProperty(pageSource, propSource);
    }
    for (WeblogicPropertySource propSource : sliceFormSource.getAdvancedProperties()) {
      collectFormProperty(pageSource, propSource);
    }
    processSliceSources(new Path(), pageSource.getSliceSources());
    processNavigationContents(pageSource, pageSource.getNavigationContents());
    processLinks(pageSource, pageSource.getInstanceLinks(), false);
  }

  private void processLinks(
      WeblogicPageSource pageSource,
      List<LinkSource> linkCollection,
      boolean isCollection
  ) throws Exception {
    for (LinkSource link : linkCollection) {
      addResourceDefinition(
        LocalizationUtils.linkLabelKey(
          pageSource,
          link.getLabel(),
          isCollection
        ),
        link.getLabel()
      );
      if (!StringUtils.isEmpty(link.getNotFoundMessage())) {
        addResourceDefinition(
          LocalizationUtils.linkNotFoundKey(
            pageSource,
            link.getLabel(),
            isCollection
          ),
          link.getNotFoundMessage()
        );
      }
    }
  }

  private void processNavigationContents(
      WeblogicSliceFormPageSource pageSource, List<NavigationNodeSource> navigationContents)
      throws Exception {
    for (NavigationNodeSource navigationNodeSource : navigationContents) {
      addResourceDefinition(
        LocalizationUtils.navigationNodeDescriptionHTMLKey(
          pageSource.getType(),
          navigationNodeSource
        ),
        getNavigationNodeDescriptionHTML(pageSource, navigationNodeSource));
      if (NavigationNodeSource.Type.group == navigationNodeSource.getType()) {
        addResourceDefinition(
          LocalizationUtils.navigationGroupLabelKey(navigationNodeSource),
          navigationNodeSource.getLabel()
        );
        processNavigationContents(pageSource, navigationNodeSource.getContents());
      }
    }
  }

  // Find the landing page description for a nav tree node.
  //
  // If the node has a description, use it.
  // If not, find the page it links to and use that page's introduction
  private String getNavigationNodeDescriptionHTML(
    WeblogicSliceFormPageSource pageSource,
    NavigationNodeSource navigationNodeSource
  ) throws Exception {
    // If the node has a description, use it.
    String description = navigationNodeSource.getDescriptionHTML();
    if (!StringUtils.isEmpty(description)) {
      return description;
    }

    // Find the page that the node is linked to
    PagePath pagePath = null;

    NavigationNodeSource.Type nodeType = navigationNodeSource.getType();
    if (NavigationNodeSource.Type.beanProperty == nodeType) {
      // The node is a link to a collection or a singleton.
      // Find the collection's table page or the singleton's default slice's page.

      // Find the node's bean property
      WeblogicBeanProperty beanProp =
        pageSource
          .getType()
          .getProperty("getNavigationNodeDescriptionHTML", navigationNodeSource.getProperty());

      if (beanProp == null) {
        // This property is not available in this WLS release.
        return null;
      }

      // Create a pages path for the property's bean type
      PagesPath pagesPath =
        pageSource.getPagePath().getPagesPath().newPagesPath(beanProp.getBeanType());
      if (beanProp.isContainedCollection()) {
        // The property is a collection.  Get the collection's table page.
        pagePath = PagePath.newTablePagePath(pagesPath);
      } else {
        // The property is a singleton. Get the bean's default slice's page.
        pagePath = PagePath.newSlicePagePath(pagesPath, new Path());
      }
    } else if (NavigationNodeSource.Type.root == nodeType) {
      // The node is a link to the root bean for the perspective.
      // Get the root bean's default slice's page.
      pagePath = PagePath.newSlicePagePath(pageSource.getPagePath().getPagesPath(), new Path());
    }
    if (pagePath == null) {
      return null; // no default description for this node
    }
    // Find the page and return its introduction
    return getWeblogicPageSources().getPageSource(pagePath).getIntroductionHTML();
  }

  private void processSliceSources(Path parentSlicePath, List<SliceSource> sliceSources) {
    for (SliceSource sliceSource : sliceSources) {
      Path slicePath = parentSlicePath.childPath(sliceSource.getName());
      addResourceDefinition(
        LocalizationUtils.sliceLabelKey(slicePath),
        getSliceLabel(sliceSource)
      );
      processSliceSources(slicePath, sliceSource.getSlices());
    }
  }

  private String getSliceLabel(SliceSource sliceSource) {
    return getLabel(sliceSource.getLabel(), sliceSource.getName());
  }

  private void collectFormProperty(
    WeblogicPageSource pageSource,
    WeblogicPropertySource propertySource
  ) throws Exception {
    WeblogicBeanProperty prop = pageSource.getProperty(propertySource.getName());
    if (prop == null) {
      return;
    }
    processBeanProperty(pageSource, prop, propertySource.getLabel());
    processPropertyPresentation(pageSource, prop, propertySource);
  }

  private void collectHelpTasks(WeblogicPageSource pageSource, List<String> helpTasks) {
    for (int i = 0; i < helpTasks.size(); i++) {
      String helpTask = helpTasks.get(i);
      String key = LocalizationUtils.helpTaskLabelKey(pageSource, i);
      String value = getHelpTaskLabel(helpTask);
      processHelpTask(key, value);
    }
  }

  // convert
  //   "bridge/bridge_instance/ConfigureGeneralAttributes"
  // to
  //   "Configure General Attributes"
  String getHelpTaskLabel(String helpTask) {
    int idx = helpTask.lastIndexOf("/");
    if (idx > -1) {
      helpTask = helpTask.substring(idx + 1);
    }
    return StringUtils.camelCaseToUpperCaseWords(helpTask);
  }

  private void collectHelpTopics(
      WeblogicPageSource pageSource, List<HelpTopicSource> helpTopicSources) {
    for (int i = 0; i < helpTopicSources.size(); i++) {
      HelpTopicSource helpTopicSource = helpTopicSources.get(i);
      String key = LocalizationUtils.helpTopicLabelKey(pageSource, i);
      processHelpTopic(key, helpTopicSource.getLabel());
    }
  }

  private String getLabel(String label, String name) {
    if (StringUtils.isEmpty(label)) {
      return StringUtils.camelCaseToUpperCaseWords(name);
    } else {
      return label;
    }
  }

  private void addIdentityLabels() throws Exception {
    addIdentityLabels(getTypes().getDomainMBeanType());
    addIdentityLabels(getTypes().getDomainRuntimeMBeanType());
    addIdentityLabels(getTypes().getServerRuntimeMBeanType());
  }

  private void addIdentityLabels(WeblogicBeanType rootType) throws Exception {
    addTypeIdentityLabel(rootType);
    Set<String> visited = new HashSet<>();
    addIdentityLabels(visited, rootType);
  }

  private void addIdentityLabels(Set<String> visited, WeblogicBeanType type) throws Exception {
    if (visited.contains(type.getName())) {
      return;
    }
    visited.add(type.getName());
    for (WeblogicBeanProperty prop : type.getProperties()) {
      if (prop.isPublic() && prop.isContainmentRelationship()) {
        if (!prop.isFoldableContainedSingleton()) {
          addIdentityLabels(prop);
        }
        WeblogicBeanType beanType = prop.getBeanType();
        if (beanType != null) {
          addIdentityLabels(visited, beanType);
          if (!beanType.isHomogeneous()) {
            // Process all the derived types too
            for (SubType subType : beanType.getSubTypes()) {
              WeblogicBeanType st = getTypes().getType(subType.getType());
              if (st != null) {
                addIdentityLabels(visited, st);
              } else {
                // This version of WLS doesn't support this sub type. Skip it.
              }
            }
          }
        } else {
          // i.e. weblogic.management.configuration.CustomResourceMBean CustomResource is a
          // DescriptorBean
          // which we don't have a bean type for
          // System.out.println("DEBUG type=" + prop.getType().getName() + " prop=" +
          // prop.getPropertyKey() + " beanType=" + beanType);
        }
      }
    }
  }

  private void addIdentityLabels(WeblogicBeanProperty prop) throws Exception {
    addTypeIdentityLabel(prop.getBeanType());
    addPropertyIdentityLabel(prop);
  }

  private void addTypeIdentityLabel(WeblogicBeanType type) {
    addResourceDefinition(LocalizationUtils.typeIdentityLabelKey(type), type.getDisplayName());
  }

  private void addPropertyIdentityLabel(WeblogicBeanProperty prop) {
    addResourceDefinition(
        LocalizationUtils.propertyIdentityLabelKey(prop),
        StringUtils.camelCaseToUpperCaseWords(prop.getName()));
  }

  private void addHealthStateLabels() {
    addHealthStateLabel(HealthStateUtils.OK);
    addHealthStateLabel(HealthStateUtils.WARN);
    addHealthStateLabel(HealthStateUtils.CRITICAL);
    addHealthStateLabel(HealthStateUtils.FAILED);
    addHealthStateLabel(HealthStateUtils.OVERLOADED);
    addHealthStateLabel(HealthStateUtils.UNKNOWN);
  }

  private void addHealthStateLabel(String healthState) {
    addResourceDefinition(LocalizationUtils.healthStateLabelKey(healthState), healthState);
  }

  private void addConstants() {
    for (String constant : LocalizedConstants.getAllConstants()) {
      addResourceDefinition(LocalizationUtils.constantLabelKey(constant), constant);
    }
  }
}
