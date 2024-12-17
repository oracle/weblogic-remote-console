// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.Value;

/**
 * General utilities for customizers
 */
public class CustomizerUtils {

  private CustomizerUtils() {
  }

  public static FormProperty createFormProperty(
    BeanPropertyDef propertyDef,
    List<FormProperty> oldProperties,
    BeanSearchResults beanResults
  ) {
    return
      new FormProperty(
        findRequiredFormProperty(propertyDef.getFormFieldName(), oldProperties).getFieldDef(),
        beanResults.getValue(propertyDef)
      );
  }

  public static FormProperty createFormProperty(
    String propertyName,
    List<FormProperty> oldProperties,
    Value propertyValue
  ) {
    return
      new FormProperty(
        findRequiredFormProperty(propertyName, oldProperties).getFieldDef(),
        propertyValue
      );
  }

  public static FormProperty findRequiredFormProperty(String propertyName, List<FormProperty> formProperties) {
    FormProperty formProperty = findOptionalFormProperty(propertyName, formProperties);
    if (formProperty == null) {
      throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
    } else {
      return formProperty;
    }
  }

  public static FormProperty findOptionalFormProperty(String propertyName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propertyName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    return null;
  }

  public static String getStringField(JsonObject jo, String field) {
    if (jo.containsKey(field) && !jo.isNull(field)) {
      return jo.getString(field);
    }
    return null;
  }
}
