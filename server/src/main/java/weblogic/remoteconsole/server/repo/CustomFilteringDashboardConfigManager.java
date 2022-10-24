// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utility code for creating and updating a custom filtering dashboard's configuration
 * given the marshalled request body that the user sent in to
 * specify the desired config.
 */
public class CustomFilteringDashboardConfigManager {

  // Create a new config from its bean tree path pattern
  // plus the filtering rules specified by the user.
  public static Response<CustomFilteringDashboardConfig> createConfig(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<CustomFilteringDashboardConfig> response = new Response<>();
    // Compute the default (i.e. unfiltered) config for the bean tree path pattern
    // that ic represents (i.e. its 'path' config param).
    Response<CustomFilteringDashboardConfig> configResponse =
      createDefaultConfig(
        ic,
        CustomFilteringDashboardDefManager.getBeanTreePathFromPathQueryParam(ic),
        getStringPropertyValue("Name", formProperties, null)
      );
    if (!configResponse.isSuccess()) {
      return configResponse;
    }
    CustomFilteringDashboardConfig previousConfig = configResponse.getResults();
    // Overlay the filtering rules from the user.
    CustomFilteringDashboardConfig updatedConfig = updateConfig(previousConfig, formProperties);
    Response<Void> validateResponse = validateConfig(ic, updatedConfig);
    if (!validateResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(validateResponse);
    }
    return response.setSuccess(updatedConfig);
  }

  // Update a config for an existing config to include the
  // new filtering rules specified by the user.
  public static Response<CustomFilteringDashboardConfig> updateConfig(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<CustomFilteringDashboardConfig> response = new Response<>();
    // Get the current config for the cdashboardthat ic references.
    Response<Dashboard> dashboardResponse =
      ic.getPageRepo().asPageReaderRepo().getDashboardManager().getDashboard(ic);
    if (!dashboardResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardResponse);
    }
    CustomFilteringDashboardConfig previousConfig =
      dashboardResponse.getResults().asCustomFilteringDashboard().getConfig();
    // Overlay the filtering rules from the user.
    CustomFilteringDashboardConfig updatedConfig = updateConfig(previousConfig, formProperties);
    Response<Void> validateResponse = validateConfig(ic, updatedConfig);
    if (!validateResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(validateResponse);
    }
    return response.setSuccess(updatedConfig);
  }

  private static CustomFilteringDashboardConfig updateConfig(
    CustomFilteringDashboardConfig previousConfig,
    List<FormProperty> formProperties
  ) {
    List<CustomFilteringDashboardPathSegment> updatedPath = new ArrayList<>();
    for (CustomFilteringDashboardPathSegment previousSegment : previousConfig.getPath()) {
      CustomFilteringDashboardPathSegment updatedSegment = previousSegment;
      CustomFilteringDashboardPathSegmentDef segmentDef = previousSegment.getSegmentDef();
      if (segmentDef.isFilterable()) {
        updatedSegment =
          new CustomFilteringDashboardPathSegment(
            segmentDef,
            getStringPropertyValue(
              segmentDef.getCriteriaPropertyDef().getFormPropertyName(),
              formProperties,
              previousSegment.getCriteria()
            ),
            getStringPropertyValue(
              segmentDef.getValuePropertyDef().getFormPropertyName(),
              formProperties,
              previousSegment.getValue()
            )
          );
      }
      updatedPath.add(updatedSegment);
    }
    List<CustomFilteringDashboardProperty> updatedProperties = new ArrayList<>();
    for (CustomFilteringDashboardProperty previousProperty : previousConfig.getProperties()) {
      CustomFilteringDashboardPropertyDef propertyDef = previousProperty.getPropertyDef();
      updatedProperties.add(
        new CustomFilteringDashboardProperty(
          propertyDef,
          getStringPropertyValue(
            propertyDef.getCriteriaPropertyDef().getFormPropertyName(),
            formProperties,
            previousProperty.getCriteria()
          ),
          getPropertyValue(
            propertyDef.getValuePropertyDef().getFormPropertyName(),
            formProperties,
            previousProperty.getValue()
          )
        )
      );
    }
    return
      new CustomFilteringDashboardConfig(
        previousConfig.getDashboardDef(), 
        previousConfig.getName(),
        updatedPath,
        updatedProperties,
        previousConfig.getUnsupportedPropertyFilters()
      );
  }

  private static Response<Void> validateConfig(InvocationContext ic, CustomFilteringDashboardConfig config) {
    Response<Void> response = new Response<>();
    for (CustomFilteringDashboardPathSegment segment : config.getPath()) {
      CustomFilteringDashboardPathSegmentDef segmentDef = segment.getSegmentDef();
      if (segmentDef.isFilterable() && isFiltered(segment.getCriteria()) && StringUtils.isEmpty(segment.getValue())) {
        reportUnspecifiedFilteredValue(ic, response, segmentDef.getResultPropertyDef());
      }
    }
    for (CustomFilteringDashboardProperty property : config.getProperties()) {
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
    return !CustomFilteringDashboardPropertyDef.CRITERIA_UNFILTERED.equals(criteria);
  }

  private static boolean haveValue(CustomFilteringDashboardProperty property) {
    Value value = property.getValue();
    if (value == null) {
      return false;
    }
    if (value.isString() && StringUtils.isEmpty(value.asString().getValue())) {
      return false;
    }
    return true;
  }

  public static Response<CustomFilteringDashboardConfig> createDefaultConfig(
    InvocationContext ic,
    BeanTreePath btpTemplate,
    String name
  ) {
    Response<CustomFilteringDashboardConfig> response = new Response<>();
    Response<CustomFilteringDashboardDef> dashboardDefResponse =
      CustomFilteringDashboardDefManager.createLocalizedDashboardDef(ic, btpTemplate);
    if (!dashboardDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardDefResponse);
    }
    CustomFilteringDashboardDef dashboardDef = dashboardDefResponse.getResults();
    ArrayList<CustomFilteringDashboardPathSegment> defaultPath = new ArrayList<>();
    List<CustomFilteringDashboardPathSegmentDef> segmentDefs = dashboardDef.getPathDef();
    List<BeanTreePathSegment> btpSegments = btpTemplate.getSegments();
    for (int i = 0; i < segmentDefs.size(); i++) {
      CustomFilteringDashboardPathSegmentDef segmentDef = segmentDefs.get(i);
      CustomFilteringDashboardPathSegment segment = null;
      if (segmentDef.isFilterable()) {
        BeanTreePathSegment btpSegment = btpSegments.get(i);
        String beanKey = btpSegment.isKeySet() ? btpSegment.getKey() : null;
        segment = 
          new CustomFilteringDashboardPathSegment(
            segmentDef,
            CustomFilteringDashboardPathSegmentDef.CRITERIA_UNFILTERED,
            beanKey
          );
      } else {
        segment = new CustomFilteringDashboardPathSegment(segmentDef);
      }
      defaultPath.add(segment);
    }
    ArrayList<CustomFilteringDashboardProperty> defaultProperties = new ArrayList<>();
    for (CustomFilteringDashboardPropertyDef propertyDef : dashboardDef.getAllPropertyDefs()) {
      defaultProperties.add(
        new CustomFilteringDashboardProperty(
          propertyDef,
          CustomFilteringDashboardPropertyDef.CRITERIA_UNFILTERED,
          getDefaultPropertyValue(propertyDef)
        )
      );
    }
    return
      response.setSuccess(
        new CustomFilteringDashboardConfig(dashboardDef, name, defaultPath, defaultProperties)
      );
  }

  private static Value getDefaultPropertyValue(CustomFilteringDashboardPropertyDef propertyDef) {
    PagePropertyDef pagePropertyDef = propertyDef.getSourcePropertyDef();
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

  private static String getStringPropertyValue(
    String formPropertyName,
    List<FormProperty> properties,
    String defaultValue
  ) {
    return
      getPropertyValue(
        formPropertyName,
        properties,
        new StringValue(defaultValue)
      ).asString().getValue();
  }

  private static Value getPropertyValue(
    String formPropertyName,
    List<FormProperty> properties,
    Value defaultValue
  ) {
    Value value = findPropertyValue(formPropertyName, properties);
    return (value != null) ? value : defaultValue;
  }

  private static Value findPropertyValue(
    String formPropertyName,
    List<FormProperty> properties
  ) {
    FormProperty property = findProperty(formPropertyName, properties);
    return (property != null) ? property.getValue().asSettable().getValue() : null;
  }

  private static FormProperty findProperty(
    String formPropertyName,
    List<FormProperty> properties
  ) {
    for (FormProperty property : properties) {
      if (formPropertyName.equals(property.getName())) {
        return property;
      }
    }
    return null;
  }
}
