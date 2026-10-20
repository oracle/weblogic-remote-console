// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;

public class TargetableBeanCustomizerTest {

  @Test
  void hidesUnsetDerivedSubDeploymentWhenDefaultTargetingIsEnabled() {
    SettableValue subDeployment = new SettableValue(new StringValue("DerivedSubDeployment"), false);

    SettableValue displayed =
      TargetableBeanCustomizer.getSubDeploymentName(booleanValue(true), subDeployment);

    assertFalse(displayed.isSet());
    assertNull(displayed.getValue().asString().getValue());
  }

  @Test
  void preservesUnsetDerivedSubDeploymentWhenDefaultTargetingIsDisabled() {
    SettableValue subDeployment = new SettableValue(new StringValue("DerivedSubDeployment"), false);

    SettableValue displayed =
      TargetableBeanCustomizer.getSubDeploymentName(booleanValue(false), subDeployment);

    assertSame(subDeployment, displayed);
  }

  @Test
  void preservesUnsetNullSubDeploymentWhenDefaultTargetingIsEnabled() {
    SettableValue subDeployment = new SettableValue(null, false);

    SettableValue displayed =
      TargetableBeanCustomizer.getSubDeploymentName(booleanValue(true), subDeployment);

    assertSame(subDeployment, displayed);
  }

  @Test
  void preservesExplicitSubDeploymentSoInvalidConfigurationIsNotHidden() {
    SettableValue subDeployment = new SettableValue(new StringValue("ConfiguredSubDeployment"), true);

    SettableValue displayed =
      TargetableBeanCustomizer.getSubDeploymentName(booleanValue(true), subDeployment);

    assertSame(subDeployment, displayed);
  }

  @Test
  void preservesSubDeploymentWhenDefaultTargetingIsUnavailable() {
    SettableValue subDeployment = new SettableValue(new StringValue("DerivedSubDeployment"), false);

    SettableValue displayed = TargetableBeanCustomizer.getSubDeploymentName(null, subDeployment);

    assertSame(subDeployment, displayed);
  }

  @Test
  void preservesUnavailableSubDeployment() {
    SettableValue displayed =
      TargetableBeanCustomizer.getSubDeploymentName(booleanValue(true), null);

    assertNull(displayed);
  }

  private static SettableValue booleanValue(boolean value) {
    return new SettableValue(new BooleanValue(value), true);
  }
}
