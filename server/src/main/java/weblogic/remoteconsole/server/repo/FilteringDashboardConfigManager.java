// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utility code for creating and updating a filtering dashboard's configuration
 * given the marshalled request body that the user sent in to
 * specify the desired config.
 */
public class FilteringDashboardConfigManager {

  // Create a new config from its bean tree path pattern
  // plus the filtering rules specified by the user.
  public static Response<FilteringDashboardConfig> createConfig(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<FilteringDashboardConfig> response = new Response<>();
    // Compute the default (i.e. unfiltered) config for the bean tree path pattern
    // that ic represents (i.e. its 'path' config param).
    Response<FilteringDashboardConfig> configResponse =
      createDefaultConfig(
        ic,
        FilteringDashboardDefManager.getBeanTreePathFromPathQueryParam(ic),
        FormProperty.getStringPropertyValue("Name", formProperties, null),
        FormProperty.getStringPropertyValue("Description", formProperties, null),
        // TBD add support custom dashboard default columns:
        // FormProperty.getStringPropertyValue("DefaultColumns", formProperties, null)
        List.of()
      );
    if (!configResponse.isSuccess()) {
      return configResponse;
    }
    FilteringDashboardConfig previousConfig = configResponse.getResults();
    // Overlay the filtering rules from the user.
    FilteringDashboardConfig updatedConfig = updateConfig(previousConfig, formProperties);
    Response<Void> validateResponse = validateConfig(ic, updatedConfig);
    if (!validateResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(validateResponse);
    }
    return response.setSuccess(updatedConfig);
  }

  // Update a config for an existing config to include the
  // new filtering rules specified by the user.
  public static Response<FilteringDashboardConfig> updateConfig(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<FilteringDashboardConfig> response = new Response<>();
    // Get the current config for the dashboardt hat ic references.
    Response<Dashboard> dashboardResponse =
      ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic).getDashboard(ic);
    if (!dashboardResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardResponse);
    }
    FilteringDashboardConfig previousConfig =
      dashboardResponse.getResults().asFilteringDashboard().getConfig();
    // Overlay the filtering rules from the user.
    FilteringDashboardConfig updatedConfig = updateConfig(previousConfig, formProperties);
    Response<Void> validateResponse = validateConfig(ic, updatedConfig);
    if (!validateResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(validateResponse);
    }
    return response.setSuccess(updatedConfig);
  }

  private static FilteringDashboardConfig updateConfig(
    FilteringDashboardConfig previousConfig,
    List<FormProperty> formProperties
  ) {
    List<FilteringDashboardPathSegment> updatedPath = new ArrayList<>();
    for (FilteringDashboardPathSegment previousSegment : previousConfig.getPath()) {
      FilteringDashboardPathSegment updatedSegment = previousSegment;
      FilteringDashboardPathSegmentDef segmentDef = previousSegment.getSegmentDef();
      if (segmentDef.isFilterable()) {
        updatedSegment =
          new FilteringDashboardPathSegment(
            segmentDef,
            FormProperty.getStringPropertyValue(
              segmentDef.getCriteriaPropertyDef().getFormFieldName(),
              formProperties,
              previousSegment.getCriteria()
            ),
            FormProperty.getStringPropertyValue(
              segmentDef.getValuePropertyDef().getFormFieldName(),
              formProperties,
              previousSegment.getValue()
            )
          );
      }
      updatedPath.add(updatedSegment);
    }
    List<FilteringDashboardProperty> updatedProperties = new ArrayList<>();
    for (FilteringDashboardProperty previousProperty : previousConfig.getProperties()) {
      FilteringDashboardPropertyDef propertyDef = previousProperty.getPropertyDef();
      updatedProperties.add(
        new FilteringDashboardProperty(
          propertyDef,
          FormProperty.getStringPropertyValue(
            propertyDef.getCriteriaPropertyDef().getFormFieldName(),
            formProperties,
            previousProperty.getCriteria()
          ),
          FormProperty.getPropertyValue(
            propertyDef.getValuePropertyDef().getFormFieldName(),
            formProperties,
            previousProperty.getValue()
          )
        )
      );
    }
    return
      new FilteringDashboardConfig(
        previousConfig.getDashboardDef(), 
        previousConfig.getName(),
        FormProperty.getStringPropertyValue(
          "Description",
          formProperties,
          previousConfig.getDescription()
        ),
        previousConfig.getDefaultColumns(),
        updatedPath,
        updatedProperties,
        previousConfig.getUnsupportedPropertyFilters()
      );
  }

  private static Response<Void> validateConfig(InvocationContext ic, FilteringDashboardConfig config) {
    Response<Void> response = new Response<>();
    for (FilteringDashboardPathSegment segment : config.getPath()) {
      FilteringDashboardPathSegmentDef segmentDef = segment.getSegmentDef();
      if (segmentDef.isFilterable() && isFiltered(segment.getCriteria()) && StringUtils.isEmpty(segment.getValue())) {
        reportUnspecifiedFilteredValue(ic, response, segmentDef.getResultPropertyDef());
      }
    }
    for (FilteringDashboardProperty property : config.getProperties()) {
      if (isFiltered(property.getCriteria()) && !haveValue(property)) {
        reportUnspecifiedFilteredValue(ic, response, property.getPropertyDef().getSourcePropertyDef());
      }
    }
    return response;
  }

  private static void reportUnspecifiedFilteredValue(
    InvocationContext ic,
    Response<Void> response,
    PagePropertyDef pagePropertyDef
  ) {
    response.setUserBadRequest();
    response.addFailureMessage(
      ic.getLocalizer().localizeString(
        LocalizedConstants.UNSPECIFIED_CUSTOM_FILTERING_DASHBOARD_FILTERED_VALUE,
        ic.getLocalizer().localizeString(
          pagePropertyDef.getLabel()
        )
      )
    );
  }

  private static boolean isFiltered(String criteria) {
    return !FilteringDashboardPropertyDef.CRITERIA_UNFILTERED.equals(criteria);
  }

  private static boolean haveValue(FilteringDashboardProperty property) {
    Value value = property.getValue();
    if (value == null) {
      return false;
    }
    if (value.isString() && StringUtils.isEmpty(value.asString().getValue())) {
      return false;
    }
    return true;
  }

  public static Response<FilteringDashboardConfig> createDefaultConfig(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    String name,
    String description,
    List<String> defaultColumns
  ) {
    Response<FilteringDashboardConfig> response = new Response<>();
    Response<FilteringDashboardDef> dashboardDefResponse =
      FilteringDashboardDefManager.createLocalizedDashboardDef(ic, btpTemplate);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    FilteringDashboardDef dashboardDef = dashboardDefResponse.getResults();
    ArrayList<FilteringDashboardPathSegment> defaultPath = new ArrayList<>();
    List<FilteringDashboardPathSegmentDef> segmentDefs = dashboardDef.getPathDef();
    List<BeanTreePathSegment> btpSegments = btpTemplate.getSegments();
    for (int i = 0; i < segmentDefs.size(); i++) {
      FilteringDashboardPathSegmentDef segmentDef = segmentDefs.get(i);
      FilteringDashboardPathSegment segment = null;
      if (segmentDef.isFilterable()) {
        BeanTreePathSegment btpSegment = btpSegments.get(i);
        String beanKey = btpSegment.isKeySet() ? btpSegment.getKey() : null;
        segment = 
          new FilteringDashboardPathSegment(
            segmentDef,
            FilteringDashboardPathSegmentDef.CRITERIA_UNFILTERED,
            beanKey
          );
      } else {
        segment = new FilteringDashboardPathSegment(segmentDef);
      }
      defaultPath.add(segment);
    }
    ArrayList<FilteringDashboardProperty> defaultProperties = new ArrayList<>();
    for (FilteringDashboardPropertyDef propertyDef : dashboardDef.getAllPropertyDefs()) {
      defaultProperties.add(
        new FilteringDashboardProperty(
          propertyDef,
          FilteringDashboardPropertyDef.CRITERIA_UNFILTERED,
          getDefaultPropertyValue(propertyDef)
        )
      );
    }
    // TBD make sure defaultColumns only references existing properties
    return
      response.setSuccess(
        new FilteringDashboardConfig(
          dashboardDef,
          name,
          description,
          defaultColumns,
          defaultPath,
          defaultProperties
        )
      );
  }

  private static Value getDefaultPropertyValue(FilteringDashboardPropertyDef propertyDef) {
    PagePropertyDef pagePropertyDef = propertyDef.getSourcePropertyDef();
    if (!pagePropertyDef.getLegalValueDefs().isEmpty()) {
      if (pagePropertyDef.isInt() || pagePropertyDef.isString() || pagePropertyDef.isHealthState()) {
        // Return the 1st legal value
        return pagePropertyDef.getLegalValueDefs().get(0).getValue();
      }
    }
    if (pagePropertyDef.isInt()) {
      return new IntValue(0);
    }
    if (pagePropertyDef.isLong()) {
      return new LongValue(0);
    }
    if (pagePropertyDef.isDouble()) {
      return new DoubleValue(0);
    }
    if (pagePropertyDef.isBoolean()) {
      return new BooleanValue(false);
    }
    return null;
  }
}
