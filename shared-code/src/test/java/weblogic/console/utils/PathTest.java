// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.utils;

import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PathTest {

  @Test
  public void preservesDottedServerName() {
    Path path = Path.fromComponents("DomainRuntime", "ServerLifeCycleRuntimes", "test.managed1");

    assertEquals(
      Arrays.asList("DomainRuntime", "ServerLifeCycleRuntimes", "test.managed1"), path.getComponents()
    );
  }

  @Test
  public void preservesDottedResourceNames() {
    Path path = Path.fromComponents(
      "DomainRuntime", "ServerRuntimes", "test.managed1",
      "JDBCServiceRuntime", "JDBCDataSourceRuntimeMBeans", "orders.ds"
    );

    assertEquals(
      Arrays.asList(
        "DomainRuntime", "ServerRuntimes", "test.managed1",
        "JDBCServiceRuntime", "JDBCDataSourceRuntimeMBeans", "orders.ds"
      ),
      path.getComponents()
    );
  }

  @Test
  public void preservesSingleComponentWithLeadingTrailingAndRepeatedDots() {
    assertEquals(
      Collections.singletonList(".test..managed1."), Path.fromComponents(".test..managed1.").getComponents()
    );
  }

  @Test
  public void omitsNullAndEmptyComponents() {
    Path path = Path.fromComponents(null, "DomainRuntime", "", "ServerRuntimes", "test.managed1", null, "");

    assertEquals(Arrays.asList("DomainRuntime", "ServerRuntimes", "test.managed1"), path.getComponents());
  }

  @Test
  public void createsEmptyPathWithoutComponents() {
    assertTrue(Path.fromComponents().isEmpty());
    assertTrue(Path.fromComponents((String[]) null).isEmpty());
  }

  @Test
  public void copiesProvidedComponents() {
    String[] components = {"DomainRuntime", "ServerLifeCycleRuntimes", "test.managed1"};
    Path path = Path.fromComponents(components);
    components[2] = "anotherServer";

    assertEquals("test.managed1", path.getLastComponent());
  }

  @Test
  public void dotSeparatedConstructorStillParsesMetadataPaths() {
    assertEquals(
      Arrays.asList("DomainRuntime", "ServerLifeCycleRuntimes"),
      new Path("DomainRuntime.ServerLifeCycleRuntimes").getComponents()
    );
  }
}
