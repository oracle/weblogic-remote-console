// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility code for creating and updating a custom view's query
 * given the marshalled request body that the user sent in to
 * specify the desired query.
 */
public class CustomViewQueryManager {

  // Create a new query from its bean tree path pattern
  // plus the filtering rules specified by the user.
  public static Response<CustomViewQuery> createQuery(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<CustomViewQuery> response = new Response<>();
    // Compute the default (i.e. unfiltered) query for the bean tree path pattern
    // that ic represents (i.e. its 'path' query param).
    Response<CustomViewQuery> queryResponse =
      createDefaultQuery(ic, getStringPropertyValue("Name", formProperties, null));
    if (!queryResponse.isSuccess()) {
      return queryResponse;
    }
    CustomViewQuery previousQuery = queryResponse.getResults();
    // Overlay the filtering rules from the user.
    CustomViewQuery updatedQuery = updateQuery(previousQuery, formProperties);
    return response.setSuccess(updatedQuery);
  }

  // Update a query for an existing query to include the
  // new filtering rules specified by the user.
  public static Response<CustomViewQuery> updateQuery(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<CustomViewQuery> response = new Response<>();
    // Get the current query for the custom view that ic references.
    Response<CustomView> viewResponse =
      ic.getPageRepo().asPageReaderRepo().getCustomViewManager().getCustomView(ic);
    if (!viewResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(viewResponse);
    }
    CustomViewQuery previousQuery = viewResponse.getResults().getQuery();
    // Overlay the filtering rules from the user.
    CustomViewQuery updatedQuery = updateQuery(previousQuery, formProperties);
    return response.setSuccess(updatedQuery);
  }

  private static CustomViewQuery updateQuery(
    CustomViewQuery previousQuery,
    List<FormProperty> formProperties
  ) {
    List<CustomViewPathSegment> updatedPath = new ArrayList<>();
    for (CustomViewPathSegment previousSegment : previousQuery.getPath()) {
      CustomViewPathSegment updatedSegment = previousSegment;
      CustomViewPathSegmentDef segmentDef = previousSegment.getSegmentDef();
      if (segmentDef.isFilterable()) {
        updatedSegment =
          new CustomViewPathSegment(
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
    List<CustomViewProperty> updatedProperties = new ArrayList<>();
    for (CustomViewProperty previousProperty : previousQuery.getProperties()) {
      CustomViewPropertyDef propertyDef = previousProperty.getPropertyDef();
      updatedProperties.add(
        new CustomViewProperty(
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
    return new CustomViewQuery(previousQuery.getViewDef(), previousQuery.getName(), updatedPath, updatedProperties);
  }

  private static Response<CustomViewQuery> createDefaultQuery(InvocationContext ic, String name) {
    BeanTreePath btp = CustomViewDefManager.getBeanTreePathFromPathQueryParam(ic);
    Response<CustomViewQuery> response = new Response<>();
    Response<CustomViewDef> viewDefResponse = CustomViewDefManager.getViewDef(ic);
    if (!viewDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(viewDefResponse);
    }
    CustomViewDef viewDef = viewDefResponse.getResults();
    ArrayList<CustomViewPathSegment> defaultPath = new ArrayList<>();
    List<CustomViewPathSegmentDef> segmentDefs = viewDef.getPathDef();
    List<BeanTreePathSegment> btpSegments = btp.getSegments();
    for (int i = 0; i < segmentDefs.size(); i++) {
      CustomViewPathSegmentDef segmentDef = segmentDefs.get(i);
      CustomViewPathSegment segment = null;
      if (segmentDef.isFilterable()) {
        BeanTreePathSegment btpSegment = btpSegments.get(i);
        String beanKey = btpSegment.isKeySet() ? btpSegment.getKey() : null;
        segment = new CustomViewPathSegment(segmentDef, CustomViewPathSegmentDef.CRITERIA_UNFILTERED, beanKey);
      } else {
        segment = new CustomViewPathSegment(segmentDef);
      }
      defaultPath.add(segment);
    }
    ArrayList<CustomViewProperty> defaultProperties = new ArrayList<>();
    for (CustomViewPropertyDef propertyDef : viewDef.getPropertyDefs()) {
      defaultProperties.add(
        new CustomViewProperty(
          propertyDef,
          CustomViewPropertyDef.CRITERIA_UNFILTERED,
          null
        )
      );
    }
    return response.setSuccess(new CustomViewQuery(viewDef, name, defaultPath, defaultProperties));
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
