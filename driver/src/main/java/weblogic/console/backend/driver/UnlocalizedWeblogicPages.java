// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.console.backend.pagedesc.HelpTopicSource;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.pagedesc.SliceSource;
import weblogic.console.backend.pagedesc.SlicesSource;
import weblogic.console.backend.pagedesc.WeblogicActionSource;
import weblogic.console.backend.pagedesc.WeblogicColumnSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormPresentationSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormSource;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.pagedesc.WeblogicPageSources;
import weblogic.console.backend.pagedesc.WeblogicPropertyPresentationSource;
import weblogic.console.backend.pagedesc.WeblogicPropertySource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormPresentationSource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormSource;
import weblogic.console.backend.pagedesc.WeblogicTablePageSource;
import weblogic.console.backend.pagedesc.WeblogicTableSource;
import weblogic.console.backend.typedesc.ConsoleWeblogicBeanUsedIf;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicVersion;
import weblogic.console.backend.typedesc.WeblogicVersions;
import weblogic.console.backend.utils.HealthStateUtils;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

/**
 * This class manages the unlocalized page definitions for weblogic pages for a weblogic version.
 * <p>
 * It maps a page path (= containment path to the bean starting at the domain/runtime mbean and a
 * slice path identifying the page for this bean type) to the page definition to return to the UI.
 * <p>
 * The page definition includes everything the UI needs about the page: - the entire slice set
 * for the page - 'How Do I' - form or table contents
 * <p>
 * All of the localizable strings are set to their resource bundle keys instead. (e.g. labels,
 * intro and help text).
 * <p>
 * This class reads in the source yaml files for the pages as they're accessed, and caches the
 * results for quick access.
 */
public class UnlocalizedWeblogicPages {

  // If a slice form or create form has this number of properties or fewer,
  // then force it to be a single column form:
  private static final int MAX_SINGLE_COLUMN_PROPERTY_COUNT = 5;

  private WeblogicPageSources pageSources;

  private WeblogicPageSources getPageSources() {
    return this.pageSources;
  }

  private WeblogicPages pages = new WeblogicPages();

  private WeblogicPages getPages() {
    return this.pages;
  }

  public UnlocalizedWeblogicPages(WeblogicPageSources pageSources) {
    this.pageSources = pageSources;
  }

  public WeblogicPage getPage(PagePath pagePath) throws Exception {
    WeblogicPage page = getPages().getPage(pagePath);
    if (page == null) {
      page = createUnlocalizedPage(pagePath);
      if (page != null) {
        getPages().putPage(pagePath, page);
      }
    }
    return page;
  }

  private WeblogicPage createUnlocalizedPage(PagePath pagePath) throws Exception {
    WeblogicPageSource pageSource = getPageSources().getPageSource(pagePath);
    if (pageSource == null) {
      return null;
    }
    WeblogicPage page = new WeblogicPage();
    setBasePageProperties(page, pageSource);
    createPage(page, pageSource);
    return page;
  }

  private void createPage(WeblogicPage page, WeblogicPageSource pageSource) throws Exception {
    if (pageSource.isSliceForm()) {
      createSliceForm(page, pageSource.asSliceForm());
    } else if (pageSource.isTable()) {
      createTable(page, pageSource.asTable());
    } else if (pageSource.isCreateForm()) {
      createCreateForm(page, pageSource.asCreateForm());
    }
    customizePage(page, pageSource);
  }

  private void customizePage(WeblogicPage page, WeblogicPageSource pageSource) throws Exception {
    String methodName = pageSource.getCustomizePageDefinitionMethod();
    if (methodName == null) {
      return;
    }
    String context = "customizePage";
    Method method = PluginInvocationUtils.getMethod(context, methodName);
    PluginInvocationUtils.checkSignature(context, method, Void.TYPE, WeblogicPage.class, WeblogicPageSource.class);
    List<Object> args = new ArrayList<>();
    args.add(page);
    args.add(pageSource);
    PluginInvocationUtils.invokeMethod(method, args);
  }

  private void createSliceForm(
    WeblogicPage page,
    WeblogicSliceFormPageSource pageSource
  ) throws Exception {
    boolean isCreate = false;
    WeblogicSliceFormSource sliceFormSource = pageSource.getSliceFormSource();
    WeblogicSliceForm sliceForm = new WeblogicSliceForm();
    createSlices(sliceForm, pageSource);
    sliceForm.setProperties(
      createProperties(pageSource, sliceFormSource.getProperties(), isCreate)
    );
    sliceForm.setAdvancedProperties(
      createProperties(pageSource, sliceFormSource.getAdvancedProperties(), isCreate)
    );
    sliceForm.setPresentation(
      createSliceFormPresentation(pageSource, sliceFormSource.getPresentation())
    );
    page.setSliceForm(sliceForm);
  }

  private void createCreateForm(
    WeblogicPage page,
    WeblogicCreateFormPageSource pageSource
  ) throws Exception {
    boolean isCreate = true;
    WeblogicCreateFormSource createFormSource = pageSource.getCreateFormSource();
    WeblogicCreateForm createForm = new WeblogicCreateForm();
    createForm.setProperties(
      createProperties(pageSource, createFormSource.getProperties(), isCreate));
    createForm.setPresentation(
      createCreateFormPresentation(pageSource, createFormSource.getPresentation())
    );
    page.setCreateForm(createForm);
  }

  private void createSlices(
    WeblogicSliceForm sliceForm,
    WeblogicSliceFormPageSource pageSource
  ) throws Exception {
    PagesPath pagesPath = pageSource.getPagePath().getPagesPath();
    SlicesSource slicesSource = getPageSources().getSlicesSource(pagesPath);
    List<Slice> slices = createChildSlices(new Path(), slicesSource.getSlices());
    sliceForm.setSlices(slices);
  }

  private List<Slice> createChildSlices(Path parentSlicePath, List<SliceSource> sliceSources) throws Exception {
    List<Slice> slices = new ArrayList<>();
    for (SliceSource childSliceSource : sliceSources) {
      slices.add(createSlice(parentSlicePath, childSliceSource));
    }
    return slices;
  }

  private Slice createSlice(Path parentSlicePath, SliceSource sliceSource) throws Exception {
    Slice slice = new Slice();
    String name = sliceSource.getName();
    slice.setName(sliceSource.getName());
    Path slicePath = parentSlicePath.childPath(name);
    slice.setLabel(LocalizationUtils.sliceLabelKey(slicePath));
    slice.setSlices(createChildSlices(slicePath, sliceSource.getSlices()));
    return slice;
  }

  private WeblogicSliceFormPresentation createSliceFormPresentation(
    WeblogicSliceFormPageSource pageSource,
    WeblogicSliceFormPresentationSource presentationSource
  ) {
    boolean singleColumn = false;
    boolean useCheckBoxesForBooleans = false;
    if (presentationSource != null) {
      singleColumn = presentationSource.isSingleColumn();
      useCheckBoxesForBooleans = presentationSource.isUseCheckBoxesForBooleans();
    }
    // Force the form to be single column if it doesn't have many properties:
    if (!singleColumn) {
      WeblogicSliceFormSource sliceFormSource = pageSource.getSliceFormSource();
      int propCount = sliceFormSource.getProperties().size() + sliceFormSource.getAdvancedProperties().size();
      if (propCount <= MAX_SINGLE_COLUMN_PROPERTY_COUNT) {
        singleColumn = true;
      }
    }
    if (singleColumn || useCheckBoxesForBooleans) {
      WeblogicSliceFormPresentation presentation = new WeblogicSliceFormPresentation();
      presentation.setSingleColumn(singleColumn);
      presentation.setUseCheckBoxesForBooleans(useCheckBoxesForBooleans);
      return presentation;
    }
    return null;
  }

  private WeblogicCreateFormPresentation createCreateFormPresentation(
    WeblogicCreateFormPageSource pageSource,
    WeblogicCreateFormPresentationSource presentationSource
  ) {
    boolean singleColumn = false;
    if (presentationSource != null) {
      singleColumn = presentationSource.isSingleColumn();
    }
    // Force the form to be single column if it doesn't have many properties:
    if (!singleColumn) {
      WeblogicCreateFormSource createFormSource = pageSource.getCreateFormSource();
      int propCount = createFormSource.getProperties().size();
      if (propCount <= MAX_SINGLE_COLUMN_PROPERTY_COUNT) {
        singleColumn = true;
      }
    }
    if (singleColumn) {
      WeblogicCreateFormPresentation presentation = new WeblogicCreateFormPresentation();
      presentation.setSingleColumn(singleColumn);
      return presentation;
    }
    return null;
  }

  private List<WeblogicProperty> createProperties(
    WeblogicPageSource pageSource,
    List<WeblogicPropertySource> propertySources,
    boolean isCreate
  ) throws Exception {
    List<WeblogicProperty> properties = new ArrayList<>();
    for (WeblogicPropertySource propertySource : propertySources) {
      WeblogicProperty property = createProperty(pageSource, propertySource, isCreate);
      if (property != null) {
        properties.add(property);
      }
    }
    return properties;
  }

  private WeblogicProperty createProperty(
    WeblogicPageSource pageSource,
    WeblogicPropertySource propertySource,
    boolean isCreate
  ) throws Exception {
    String property = propertySource.getName();
    WeblogicBeanProperty beanProp = pageSource.getProperty(property);
    if (beanProp == null) {
      return null;
    }
    WeblogicProperty prop = new WeblogicProperty();
    prop.setName(property);
    prop.setLabel(
      LocalizationUtils.propertyLabelKey(pageSource, beanProp, propertySource.getLabel())
    );
    // don't need beanProp.isKey, nullable, encrypted, transient, isArray, creators yet
    prop.setArray(isArray(beanProp));
    prop.setType(getPropertyType(pageSource, beanProp));
    boolean writable = (isCreate) ? beanProp.isCreateWritable() : beanProp.isUpdateWritable();
    if (!writable) {
      prop.setReadOnly(true);
    }
    prop.setRestartNeeded(beanProp.isRestartNeeded());
    prop.setRedeployNeeded(beanProp.isRedeployNeeded()); // TBD - does this ever make sense for config mbeans?
    prop.setHelpSummaryHTML(LocalizationUtils.helpSummaryHTMLKey(pageSource, beanProp));
    prop.setDetailedHelpHTML(LocalizationUtils.detailedHelpHTMLKey(pageSource, beanProp));
    prop.setLegalValues(getLegalValues(pageSource, beanProp));
    prop.setUsedIf(copyUsedIf(beanProp.getUsedIf()));
    prop.setMBeanInfo(getMBeanInfo(beanProp));
    prop.setPresentation(createPropertyPresentation(pageSource, beanProp, propertySource.getPresentation()));
    return prop;
  }

  WeblogicPropertyPresentation createPropertyPresentation(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty beanProp,
    WeblogicPropertyPresentationSource presentationSource
  ) {
    if (presentationSource == null) {
      return null;
    }
    WeblogicPropertyPresentation presentation = new WeblogicPropertyPresentation();
    presentation.setInlineFieldHelp(LocalizationUtils.inlineFieldHelpKey(pageSource, beanProp));
    presentation.setDisplayAsHex(presentationSource.isDisplayAsHex());
    return presentation;
  }

  // returns whether the property is represented as an array in the PDJ/RDJ
  private boolean isArray(WeblogicBeanProperty beanProp) {
    if (beanProp.isReferenceAsReferences()) {
      // it's represented as an array of references in WLS but
      // as a single reference in the PDJ/RDJ
      return false;
    }
    return beanProp.isArray();
  }

  private void createTable(WeblogicPage page, WeblogicTablePageSource pageSource) throws Exception {
    WeblogicTableSource tableSource = pageSource.getTableSource();
    WeblogicTable table = new WeblogicTable();
    table.setDisplayedColumns(createColumns(pageSource, tableSource.getDisplayedColumns()));
    table.setHiddenColumns(createColumns(pageSource, tableSource.getHiddenColumns()));
    table.setActions(createActions(pageSource, tableSource.getActions()));
    page.setTable(table);
  }

  private List<WeblogicColumn> createColumns(
    WeblogicTablePageSource pageSource,
    List<WeblogicColumnSource> columnSources
  ) throws Exception {
    List<WeblogicColumn> columns = new ArrayList<>();
    for (WeblogicColumnSource columnSource : columnSources) {
      WeblogicColumn column = createColumn(pageSource, columnSource);
      if (column != null) {
        columns.add(column);
      }
    }
    return columns;
  }

  private WeblogicColumn createColumn(
    WeblogicTablePageSource pageSource,
    WeblogicColumnSource columnSource
  ) throws Exception {
    String property = columnSource.getName();
    WeblogicBeanProperty beanProp = pageSource.getProperty(property);
    if (beanProp == null) {
      return null;
    }
    WeblogicColumn column = new WeblogicColumn();
    column.setName(property);
    column.setLabel(
      LocalizationUtils.propertyLabelKey(pageSource, beanProp, columnSource.getLabel())
    );
    column.setLegalValues(getLegalValues(pageSource, beanProp));
    column.setKey(beanProp.isKey());
    column.setHelpSummaryHTML(LocalizationUtils.helpSummaryHTMLKey(pageSource, beanProp));
    column.setDetailedHelpHTML(LocalizationUtils.detailedHelpHTMLKey(pageSource, beanProp));
    column.setArray(isArray(beanProp));
    column.setType(getPropertyType(pageSource, beanProp));
    column.setUsedIf(copyUsedIf(beanProp.getUsedIf()));
    column.setMBeanInfo(getMBeanInfo(beanProp));
    return column;
  }

  private List<WeblogicAction> createActions(
    WeblogicTablePageSource pageSource,
    List<WeblogicActionSource> actionSources
  ) throws Exception {
    List<WeblogicAction> actions = new ArrayList<>();
    Set<String> actionNames = new HashSet<>();
    for (WeblogicActionSource actionSource : actionSources) {
      actions.add(createAction(actionNames, pageSource, actionSource));
    }
    return actions;
  }

  private WeblogicAction createAction(
    Set<String> actionNames,
    WeblogicTablePageSource pageSource,
    WeblogicActionSource actionSource
  ) throws Exception {
    if (actionSource.getActions().isEmpty()) {
      return createStandAloneAction(actionNames, pageSource, actionSource);
    } else {
      return createActionGroup(actionNames, pageSource, actionSource);
    }
  }

  private WeblogicAction createStandAloneAction(
    Set<String> actionNames,
    WeblogicTablePageSource pageSource,
    WeblogicActionSource actionSource
  ) throws Exception {
    String name = actionSource.getName();
    if (!actionNames.add(name)) {
      throw new AssertionError(
        "Duplicate action name :"
        + " " + pageSource
        + " " + name
      );
    }
    WeblogicAction action = new WeblogicAction();
    action.setName(actionSource.getName());
    action.setLabel(
      LocalizationUtils.actionLabelKey(pageSource, actionSource)
    );
    action.setAsynchronous(actionSource.isAsynchronous());
    return action;
  }

  private WeblogicAction createActionGroup(
    Set<String> actionNames,
    WeblogicTablePageSource pageSource,
    WeblogicActionSource actionGroupSource
  ) throws Exception {
    String name = actionGroupSource.getName();
    if (!StringUtils.isEmpty(actionGroupSource.getActionMethod())) {
      throw new AssertionError(
        "Actions with nested actions do not support 'actionMethod' :"
        + " " + pageSource
        + " " + name
      );
    }
    if (actionGroupSource.getUsedIf() != null) {
      throw new AssertionError(
        "Actions with nested actions do not support 'usedIf' :"
        + " " + pageSource
        + " " + name
      );
    }

    WeblogicAction actionGroup = new WeblogicAction();
    actionGroup.setName(name);
    actionGroup.setLabel(
      LocalizationUtils.actionLabelKey(pageSource, actionGroupSource)
    );
    actionGroup.setAsynchronous(actionGroupSource.isAsynchronous());
    List<WeblogicAction> actions = new ArrayList<>();
    actionGroup.setActions(actions);
    for (WeblogicActionSource actionSource : actionGroupSource.getActions()) {
      actions.add(createSubAction(actionNames, pageSource, actionGroupSource, actionSource));
    }
    return actionGroup;
  }

  private WeblogicAction createSubAction(
    Set<String> actionNames,
    WeblogicTablePageSource pageSource,
    WeblogicActionSource actionGroupSource,
    WeblogicActionSource actionSource
  ) throws Exception {
    String groupName = actionGroupSource.getName();
    String name = actionSource.getName();
    if (actionSource.isAsynchronous()) {
      throw new AssertionError(
        "Nested actions do not support 'asynchronous' :"
        + " " + pageSource
        + " " + groupName
        + " " + name
      );
    }
    if (!actionSource.getActions().isEmpty()) {
      throw new AssertionError(
        "Nested actions do not support 'actions' :"
        + " " + pageSource
        + " " + groupName
        + " " + name
      );
    }
    if (!actionNames.add(name)) {
      throw new AssertionError(
        "Duplicate action name :"
        + " " + pageSource
        + " " + groupName
        + " " + name
      );
    }
    WeblogicAction action = new WeblogicAction();
    action.setName(name);
    action.setLabel(
      LocalizationUtils.actionLabelKey(pageSource, actionGroupSource, actionSource)
    );
    return action;
  }

  private List<LegalValue> getLegalValues(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty prop
  ) throws Exception {
    List<LegalValue> legalValues = new ArrayList<>();
    if (WeblogicBeanProperty.PROPERTY_TYPE_HEALTH_STATE.equals(prop.getPropertyType())) {
      // TBD HealthState - temporarily represent as a localized enum
      addHealthStateLegalValue(legalValues, HealthStateUtils.OK);
      addHealthStateLegalValue(legalValues, HealthStateUtils.WARN);
      addHealthStateLegalValue(legalValues, HealthStateUtils.CRITICAL);
      addHealthStateLegalValue(legalValues, HealthStateUtils.FAILED);
      addHealthStateLegalValue(legalValues, HealthStateUtils.OVERLOADED);
      addHealthStateLegalValue(legalValues, HealthStateUtils.UNKNOWN);
    } else {
      for (Object value : prop.getLegalValues()) {
        addLegalValue(legalValues, value, LocalizationUtils.legalValueLabelKey(pageSource, prop, value));
      }
    }
    return legalValues;
  }

  private void addHealthStateLegalValue(List<LegalValue> legalValues, String healthState) {
    addLegalValue(legalValues, healthState, LocalizationUtils.healthStateLabelKey(healthState));
  }

  private void addLegalValue(List<LegalValue> legalValues, Object value, String label) {
    LegalValue legalValue = new LegalValue();
    legalValue.setValue(value);
    legalValue.setLabel(label);
    legalValues.add(legalValue);
  }

  private void setBasePageProperties(WeblogicPage page, WeblogicPageSource pageSource) {
    // TBD - shouldn't this be weblogic version + console backend version?
    page.setWeblogicVersion(getPageSources().getWeblogicVersion());
    page.setHelpPageTitle(LocalizationUtils.helpPageTitleKey(pageSource));
    page.setIntroductionHTML(LocalizationUtils.introductionHTMLKey(pageSource));
    createHelpTasks(page, pageSource);
    createHelpTopics(page, pageSource);
  }

  private void createHelpTasks(WeblogicPage page, WeblogicPageSource pageSource) {
    List<String> helpTasks = pageSource.getHelpTasks();
    List<String> helpTaskLabels = new ArrayList<>();
    for (int i = 0; i < helpTasks.size(); i++) {
      helpTaskLabels.add(LocalizationUtils.helpTaskLabelKey(pageSource, i));
    }
    page.setHelpTaskLabels(helpTaskLabels);
  }

  private void createHelpTopics(WeblogicPage page, WeblogicPageSource pageSource) {
    List<HelpTopicSource> helpTopicSources = pageSource.getHelpTopics();
    List<HelpTopic> helpTopics = new ArrayList<>();
    for (int i = 0; i < helpTopicSources.size(); i++) {
      HelpTopicSource helpTopicSource = helpTopicSources.get(i);
      HelpTopic helpTopic = new HelpTopic();
      helpTopic.setLabel(LocalizationUtils.helpTopicLabelKey(pageSource, i));
      helpTopic.setHref(calculateHelpTopicHref(helpTopicSource));
      helpTopics.add(helpTopic);
    }
    page.setHelpTopics(helpTopics);
  }

  // Compute the absolute url of the public oracle documentation for a help topic.
  // Use WebLogicVersion to do it since the urls depend on the weblogic version.
  private String calculateHelpTopicHref(HelpTopicSource helpTopicSource) {
    HelpTopicSource.Type type = helpTopicSource.getType();
    String href = helpTopicSource.getHref();
    WeblogicVersion weblogicVersion = getWeblogicVersion();
    if (HelpTopicSource.Type.edocs.equals(type)) {
      return weblogicVersion.getEdocsHelpTopicUrl(href);
    }
    if (HelpTopicSource.Type.generic.equals(type)) {
      return weblogicVersion.getGenericHelpTopicUrl(href);
    }
    throw new AssertionError("Unsupported help topic: type=" + type + " href=" + href);
  }

  private UsedIf copyUsedIf(ConsoleWeblogicBeanUsedIf conUsedIf) {
    if (conUsedIf == null) {
      return null;
    }
    UsedIf usedIf = new UsedIf();
    usedIf.setProperty(conUsedIf.getProperty());
    usedIf.setValues(conUsedIf.getValues());
    usedIf.setHide(conUsedIf.isHide());
    return usedIf;
  }

  private String getPropertyType(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty beanProp
  ) throws Exception {
    String propertyType = beanProp.getPropertyType();
    // TBD HealthState - temporarily represent as a localized enum
    if (WeblogicBeanProperty.PROPERTY_TYPE_HEALTH_STATE.equals(propertyType)) {
      propertyType = WeblogicBeanProperty.PROPERTY_TYPE_STRING;
    }
    if (supportsOptions(pageSource, beanProp)) {
      propertyType = propertyType + "-dynamic-enum";
    }
    return propertyType;
  }

  private boolean supportsOptions(
    WeblogicPageSource pageSource,
    WeblogicBeanProperty beanProp
  ) throws Exception {
    if (beanProp.isSupportsOptions()) {
      if (pageSource.isSliceForm() && beanProp.isUpdateWritable()) {
        return true;
      }
      if (pageSource.isCreateForm() && beanProp.isCreateWritable()) {
        return true;
      }
    }
    return false;
  }

  private MBeanInfo getMBeanInfo(WeblogicBeanProperty beanProp) throws Exception {
    if (beanProp.isExtension()) {
      // this property didn't come from a weblogic mbean,
      // therefore there is no javadoc for it
      return null;
    }
    WeblogicBeanType actualType = beanProp.getUnfoldedType().getActualWeblogicBeanType();
    String type = StringUtils.getLeafClassName(actualType.getName());
    String attribute = beanProp.getBeanName();
    String path = beanProp.getUnfoldedBeanPath().getDotSeparatedPath();
    MBeanInfo mbeanInfo = new MBeanInfo();
    mbeanInfo.setType(type);
    mbeanInfo.setAttribute(attribute);
    mbeanInfo.setPath(path);
    if (!actualType.isDisableMBeanJavadoc()) {
      mbeanInfo.setJavadocHref(getWeblogicVersion().getMBeanAttributeJavadocUrl(type, attribute));
    } else {
      // There is no javadoc for this type so skip the link.
      // Still return the type & property so that the
      // front end can at least show the user which underlying
      // mbean property the page is managing.
    }
    return mbeanInfo;
  }

  private WeblogicVersion getWeblogicVersion() {
    return WeblogicVersions.getWeblogicVersion(getPageSources().getWeblogicVersion());
  }
}
