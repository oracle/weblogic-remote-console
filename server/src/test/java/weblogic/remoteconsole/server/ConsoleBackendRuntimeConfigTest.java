// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.Collections;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ConsoleBackendRuntimeConfigTest {
  private static final String SYSTEM_PROPERTY = "console.restrictContentBasedOnRoles";
  private String previousSystemProperty;

  @BeforeEach
  void clearSystemProperty() {
    previousSystemProperty = System.getProperty(SYSTEM_PROPERTY);
    System.clearProperty(SYSTEM_PROPERTY);
  }

  @AfterEach
  void restoreSystemProperty() {
    if (previousSystemProperty == null) {
      System.clearProperty(SYSTEM_PROPERTY);
    } else {
      System.setProperty(SYSTEM_PROPERTY, previousSystemProperty);
    }
    ConsoleBackendRuntimeConfig.init(null);
  }

  @Test
  void defaultsToRestrictingContentBasedOnRoles() {
    ConsoleBackendRuntimeConfig.init(null);

    assertTrue(ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles());
  }

  @Test
  void usesHostedDeploymentProperty() {
    ConsoleBackendRuntimeConfig.init(
      Collections.singletonMap("restrictContentBasedOnRoles", "false"));

    assertFalse(ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles());
  }

  @Test
  void systemPropertyOverridesHostedDeploymentProperty() {
    System.setProperty(SYSTEM_PROPERTY, "true");
    ConsoleBackendRuntimeConfig.init(
      Collections.singletonMap("restrictContentBasedOnRoles", "false"));
    assertTrue(ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles());

    System.setProperty(SYSTEM_PROPERTY, "false");
    ConsoleBackendRuntimeConfig.init(
      Collections.singletonMap("restrictContentBasedOnRoles", "true"));
    assertFalse(ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles());
  }
}
