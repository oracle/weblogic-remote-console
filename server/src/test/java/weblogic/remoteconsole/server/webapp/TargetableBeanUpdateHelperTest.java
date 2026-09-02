// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TargetableBeanUpdateHelperTest {

  @Test
  void enablingDefaultTargetingUnsetsBlankSubDeployment() {
    List<FormProperty> properties =
      properties(booleanProperty(true), stringProperty(""));

    List<FormProperty> normalized = customize(properties, false);

    assertTrue(settableValue(normalized, "DefaultTargetingEnabled").isSet());
    assertTrue(settableValue(normalized, "DefaultTargetingEnabled").getValue().asBoolean().getValue());
    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void enablingDefaultTargetingAddsUnsetSubDeploymentWhenItWasNotSubmitted() {
    List<FormProperty> properties = properties(booleanProperty(true));

    List<FormProperty> normalized = customize(properties, false);

    assertEquals(2, normalized.size());
    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void enablingDefaultTargetingUnsetsNonBlankSubDeployment() {
    List<FormProperty> properties =
      properties(booleanProperty(true), stringProperty("ConfiguredSubDeployment"));

    List<FormProperty> normalized = customize(properties, false);

    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void enablingDefaultTargetingLeavesUnsetSubDeploymentUnset() {
    List<FormProperty> properties =
      properties(booleanProperty(true), unsetProperty("SubDeploymentName"));

    List<FormProperty> normalized = customize(properties, false);

    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void blankSubDeploymentIsUnsetWhenDefaultTargetingIsAlreadyEnabled() {
    List<FormProperty> properties = properties(stringProperty(""));

    List<FormProperty> normalized = customize(properties, true);

    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void nonBlankSubDeploymentIsUnsetWhenDefaultTargetingIsAlreadyEnabled() {
    List<FormProperty> properties = properties(stringProperty("ConfiguredSubDeployment"));

    List<FormProperty> normalized = customize(properties, true);

    assertFalse(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void disabledDefaultTargetingLeavesBlankSubDeploymentUnchanged() {
    List<FormProperty> properties = properties(booleanProperty(false), stringProperty(""));

    List<FormProperty> normalized = customize(properties, true);

    assertSame(properties, normalized);
    assertTrue(settableValue(normalized, "SubDeploymentName").isSet());
  }

  @Test
  void disabledDefaultTargetingPreservesNonBlankSubDeployment() {
    List<FormProperty> properties =
      properties(booleanProperty(false), stringProperty("ConfiguredSubDeployment"));

    List<FormProperty> normalized = customize(properties, true);

    assertSame(properties, normalized);
    assertEquals(
      "ConfiguredSubDeployment",
      settableValue(normalized, "SubDeploymentName").getValue().asString().getValue()
    );
  }

  @Test
  void subDeploymentIsPreservedWhenDefaultTargetingIsAlreadyDisabled() {
    List<FormProperty> properties = properties(stringProperty("ConfiguredSubDeployment"));

    List<FormProperty> normalized = customize(properties, false);

    assertSame(properties, normalized);
    assertTrue(settableValue(normalized, "SubDeploymentName").isSet());
  }

  private static List<FormProperty> customize(List<FormProperty> properties, boolean currentDefaultTargeting) {
    TestUpdateHelper helper = new TestUpdateHelper(currentDefaultTargeting);
    Response<List<FormProperty>> response = helper.customizeFormProperties(null, properties);
    assertTrue(response.isSuccess());
    return response.getResults();
  }

  private static List<FormProperty> properties(FormProperty... properties) {
    return new ArrayList<>(List.of(properties));
  }

  private static FormProperty booleanProperty(boolean value) {
    return property("DefaultTargetingEnabled", new BooleanValue(value));
  }

  private static FormProperty stringProperty(String value) {
    return property("SubDeploymentName", new StringValue(value));
  }

  private static FormProperty unsetProperty(String name) {
    CustomPagePropertyDef propertyDef = propertyDef(name);
    return new FormProperty(propertyDef, new SettableValue(null, false));
  }

  private static FormProperty property(String name, Value value) {
    return new FormProperty(propertyDef(name), new SettableValue(value, true));
  }

  private static CustomPagePropertyDef propertyDef(String name) {
    return
      new CustomPagePropertyDef()
        .formFieldName(name)
        .propertyName(name)
        .onlinePropertyName(name)
        .offlinePropertyName(name);
  }

  private static SettableValue settableValue(List<FormProperty> properties, String name) {
    return FormProperty.findProperty(name, properties).getValue().asSettable();
  }

  private static class TestUpdateHelper extends TargetableBeanUpdateHelper {
    private final boolean currentDefaultTargeting;

    private TestUpdateHelper(boolean currentDefaultTargeting) {
      this.currentDefaultTargeting = currentDefaultTargeting;
    }

    @Override
    protected Response<Boolean> getCurrentDefaultTargetingEnabled(InvocationContext ic) {
      return new Response<Boolean>().setSuccess(currentDefaultTargeting);
    }
  }
}
