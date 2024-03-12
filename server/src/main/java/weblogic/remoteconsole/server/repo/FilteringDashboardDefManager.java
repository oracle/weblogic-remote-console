// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.CustomCreateFormDef;
import weblogic.remoteconsole.common.repodef.CustomFormSectionDef;
import weblogic.remoteconsole.common.repodef.CustomPageActionDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyUsedIfDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.CustomSliceTableDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utility class for managing filtering dashboard definitions.
 * 
 * It customizes the dashboard's PDJs (create form, edit slice, view slice).
 * 
 * It also handles the 'path' query parameter that gets added to some of the
 * urls to indicate a dashboard's bean tree path pattern (which defines the
 * list of beans the dashboard could potentially return).
 */
public class FilteringDashboardDefManager {

  private FilteringDashboardDefManager() {
  }

  // Determines whether a bean tree path template supports filtering dashboards.
  public static boolean isSupportsFilteringDashboards(InvocationContext ic, BeanTreePath btpTemplate) {
    // Check whether the page repo supports filtering dashboards
    if (!getPageRepoDef(ic).isSupportsFilteringDashboards()) {
      return false;
    }
    btpTemplate = AggregatedRuntimeMBeanNameHandler.INSTANCE.getUnaggregatedBeanTreePath(btpTemplate);
    Set<String> childNames = new HashSet<>();
    boolean hasCollection = false;
    for (BeanTreePathSegment segment : btpTemplate.getSegments()) {
      String childName = segment.getChildDef().getChildName();
      if (childNames.contains(childName)) {
        // Don't support filtering dashboards for this child
        // (since we use the children's singular names to name the columns
        // and we don't want two columns with the same name and we don't want
        // to have to invent a name to disambiguate them).
        return false;
      }
      childNames.add(childName);
      // If the segment doesn't support filtering dashboards,
      // then no child beans are allowed to support them either.
      if (!segment.getChildDef().getChildTypeDef().isSupportsFilteringDashboards()) {
        return false;
      }
      if (segment.getChildDef().isCollection()) {
        hasCollection = true;
      }
    }
    if (!hasCollection) {
      // There are no collections in the path, so this path is to a singleton or to the root.
      // There's no point in creating a filtering dashboard that only finds one bean.
      return false;
    } else {
      return true;
    }
  }

  // Computes the query param to add to a filtering dashboard's PDJ or RDJ url
  // to indicate the bean tree path template of the beans it can return.
  public static String computePathQueryParam(BeanTreePath btp) {
    // If this is an aggregated btp,
    //   e.g. DomainRuntime/AggregatedFoo/Bar/Bazz
    // convert it to it's unaggregated btp.
    //   e.g. DomainRuntime/CombinedServerRuntimes/*/ServerRuntime/Foo/Bar/Bazz
    btp = AggregatedRuntimeMBeanNameHandler.INSTANCE.getUnaggregatedBeanTreePath(btp);
    return  StringUtils.computeQueryParam("path", btp.getPath().getComponents());
  }

  public static BeanTreePath getBeanTreePathTemplateFromPathQueryParam(InvocationContext ic) {
    BeanTreePath btp = getBeanTreePathFromPathQueryParam(ic);
    if (btp == null) {
      return null;
    }
    // Converts a bean tree path to a template by stripping out its identities
    BeanTreePath btpTemplate = BeanTreePath.create(btp.getBeanRepo(), new Path());
    for (BeanTreePathSegment segment : btp.getSegments()) {
      btpTemplate = btpTemplate.childPath(segment.getChildDef().getChildPath());
    }
    return btpTemplate;
  }

  // Get the bean tree path / template for a filtering dashboard from the query params
  // in its PDJ or RDJ url.
  public static BeanTreePath getBeanTreePathFromPathQueryParam(InvocationContext ic) {
    // The bean tree path was passed in via the 'path' JAXRS query parameter
    List<String> pathComponents = ic.getUriInfo().getQueryParameters().get("path");
    if (pathComponents == null) {
      return null;
    }
    Path path = new Path();
    for (String pathComponent : pathComponents) {
      path.addComponent(pathComponent);
    }
    return BeanTreePath.create(ic.getPageRepo().getBeanRepo(), path);
  }

  // Customize a custom filtering dashboard's create form PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties for filtering beans by their path and properties.
  public static Response<PageDef> customizeCreateFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<FilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    return
      response.setSuccess(
        new CustomCreateFormDef(uncustomizedPageDef.asCreateFormDef())
          .sectionDefs(getCustomizedSectionDefs(ic, dashboardDefResponse.getResults(), uncustomizedPageDef))
          .propertyDefs(List.of())
      );
  }

  // Customize a filtering dashboard's filters slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties for filtering beans by their path and properties.
  public static Response<PageDef> customizeFiltersSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<FilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    return
      response.setSuccess(
        new CustomSliceFormDef(uncustomizedPageDef.asSliceFormDef())
          .sectionDefs(getCustomizedSectionDefs(ic, dashboardDefResponse.getResults(), uncustomizedPageDef))
          .propertyDefs(List.of())
      );
  }

  // Customize a custom filtering dashboard's create form RDJ.
  public static void customizeCreateForm(InvocationContext ic, Page page) {
    // The default create form code makes all the property values SettableValues.
    // Since a custom filtering dashboard's definition isn't config mbean-based,
    // they don't support SettableValues.
    // Switch them to their underlying values.
    // Long term, it would be better to include something in the PDJ to indicate
    // whether the form supports SettableValues.
    List<FormProperty> properties = page.asForm().getProperties();
    for (int i = 0; i < properties.size(); i++) {
      FormProperty property = properties.get(i);
      properties.set(
        i,
        new FormProperty(
          property.getFieldDef(),
          Value.unsettableValue(property.getValue())
        )
      );
    }
  }

  // Customize a filtering dashboard's view slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties returning the matching beans' names and property values.
  public static Response<PageDef> customizeViewSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<FilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    FilteringDashboardDef dashboardDef = dashboardDefResponse.getResults();
    Response<List<String>> columnsResponse = getDefaultColumns(ic);
    if (!columnsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(columnsResponse);
    }
    List<String> defaultColumns = columnsResponse.getResults();
    CustomSliceTableDef sliceTableDef =
      new CustomSliceTableDef(uncustomizedPageDef.asSliceTableDef());
    List<PagePropertyDef> defaultDisplayedColumnDefs = new ArrayList<>();
    for (FilteringDashboardPathSegmentDef segmentDef : dashboardDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        defaultDisplayedColumnDefs.add(
          clonePropertyDef(segmentDef.getResultPropertyDef(), sliceTableDef).writable(false)
        );
      }
    }
    List<PagePropertyDef> defaultHiddenColumnDefs = new ArrayList<>();
    for (FilteringDashboardPropertyDef propertyDef : dashboardDef.getBasicPropertyDefs()) {
      defaultDisplayedColumnDefs.add(
        clonePropertyDef(propertyDef.getSourcePropertyDef(), sliceTableDef)
      );
    }
    for (FilteringDashboardPropertyDef propertyDef : sortPropertyDefs(ic, dashboardDef.getAdvancedPropertyDefs())) {
      defaultHiddenColumnDefs.add(
        clonePropertyDef(propertyDef.getSourcePropertyDef(), sliceTableDef)
      );
    }
    setColumnDefs(
      ic,
      sliceTableDef,
      defaultColumns,
      defaultDisplayedColumnDefs,
      defaultHiddenColumnDefs
    );
    List<PageActionDef> actionDefs = new ArrayList<>();
    for (PageActionDef actionDef : dashboardDef.getActionDefs()) {
      actionDefs.add(cloneActionDef(actionDef, sliceTableDef));
    }
    sliceTableDef.setActionDefs(actionDefs);
    sliceTableDef.setUseRowIdentities(true);
    sliceTableDef.setSupportsNavigation(true);
    return response.setSuccess(sliceTableDef);
  }

  private static CustomPagePropertyDef clonePropertyDef(PagePropertyDef pagePropertyDef,PageDef pageDef) {
    return new CustomPagePropertyDef(pagePropertyDef).pageDef(pageDef);
  }

  private static CustomPageActionDef cloneActionDef(PageActionDef actionDef,PageDef pageDef) {
    CustomPageActionDef clone = new CustomPageActionDef(actionDef).pageDef(pageDef);
    List<PageActionDef> childActionDefs = new ArrayList<>();
    for (PageActionDef childActionDef : actionDef.getActionDefs()) {
      childActionDefs.add(cloneActionDef(childActionDef, pageDef));
    }
    return clone.actionDefs(childActionDefs);
  }

  private static void setColumnDefs(
    InvocationContext ic,
    CustomSliceTableDef sliceTableDef,
    List<String> defaultColumns,
    List<PagePropertyDef> defaultDisplayedColumnDefs,
    List<PagePropertyDef> defaultHiddenColumnDefs
  ) {
    if (defaultColumns.isEmpty()) {
      // The default displayed columns haven't been specified.
      // Base them on the order of properties on the table and slice pages
      sliceTableDef.setDisplayedColumnDefs(defaultDisplayedColumnDefs);
      sliceTableDef.setHiddenColumnDefs(defaultHiddenColumnDefs);
    } else {
      // The default displayed columns have been specified.
      // Set the displayed columns to match.
      // Then hide all the others, retaining their original order
      List<PagePropertyDef> allColumnDefs = new ArrayList<>(defaultDisplayedColumnDefs);
      allColumnDefs.addAll(defaultHiddenColumnDefs);
      for (String column : defaultColumns) {
        PagePropertyDef propertyDef = findPropertyDef(column, allColumnDefs);
        if (propertyDef != null) {
          sliceTableDef.getDisplayedColumnDefs().add(propertyDef);
        }
      }
      for (PagePropertyDef propertyDef : allColumnDefs) {
        if (!defaultColumns.contains(propertyDef.getFormFieldName())) {
          sliceTableDef.getHiddenColumnDefs().add(propertyDef);
        }
      }
    }
  }

  private static PagePropertyDef findPropertyDef(String column, List<PagePropertyDef> propertyDefs) {
    for (PagePropertyDef propertyDef : propertyDefs) {
      if (column.equals(propertyDef.getFormFieldName())) {
        // Return the first match (generally this would be from the table)
        return propertyDef;
      }
    }
    return null;
  }

  private static Response<List<String>> getDefaultColumns(InvocationContext ic) {
    Response<List<String>> response = new Response<>();
    Response<FilteringDashboardConfig> dashboardConfigResponse = getDashboardConfig(ic);
    if (!dashboardConfigResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardConfigResponse);
    }
    FilteringDashboardConfig dashboardConfig = dashboardConfigResponse.getResults();
    List<String> defaultColumns = null;
    if (dashboardConfig != null) {
      defaultColumns = dashboardConfig.getDefaultColumns();
    }
    if (defaultColumns == null) {
      defaultColumns = List.of();
    }
    return response.setSuccess(defaultColumns);
  }

  private static List<FilteringDashboardPropertyDef> sortPropertyDefs(
    InvocationContext ic,
    List<FilteringDashboardPropertyDef> unsortedPropertyDefs
  ) {
    // Sorts them first by their localized label, then by their form property name
    // (since it's possible to have multiple properties on the page that have
    // the same localized label)
    Map<String,Map<String,FilteringDashboardPropertyDef>> localizedLabelToFormNameToPropertyDef = new TreeMap<>();
    for (FilteringDashboardPropertyDef propertyDef : unsortedPropertyDefs) {
      PagePropertyDef pagePropertyDef = propertyDef.getSourcePropertyDef();
      String localizedLabel = ic.getLocalizer().localizeString(pagePropertyDef.getLabel());
      Map<String,FilteringDashboardPropertyDef> formNameToPropertyDef =
        localizedLabelToFormNameToPropertyDef.get(localizedLabel);
      if (formNameToPropertyDef == null) {
        formNameToPropertyDef = new TreeMap<>();
        localizedLabelToFormNameToPropertyDef.put(localizedLabel, formNameToPropertyDef);
      }
      formNameToPropertyDef.put(pagePropertyDef.getFormFieldName(), propertyDef);
    }
    List<FilteringDashboardPropertyDef> sortedPropertyDefs = new ArrayList<>();
    for (Map<String,FilteringDashboardPropertyDef> formNameToPropertyDef :
           localizedLabelToFormNameToPropertyDef.values()
    ) {
      for (FilteringDashboardPropertyDef propertyDef : formNameToPropertyDef.values()) {
        sortedPropertyDefs.add(propertyDef);
      }
    }
    return sortedPropertyDefs;
  }

  private static List<FormSectionDef> getCustomizedSectionDefs(
    InvocationContext ic,
    FilteringDashboardDef dashboardDef,
    PageDef uncustomizedPageDef
  ) {
    // Note: this needs to be synchronized with DashboardMBean/create-form.yaml
    // and CustomFilteringDashboardMBean/slices/Filters/form.yaml:
    // the first and second sections have the name and description, and can be copied over as-is
    // the third section is for the path segment filters and needs to have them added in
    // the fourth section is for the property filters and needs to have them added in
    List<FormSectionDef> uncustomizedSectionDefs = uncustomizedPageDef.asFormDef().getSectionDefs();
    // Need to force the Name and Description properties to be create writable because normally
    // the monitoring tree is read-only, regardless of what type.yaml says:
    CustomFormSectionDef nameSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(0));
    CustomPagePropertyDef namePropertyDef =
      new CustomPagePropertyDef(nameSectionDef.getPropertyDefs().get(0)).createWritable(true);
    nameSectionDef.setPropertyDefs(List.of(namePropertyDef));
    CustomFormSectionDef descriptionSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(1));
    CustomPagePropertyDef descriptionPropertyDef =
      new CustomPagePropertyDef(descriptionSectionDef.getPropertyDefs().get(0))
        .createWritable(true)
        .updateWritable(true);
    descriptionSectionDef.setPropertyDefs(List.of(descriptionPropertyDef));
    CustomFormSectionDef pathSegmentsSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(2));
    for (FilteringDashboardPathSegmentDef segmentDef : dashboardDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        pathSegmentsSectionDef.getPropertyDefs().add(segmentDef.getCriteriaPropertyDef());
        pathSegmentsSectionDef.getPropertyDefs().add(segmentDef.getValuePropertyDef());
      }
    }
    CustomFormSectionDef propertiesSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(3));
    for (FilteringDashboardPropertyDef propertyDef : sortPropertyDefs(ic, dashboardDef.getAllPropertyDefs())) {
      propertiesSectionDef.getPropertyDefs().add(propertyDef.getCriteriaPropertyDef());
      propertiesSectionDef.getPropertyDefs().add(propertyDef.getValuePropertyDef());
    }
    return List.of(
      nameSectionDef,
      descriptionSectionDef,
      pathSegmentsSectionDef,
      propertiesSectionDef
    );
  }

  // Get the dashboard config for the filtering dashboard referenced by this request.
  public static Response<FilteringDashboardConfig> getDashboardConfig(InvocationContext ic) {
    Response<FilteringDashboardConfig> response = new Response<>();
    BeanTreePath btpTemplate = getBeanTreePathFromPathQueryParam(ic);
    if (btpTemplate != null) {
      // The request is for a custom filtering dashboard create form RDJ or PDJ for the
      // bean tree path in ic's path query param.
      // There isn't a config yet.
      return response.setSuccess(null);
    } else {
      // A filtering dashboard should already exist and ic should point at it.
      Response<Dashboard> dashboardResponse = getDashboard(ic);
      if (!dashboardResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(dashboardResponse);
      }
      return response.setSuccess(dashboardResponse.getResults().asFilteringDashboard().getConfig());
    }
  }

  // Get the localized filtering dashboard definition for the
  // filtering dashboard referenced by this request.
  public static Response<FilteringDashboardDef> getDashboardDef(InvocationContext ic) {
    BeanTreePath btpTemplate = getBeanTreePathFromPathQueryParam(ic);
    if (btpTemplate != null) {
      // The request is for a custom filtering dashboard create form RDJ or PDJ for the
      // bean tree path in ic's path query param.
      // Create a localized filtering dashboard def from it.
    } else {
      // A filtering dashboard should already exist and ic should point at it.
      // We can't just return it because it could be localized to a different locale.
      // Instead, get it, get its template btp then create a new one for this locale.
      Response<FilteringDashboardDef> response = new Response<>();
      Response<Dashboard> dashboardResponse = getDashboard(ic);
      if (!dashboardResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(dashboardResponse);
      }
      btpTemplate =
        dashboardResponse
          .getResults().asFilteringDashboard()
          .getConfig()
          .getDashboardDef()
          .getBeanTreePathTemplate();
    }
    return createLocalizedDashboardDef(ic, btpTemplate);
  }

  private static Response<Dashboard> getDashboard(InvocationContext ic) {
    String dashboardName = ic.getUriInfo().getQueryParameters().getFirst("dashboard");
    if (dashboardName == null) {
      return ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic).getDashboard(ic);
    } else {
      return ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic).getDashboard(ic, dashboardName);
    }
  }

  public static Response<FilteringDashboardDef> createLocalizedDashboardDef(
    InvocationContext ic,
    BeanTreePath btpTemplate
  ) {
    PageDef uncustomizedCreateFormDef = getUncustomizedCreateFormDef(ic, btpTemplate);
    Response<FilteringDashboardDef> response = new Response<>();
    if (!isSupportsFilteringDashboards(ic, btpTemplate)) {
      throw new AssertionError(btpTemplate + " doesn't support filtering dashboards.");
    }
    Map<String,PagePropertyDef> templatePagePropertyDefs = new HashMap<>();
    for (PagePropertyDef templatePagePropertyDef : uncustomizedCreateFormDef.getAllPropertyDefs()) {
      templatePagePropertyDefs.put(templatePagePropertyDef.getFormFieldName(), templatePagePropertyDef);
    }
    List<PagePropertyDef> basicPagePropertyDefs =
      SearchUtils.getBasicPagePropertyDefs(getPageRepoDef(ic), btpTemplate.getTypeDef());
    Collection<PagePropertyDef> allPagePropertyDefs =
      SearchUtils.getPagePropertyDefs(getPageRepoDef(ic), btpTemplate.getTypeDef()).values();
    return response.setSuccess(
      new FilteringDashboardDef(
        btpTemplate,
        createPathDefFromTemplate(ic, btpTemplate, templatePagePropertyDefs),
        createPropertyDefsFromTemplate(
          ic,
          btpTemplate,
          templatePagePropertyDefs,
          basicPagePropertyDefs
        ),
        createPropertyDefsFromTemplate(
          ic,
          btpTemplate,
          templatePagePropertyDefs,
          getAdvancedPagePropertyDefs(ic, basicPagePropertyDefs, allPagePropertyDefs)
        ),
        createActionDefsFromTemplate(ic, btpTemplate)
      )
    );
  }

  private static List<FilteringDashboardPathSegmentDef> createPathDefFromTemplate(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    Map<String,PagePropertyDef> templatePagePropertyDefs
  ) {
    List<FilteringDashboardPathSegmentDef> pathDef = new ArrayList<>();
    for (BeanTreePathSegment segmentTemplate : btpTemplate.getSegments()) {
      FilteringDashboardPathSegmentDef segmentDef = null;
      BeanChildDef childDef = segmentTemplate.getChildDef();
      if (childDef.isCollection()) {
        LocalizableString name = childDef.getSingularLabel();
        String baseFormFieldName = childDef.getChildName();
        PagePropertyDef criteriaDef =
          customizePropertyDef(
            ic,
            name,
            templatePagePropertyDefs.get("TemplateBeanKeyCriteria"),
            "BeanKeyCriteria_" + baseFormFieldName
          );
        CustomPagePropertyDef valueDef =
          customizePropertyDef(
            ic,
            LocalizedConstants.UNLABELED_PROPERTY,
            templatePagePropertyDefs.get("TemplateBeanKeyValue"),
            "BeanKeyValue_" + baseFormFieldName
          );
        setValuesPropertyUsedIfDef(criteriaDef, valueDef);
        if (segmentTemplate.isKeySet()) {
          valueDef.setStandardDefaultValue(new StringValue(segmentTemplate.getKey()));
        }
        PagePropertyDef resultDef =
          customizePropertyDef(
            ic,
            name,
            templatePagePropertyDefs.get("TemplateBeanKeyResult"),
            "BeanKeyResult_" + baseFormFieldName
          );
        segmentDef = new FilteringDashboardPathSegmentDef(segmentTemplate, criteriaDef, valueDef, resultDef);
      } else {
        segmentDef = new FilteringDashboardPathSegmentDef(segmentTemplate);
      }
      pathDef.add(segmentDef);
    }
    return pathDef;
  }

  private static List<PagePropertyDef> getAdvancedPagePropertyDefs(
    InvocationContext ic,
    List<PagePropertyDef> basicPagePropertyDefs,
    Collection<PagePropertyDef> allPagePropertyDefs
  ) {
    // Get the form names of all of the basic properties
    Set<String> basicFormNames = new HashSet<>();
    for (PagePropertyDef pagePropertyDef : basicPagePropertyDefs) {
      basicFormNames.add(pagePropertyDef.getFormFieldName());
    }
    List<PagePropertyDef> advancedPagePropertyDefs = new ArrayList<>();
    for (PagePropertyDef pagePropertyDef : allPagePropertyDefs) {
      if (!basicFormNames.contains(pagePropertyDef.getFormFieldName())) {
        advancedPagePropertyDefs.add(pagePropertyDef);
      }
    }
    return advancedPagePropertyDefs;
  }

  private static List<FilteringDashboardPropertyDef> createPropertyDefsFromTemplate(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    Map<String,PagePropertyDef> templatePagePropertyDefs,
    List<PagePropertyDef> pagePropertyDefs
  ) {
    List<FilteringDashboardPropertyDef> propertyDefs = new ArrayList<>();
    for (PagePropertyDef sourcePropertyDef : pagePropertyDefs) {
      if (!sourcePropertyDef.isKey()) {
        String baseTemplatePropertyFormName = getBaseTemplatePagePropertyDefName(sourcePropertyDef);
        String baseFormFieldName = sourcePropertyDef.getFormFieldName();
        PagePropertyDef criteriaDef =
          customizePropertyDef(
            ic,
            sourcePropertyDef.getLabel(),
            templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Criteria"),
            "PropertyCriteria_" + baseFormFieldName
          )
          .helpSummaryHTML(sourcePropertyDef.getHelpSummaryHTML())
          .detailedHelpHTML(sourcePropertyDef.getDetailedHelpHTML())
          .externalHelpDef(sourcePropertyDef.getExternalHelpDef());
        CustomPagePropertyDef valueDef =
          customizePropertyDef(
            ic,
            LocalizedConstants.UNLABELED_PROPERTY,
            templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Value"),
            "PropertyValue_" + baseFormFieldName
          );
        setValuesPropertyUsedIfDef(criteriaDef, valueDef);
        valueDef.setLegalValueDefs(getValuesPropertyLegalValueDefs(sourcePropertyDef));
        propertyDefs.add(new FilteringDashboardPropertyDef(sourcePropertyDef, criteriaDef, valueDef));
      } else {
        // The key property is covered by the last path segment.
      }
    }
    return propertyDefs;
  }

  private static String getBaseTemplatePagePropertyDefName(PagePropertyDef pagePropertyDef) {
    boolean isEnum = !pagePropertyDef.getLegalValueDefs().isEmpty();
    if (!pagePropertyDef.isArray()) {
      if (pagePropertyDef.isInt()) {
        return (isEnum) ? "TemplateIntEnumProperty" : "TemplateIntProperty";
      }
      if (pagePropertyDef.isLong()) {
        return "TemplateLongProperty";
      }
      if (pagePropertyDef.isDouble()) {
        return "TemplateDoubleProperty";
      }
      if (pagePropertyDef.isBoolean()) {
        return "TemplateBooleanProperty";
      }
      if (pagePropertyDef.isDate()) {
        return "TemplateDateProperty";
      }
      if (pagePropertyDef.isDate()) {
        return "TemplateDateAsLongProperty";
      }
      if (pagePropertyDef.isString() || pagePropertyDef.isHealthState()) {
        return (isEnum) ? "TemplateStringEnumProperty" : "TemplateStringProperty";
      }
    }
    return "TemplateGenericProperty";
  }

  private static CustomPagePropertyDef customizePropertyDef(
    InvocationContext ic,
    LocalizableString label,
    PagePropertyDef uncustomizedPagePropertyDef,
    String formFieldName
  ) {
    CustomPagePropertyDef rtn =
      new CustomPagePropertyDef(uncustomizedPagePropertyDef)
        .formFieldName(formFieldName)
        .writable(true);
    if (label != null) {
      rtn.setLabel(label);
    }
    return rtn;
  }

  private static void setValuesPropertyUsedIfDef(PagePropertyDef criteriaDef, CustomPagePropertyDef valueDef) {
    CustomPagePropertyUsedIfDef usedIfDef = new CustomPagePropertyUsedIfDef();
    usedIfDef.setPropertyDef(criteriaDef);
    usedIfDef.setParentPropertyDef(valueDef);
    for (LegalValueDef legalValueDef : criteriaDef.getLegalValueDefs()) {
      StringValue value = legalValueDef.getValue().asString();
      if (!"unfiltered".equals(value.getValue())) {
        usedIfDef.getValues().add(value);
      }
    }
    valueDef.setUsedIfDef(usedIfDef);
  }

  private static List<LegalValueDef> getValuesPropertyLegalValueDefs(PagePropertyDef sourcePropertyDef) {
    if (!sourcePropertyDef.isArray()) {
      if (sourcePropertyDef.isInt() || sourcePropertyDef.isString() || sourcePropertyDef.isHealthState()) {
        return sourcePropertyDef.getLegalValueDefs();
      }
    }
    return List.of();
  }

  private static List<PageActionDef> createActionDefsFromTemplate(
    InvocationContext ic,
    BeanTreePath btpTemplate
  ) {
    List<PageActionDef> rtn = new ArrayList<>();
    // For now, just return copies of the type's table's actions that support multiple rows.
    // We might want to consider actions on slices later.
    PageDef pageDef =
      getPageRepoDef(ic).getPageDef(getPageRepoDef(ic).newTablePagePath(btpTemplate.getTypeDef()));
    if (pageDef != null) {
      for (PageActionDef actionDef : pageDef.getActionDefs()) {
        if ("multiple".equals(actionDef.getRows())) {
          // TBD - should weed out actions that need input forms?
          rtn.add(actionDef);
        }
      }
    }
    return rtn;
  }

  private static PageDef getUncustomizedCreateFormDef(InvocationContext ic, BeanTreePath btpTemplate) {
    String tree = btpTemplate.getSegments().get(0).getChildDef().getChildName();
    Path dashboardsPath = new Path(tree).childPath("Dashboards");
    BeanTreePath dashboardsBtp = BeanTreePath.create(btpTemplate.getBeanRepo(), dashboardsPath);
    PagesPath dashboardsPagesPath = getPageRepoDef(ic).newPagesPath(dashboardsBtp.getTypeDef());
    PagePath dashboardsCreateFormPagePath = PagePath.newCreateFormPagePath(dashboardsPagesPath);
    InvocationContext dashboardsIc = new InvocationContext(ic); // clone
    dashboardsIc.setIdentity(dashboardsBtp);
    dashboardsIc.setPagePath(dashboardsCreateFormPagePath);
    return getPageRepoDef(dashboardsIc).getPageDef(dashboardsCreateFormPagePath);
  }

  private static PageRepoDef getPageRepoDef(InvocationContext ic) {
    return ic.getPageRepo().getPageRepoDef();
  }
}
