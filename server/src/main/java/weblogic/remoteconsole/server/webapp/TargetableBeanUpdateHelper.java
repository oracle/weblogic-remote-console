// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Customizes updates to JMS targetable beans.
 */
public class TargetableBeanUpdateHelper extends UpdateHelper {

  static final String DEFAULT_TARGETING_ENABLED = "DefaultTargetingEnabled";
  static final String SUB_DEPLOYMENT_NAME = "SubDeploymentName";

  @Override
  protected Response<List<FormProperty>> customizeFormProperties(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    FormProperty defaultTargeting = FormProperty.findProperty(DEFAULT_TARGETING_ENABLED, formProperties);
    FormProperty subDeployment = FormProperty.findProperty(SUB_DEPLOYMENT_NAME, formProperties);

    if (isSetToTrue(defaultTargeting)) {
      return new Response<List<FormProperty>>().setSuccess(unsetSubDeployment(formProperties, subDeployment));
    }

    // An explicitly submitted false (or unset) value wins over the current value.
    // There is nothing to normalize if the request did not include the subdeployment.
    if (defaultTargeting != null || subDeployment == null) {
      return new Response<List<FormProperty>>().setSuccess(formProperties);
    }

    Response<Boolean> getResponse = getCurrentDefaultTargetingEnabled(ic);
    if (!getResponse.isSuccess()) {
      return new Response<List<FormProperty>>().copyUnsuccessfulResponse(getResponse);
    }
    if (getResponse.getResults()) {
      return new Response<List<FormProperty>>().setSuccess(unsetSubDeployment(formProperties, subDeployment));
    }
    return new Response<List<FormProperty>>().setSuccess(formProperties);
  }

  protected Response<Boolean> getCurrentDefaultTargetingEnabled(InvocationContext ic) {
    Response<Boolean> response = new Response<>();
    Response<Map<String,Value>> getResponse =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().getBeanProperties(
        ic,
        List.of(DEFAULT_TARGETING_ENABLED),
        false
      );
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }

    Value value = getResponse.getResults().get(DEFAULT_TARGETING_ENABLED);
    if (value != null && value.isSettable()) {
      value = value.asSettable().getValue();
    }
    return response.setSuccess(value != null && value.isBoolean() && value.asBoolean().getValue());
  }

  private static boolean isSetToTrue(FormProperty property) {
    if (property == null || !property.getValue().isSettable()) {
      return false;
    }
    SettableValue settableValue = property.getValue().asSettable();
    Value value = settableValue.getValue();
    return settableValue.isSet() && value != null && value.isBoolean() && value.asBoolean().getValue();
  }

  private static List<FormProperty> unsetSubDeployment(
    List<FormProperty> formProperties,
    FormProperty subDeployment
  ) {
    List<FormProperty> normalizedProperties = new ArrayList<>(formProperties.size() + 1);
    for (FormProperty property : formProperties) {
      if (property == subDeployment) {
        normalizedProperties.add(new FormProperty(property.getFieldDef(), new SettableValue(null, false)));
      } else {
        normalizedProperties.add(property);
      }
    }
    if (subDeployment == null) {
      CustomPagePropertyDef propertyDef =
        new CustomPagePropertyDef()
          .formFieldName(SUB_DEPLOYMENT_NAME)
          .propertyName(SUB_DEPLOYMENT_NAME)
          .onlinePropertyName("subDeploymentName")
          .offlinePropertyName(SUB_DEPLOYMENT_NAME);
      normalizedProperties.add(new FormProperty(propertyDef, new SettableValue(null, false)));
    }
    return normalizedProperties;
  }
}
