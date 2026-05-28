// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.util.List;
import javax.ws.rs.HttpMethod;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SessionRequestGuardTest {

  @Test
  void getStatusDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.GET,
      List.of("api", "status")
    ));
  }

  @Test
  void projectNavtreePostDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "project", "navtree")
    ));
  }

  @Test
  void providerNavtreePostDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "navtree")
    ));
  }

  @Test
  void currentProviderNavtreePostDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "-current-", "edit", "navtree")
    ));
  }

  @Test
  void searchPostDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "search")
    ));
  }

  @Test
  void simpleSearchPostDoesNotRequireExistingFrontend() {
    assertFalse(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "simpleSearch")
    ));
  }

  @Test
  void createWdtPostRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "project", "data", "Default%20Project")
    ));
  }

  @Test
  void providerSavePostRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "project", "data", "Default%20Project", "providerName")
    ));
  }

  @Test
  void beanDeleteRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.DELETE,
      List.of("api", "as-conn-1", "edit", "data", "Domain", "Servers", "server1")
    ));
  }

  @Test
  void projectDataPathEndingInNavtreeRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "project", "data", "navtree")
    ));
  }

  @Test
  void dataPathEndingInNavtreeRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "data", "Domain", "navtree")
    ));
  }

  @Test
  void dataPathEndingInSearchRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "data", "Domain", "search")
    ));
  }

  @Test
  void dataPathEndingInSimpleSearchRequiresExistingFrontend() {
    assertTrue(SessionRequestGuard.requiresExistingFrontend(
      HttpMethod.POST,
      List.of("api", "as-conn-1", "edit", "data", "Domain", "simpleSearch")
    ));
  }
}
