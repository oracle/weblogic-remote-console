// Copyright (c) 2022, Oracle and/or its affiliates.
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
import javax.ws.rs.core.UriBuilder;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.CustomCreateFormDef;
import weblogic.remoteconsole.common.repodef.CustomFormSectionDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyUsedIfDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.CustomSliceTableDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Utility class for managing custom filtering dashboard definitions.
 * 
 * It customizes the dashboard's PDJs (create form, edit slice, view slice).
 * 
 * It also handles the 'path' query parameter that gets added to some of the
 * urls to indicate a dashboard's bean tree path pattern (which defines the
 * list of beans the dashboard could potentially return).
 */
public class CustomFilteringDashboardDefManager {

  private CustomFilteringDashboardDefManager() {
  }

  // Determines whether a bean tree path template supports custom filtering dashboards.
  public static boolean isSupportsCustomFilteringDashboards(InvocationContext ic, BeanTreePath btpTemplate) {
    // Check whether the page repo supports custom filtering dashboards
    if (!ic.getPageRepo().getPageRepoDef().isSupportsCustomFilteringDashboards()) {
      return false;
    }
    btpTemplate = AggregatedRuntimeMBeanNameHandler.INSTANCE.getUnaggregatedBeanTreePath(btpTemplate);
    Set<String> childNames = new HashSet<>();
    boolean hasCollection = false;
    for (BeanTreePathSegment segment : btpTemplate.getSegments()) {
      String childName = segment.getChildDef().getChildName();
      if (childNames.contains(childName)) {
        // Don't support custom filtering dashboards for this child
        // (since we use the children's singular names to name the columns
        // and we don't want two columns with the same name and we don't want
        // to have to invent a name to disambiguate them).
        return false;
      }
      childNames.add(childName);
      // If the segment doesn't support custom filtering dashboards,
      // then no child beans are allowed to support them either.
      if (!segment.getChildDef().getChildTypeDef().isSupportsCustomFilteringDashboards()) {
        return false;
      }
      if (segment.getChildDef().isCollection()) {
        hasCollection = true;
      }
    }
    if (!hasCollection) {
      // There are no collections in the path, so this path is to a singleton or to the root.
      // There's no point in creating a custom filtering dashboard that only finds one bean.
      return false;
    } else {
      return true;
    }
  }

  // Computes the query param to add to a custom filtering dashboard's PDJ or RDJ url
  // to indicate the bean tree path template of the beans it can return.
  public static String computePathQueryParam(BeanTreePath btp) {
    // If this is an aggregated btp,
    //   e.g. DomainRuntime/AggregatedFoo/Bar/Bazz
    // convert it to it's unaggregated btp.
    //   e.g. DomainRuntime/CombinedServerRuntimes/*/ServerRuntime/Foo/Bar/Bazz
    btp = AggregatedRuntimeMBeanNameHandler.INSTANCE.getUnaggregatedBeanTreePath(btp);
    UriBuilder bldr = UriBuilder.fromPath("");
    for (String component : btp.getPath().getComponents()) {
      bldr.queryParam("path", component);
    }
    String uriStr = bldr.build().toString();
    return uriStr.substring(uriStr.indexOf("?") + 1);
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

  // Get the bean tree path / template for a custom filtering dashboard from the query params
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
    Response<CustomFilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
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

  // Customize a custom filtering dashboard's edit slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties for filtering beans by their path and properties.
  public static Response<PageDef> customizeEditSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<CustomFilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
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
          property.getPropertyDef(),
          Value.unsettableValue(property.getValue())
        )
      );
    }
  }

  // Customize a custom filtering dashboard's view slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties returning the matching beans' names and property values.
  public static Response<PageDef> customizeViewSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<CustomFilteringDashboardDef> dashboardDefResponse = getDashboardDef(ic);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    CustomFilteringDashboardDef dashboardDef = dashboardDefResponse.getResults();
    CustomSliceTableDef sliceTableDef =
      new CustomSliceTableDef(uncustomizedPageDef.asSliceTableDef());
    for (CustomFilteringDashboardPathSegmentDef segmentDef : dashboardDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        sliceTableDef.getDisplayedColumnDefs().add(
          new CustomPagePropertyDef(segmentDef.getResultPropertyDef()).writable(false)
        );
      }
    }
    for (CustomFilteringDashboardPropertyDef propertyDef : dashboardDef.getBasicPropertyDefs()) {
      sliceTableDef.getDisplayedColumnDefs().add(propertyDef.getSourcePropertyDef());
    }
    for (CustomFilteringDashboardPropertyDef propertyDef :
           sortPropertyDefs(ic, dashboardDef.getAdvancedPropertyDefs())
    ) {
      sliceTableDef.getHiddenColumnDefs().add(propertyDef.getSourcePropertyDef());
    }
    return response.setSuccess(sliceTableDef);
  }

  private static List<CustomFilteringDashboardPropertyDef> sortPropertyDefs(
    InvocationContext ic,
    List<CustomFilteringDashboardPropertyDef> unsortedPropertyDefs
  ) {
    // Sorts them first by their localized label, then by their form property name
    // (since it's possible to have multiple properties on the page that have
    // the same localized label)
    Map<String,Map<String,CustomFilteringDashboardPropertyDef>> localizedLabelToFormNameToPropertyDef = new TreeMap<>();
    for (CustomFilteringDashboardPropertyDef propertyDef : unsortedPropertyDefs) {
      PagePropertyDef pagePropertyDef = propertyDef.getSourcePropertyDef();
      String localizedLabel = ic.getLocalizer().localizeString(pagePropertyDef.getLabel());
      Map<String,CustomFilteringDashboardPropertyDef> formNameToPropertyDef =
        localizedLabelToFormNameToPropertyDef.get(localizedLabel);
      if (formNameToPropertyDef == null) {
        formNameToPropertyDef = new TreeMap<>();
        localizedLabelToFormNameToPropertyDef.put(localizedLabel, formNameToPropertyDef);
      }
      formNameToPropertyDef.put(pagePropertyDef.getFormPropertyName(), propertyDef);
    }
    List<CustomFilteringDashboardPropertyDef> sortedPropertyDefs = new ArrayList<>();
    for (Map<String,CustomFilteringDashboardPropertyDef> formNameToPropertyDef :
           localizedLabelToFormNameToPropertyDef.values()
    ) {
      for (CustomFilteringDashboardPropertyDef propertyDef : formNameToPropertyDef.values()) {
        sortedPropertyDefs.add(propertyDef);
      }
    }
    return sortedPropertyDefs;
  }

  private static List<FormSectionDef> getCustomizedSectionDefs(
    InvocationContext ic,
    CustomFilteringDashboardDef dashboardDef,
    PageDef uncustomizedPageDef
  ) {
    // Note: this needs to be synchronized with DashboardMBean/create-form.yaml
    // and CustomFilteringDashboardMBean/slices/Edit/form.yaml:
    // the first section has the name, and can be copied over as-is
    // the second section is for the path segment filters and needs to have them added in
    // the third section is for the property filters and needs to have them added in
    List<FormSectionDef> uncustomizedSectionDefs = uncustomizedPageDef.asFormDef().getSectionDefs();
    // Need to force the Name property to be create writable because normally
    // the monitoring tree is read-only, regardless of what type.yaml says:
    CustomFormSectionDef nameSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(0));
    CustomPagePropertyDef namePropertyDef =
      new CustomPagePropertyDef(nameSectionDef.getPropertyDefs().get(0)).createWritable(true);
    nameSectionDef.setPropertyDefs(List.of(namePropertyDef));
    CustomFormSectionDef pathSegmentsSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(1));
    for (CustomFilteringDashboardPathSegmentDef segmentDef : dashboardDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        pathSegmentsSectionDef.getPropertyDefs().add(segmentDef.getCriteriaPropertyDef());
        pathSegmentsSectionDef.getPropertyDefs().add(segmentDef.getValuePropertyDef());
      }
    }
    CustomFormSectionDef propertiesSectionDef = new CustomFormSectionDef(uncustomizedSectionDefs.get(2));
    for (CustomFilteringDashboardPropertyDef propertyDef : sortPropertyDefs(ic, dashboardDef.getAllPropertyDefs())) {
      propertiesSectionDef.getPropertyDefs().add(propertyDef.getCriteriaPropertyDef());
      propertiesSectionDef.getPropertyDefs().add(propertyDef.getValuePropertyDef());
    }
    return List.of(
      nameSectionDef,
      pathSegmentsSectionDef,
      propertiesSectionDef
    );
  }

  // Get the localized custom filtering dashboard definition for the
  // custom filtering dashboard referenced by this request.
  public static Response<CustomFilteringDashboardDef> getDashboardDef(InvocationContext ic) {
    BeanTreePath btpTemplate = getBeanTreePathFromPathQueryParam(ic);
    if (btpTemplate != null) {
      // The request is for a custom filtering dashboard create form RDJ or PDJ for the
      // bean tree path in ic's path query param.
      // Create a localized filtering dashboard def from it.
    } else {
      // A custom filtering dashboard should already exist and ic's btp should point at it.
      // We can't just return it because it could be localized to a different locale.
      // Instead, get it, get it's template btp then create a new one for this locale.
      Response<CustomFilteringDashboardDef> response = new Response<>();
      Response<Dashboard> dashboardResponse =
        ic.getPageRepo().asPageReaderRepo().getDashboardManager().getDashboard(ic);
      if (!dashboardResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(dashboardResponse);
      }
      btpTemplate =
        dashboardResponse
          .getResults().asCustomFilteringDashboard()
          .getConfig()
          .getDashboardDef()
          .getBeanTreePathTemplate();
    }
    return createLocalizedDashboardDef(ic, btpTemplate);
  }

  public static Response<CustomFilteringDashboardDef> createLocalizedDashboardDef(
    InvocationContext ic,
    BeanTreePath btpTemplate
  ) {
    PageDef uncustomizedCreateFormDef = getUncustomizedCreateFormDef(ic, btpTemplate);
    Response<CustomFilteringDashboardDef> response = new Response<>();
    if (!isSupportsCustomFilteringDashboards(ic, btpTemplate)) {
      throw new AssertionError(btpTemplate + " doesn't support custom filtering dashboards.");
    }
    Map<String,PagePropertyDef> templatePagePropertyDefs = new HashMap<>();
    for (PagePropertyDef templatePagePropertyDef : uncustomizedCreateFormDef.getAllPropertyDefs()) {
      templatePagePropertyDefs.put(templatePagePropertyDef.getFormPropertyName(), templatePagePropertyDef);
    }
    List<PagePropertyDef> basicPagePropertyDefs =
      SearchUtils.getBasicPagePropertyDefs(ic.getPageRepo().getPageRepoDef(), btpTemplate.getTypeDef());
    Collection<PagePropertyDef> allPagePropertyDefs =
      SearchUtils.getPagePropertyDefs(ic.getPageRepo().getPageRepoDef(), btpTemplate.getTypeDef()).values();
    return response.setSuccess(
      new CustomFilteringDashboardDef(
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
        )
      )
    );
  }

  private static List<CustomFilteringDashboardPathSegmentDef> createPathDefFromTemplate(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    Map<String,PagePropertyDef> templatePagePropertyDefs
  ) {
    List<CustomFilteringDashboardPathSegmentDef> pathDef = new ArrayList<>();
    for (BeanTreePathSegment segmentTemplate : btpTemplate.getSegments()) {
      CustomFilteringDashboardPathSegmentDef segmentDef = null;
      BeanChildDef childDef = segmentTemplate.getChildDef();
      if (childDef.isCollection()) {
        LocalizableString name = childDef.getSingularLabel();
        String baseFormPropertyName = childDef.getChildName();
        PagePropertyDef criteriaDef =
          customizePropertyDef(
            ic,
            name,
            templatePagePropertyDefs.get("TemplateBeanKeyCriteria"),
            "BeanKeyCriteria_" + baseFormPropertyName
          );
        CustomPagePropertyDef valueDef =
          customizePropertyDef(
            ic,
            LocalizedConstants.UNLABELED_PROPERTY,
            templatePagePropertyDefs.get("TemplateBeanKeyValue"),
            "BeanKeyValue_" + baseFormPropertyName
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
            "BeanKeyResult_" + baseFormPropertyName
          );
        segmentDef = new CustomFilteringDashboardPathSegmentDef(segmentTemplate, criteriaDef, valueDef, resultDef);
      } else {
        segmentDef = new CustomFilteringDashboardPathSegmentDef(segmentTemplate);
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
      basicFormNames.add(pagePropertyDef.getFormPropertyName());
    }
    List<PagePropertyDef> advancedPagePropertyDefs = new ArrayList<>();
    for (PagePropertyDef pagePropertyDef : allPagePropertyDefs) {
      if (!basicFormNames.contains(pagePropertyDef.getFormPropertyName())) {
        advancedPagePropertyDefs.add(pagePropertyDef);
      }
    }
    return advancedPagePropertyDefs;
  }

  private static List<CustomFilteringDashboardPropertyDef> createPropertyDefsFromTemplate(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    Map<String,PagePropertyDef> templatePagePropertyDefs,
    List<PagePropertyDef> pagePropertyDefs
  ) {
    List<CustomFilteringDashboardPropertyDef> propertyDefs = new ArrayList<>();
    for (PagePropertyDef sourcePropertyDef : pagePropertyDefs) {
      if (!sourcePropertyDef.isKey()) {
        String baseTemplatePropertyFormName = getBaseTemplatePagePropertyDefName(sourcePropertyDef);
        String baseFormPropertyName = sourcePropertyDef.getFormPropertyName();
        PagePropertyDef criteriaDef =
          customizePropertyDef(
            ic,
            sourcePropertyDef.getLabel(),
            templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Criteria"),
            "PropertyCriteria_" + baseFormPropertyName
          )
          .helpSummaryHTML(sourcePropertyDef.getHelpSummaryHTML())
          .detailedHelpHTML(sourcePropertyDef.getDetailedHelpHTML())
          .externalHelpDef(sourcePropertyDef.getExternalHelpDef());
        CustomPagePropertyDef valueDef =
          customizePropertyDef(
            ic,
            LocalizedConstants.UNLABELED_PROPERTY,
            templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Value"),
            "PropertyValue_" + baseFormPropertyName
          );
        setValuesPropertyUsedIfDef(criteriaDef, valueDef);
        propertyDefs.add(new CustomFilteringDashboardPropertyDef(sourcePropertyDef, criteriaDef, valueDef));
      } else {
        // The key property is covered by the last path segment.
      }
    }
    return propertyDefs;
  }

  private static String getBaseTemplatePagePropertyDefName(PagePropertyDef pagePropertyDef) {
    if (!pagePropertyDef.isArray()) {
      if (pagePropertyDef.isInt()) {
        return "TemplateIntProperty";
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
      if (pagePropertyDef.isString() || pagePropertyDef.isHealthState()) {
        return "TemplateStringProperty";
      }
    }
    return "TemplateGenericProperty";
  }

  private static CustomPagePropertyDef customizePropertyDef(
    InvocationContext ic,
    LocalizableString label,
    PagePropertyDef uncustomizedPagePropertyDef,
    String formPropertyName
  ) {
    CustomPagePropertyDef rtn =
      new CustomPagePropertyDef(uncustomizedPagePropertyDef)
        .formPropertyName(formPropertyName)
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

  private static PageDef getUncustomizedCreateFormDef(InvocationContext ic, BeanTreePath btpTemplate) {
    String tree = btpTemplate.getSegments().get(0).getChildDef().getChildName();
    Path dashboardsPath = new Path(tree).childPath("Dashboards");
    BeanTreePath dashboardsBtp = BeanTreePath.create(btpTemplate.getBeanRepo(), dashboardsPath);
    PagesPath dashboardsPagesPath = ic.getPageRepo().getPageRepoDef().newPagesPath(dashboardsBtp.getTypeDef());
    PagePath dashboardsCreateFormPagePath = PagePath.newCreateFormPagePath(dashboardsPagesPath);
    InvocationContext dashboardsIc = new InvocationContext(ic); // clone
    dashboardsIc.setIdentity(dashboardsBtp);
    dashboardsIc.setPagePath(dashboardsCreateFormPagePath);
    return dashboardsIc.getPageRepo().getPageRepoDef().getPageDef(dashboardsCreateFormPagePath);
  }
}
