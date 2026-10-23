// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.List;
import java.util.stream.Collectors;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.project.ProviderTable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AdminServerResourceTest {
  private InvocationContext ic;
  private boolean previousWebAuthenticationOptionSupported;

  @BeforeEach
  void setUp() {
    previousWebAuthenticationOptionSupported = ConsoleBackendRuntimeConfig.isWebAuthenticationOptionSupported();
    ic = new InvocationContext();
    Frontend frontend = new Frontend("admin-server-resource-test", "main");
    ic.setFrontend(frontend);
    frontend.initIfNeeded(ic);
  }

  @AfterEach
  void restoreWebAuthenticationOptionSupport() {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(previousWebAuthenticationOptionSupported);
  }

  @ParameterizedTest
  @ValueSource(booleans = {true, false})
  void exposesWebAuthenticationInCreateFormOnlyWhenSupported(boolean supported) {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(supported);
    AdminServerResource resource = new AdminServerResource();

    JsonObject pdj = resource.populateCreateFormPDJ(ic, "AS", Json.createObjectBuilder()).build();
    JsonArray properties = pdj.getJsonObject("actionInputForm").getJsonArray("properties");
    JsonObject data = resource.populateCreateFormData(ic, "AS", Json.createObjectBuilder()).build();

    assertEquals(supported, hasProperty(properties, "webAuthentication"));
    assertEquals(supported, data.containsKey("webAuthentication"));
    assertTrue(hasProperty(properties, "username"));
    assertTrue(hasProperty(properties, "password"));
    assertEquals("http://localhost:7001", data.getJsonObject("url").getString("value"));
    assertEquals("Admin-Server-Connection-1", data.getJsonObject("name").getString("value"));
    if (supported) {
      assertFalse(data.getJsonObject("webAuthentication").getBoolean("value"));
    }
  }

  @ParameterizedTest
  @ValueSource(booleans = {true, false})
  void exposesWebAuthenticationInProviderFormOnlyWhenSupported(boolean supported) {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(supported);
    AdminServerResource resource = resource(Json.createObjectBuilder().build());

    JsonObject pdj = resource.populateFormPDJ(ic, Json.createObjectBuilder()).build();
    JsonArray properties = pdj.getJsonObject("sliceForm").getJsonArray("properties");
    JsonObject data = resource.populateFormData(ic, Json.createObjectBuilder()).build();

    assertEquals(supported, hasProperty(properties, "webAuthentication"));
    assertEquals(supported, data.containsKey("webAuthentication"));
    assertTrue(hasProperty(properties, "username"));
    assertTrue(hasProperty(properties, "password"));
    assertTrue(data.containsKey("proxyOverride"));
    assertTrue(data.containsKey("connectTimeoutOverride"));
    assertTrue(data.containsKey("readTimeoutOverride"));
    assertTrue(data.containsKey("insecure"));
    if (supported) {
      assertFalse(data.getJsonObject("webAuthentication").getBoolean("value"));
    }
  }

  @ParameterizedTest
  @ValueSource(booleans = {true, false})
  void exposesExistingWebAuthenticationValueOnlyWhenSupported(boolean supported) {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(supported);
    JsonObject settings = Json.createObjectBuilder().add("sso", true).build();
    AdminServerResource resource = resource(settings);

    JsonObject data = resource.populateFormData(ic, Json.createObjectBuilder()).build();

    assertEquals(supported, data.containsKey("webAuthentication"));
    if (supported) {
      assertEquals("true", data.getJsonObject("webAuthentication").getString("value"));
    }
  }

  @ParameterizedTest
  @ValueSource(booleans = {true, false})
  void offersWebAuthenticationTableColumnOnlyWhenSupported(boolean supported) {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(supported);

    JsonObject table = ProviderTable.getDefaultTableRDJ(ic)
      .getJsonObject("inlinePageDescription").getJsonObject("table");
    JsonArray hidden = table.getJsonArray("hiddenColumns");

    assertEquals(supported, hasProperty(hidden, "webAuthentication"));
    assertFalse(hasProperty(table.getJsonArray("displayedColumns"), "webAuthentication"));
    assertTrue(hasProperty(hidden, "url"));
    assertTrue(hasProperty(hidden, "username"));
  }

  @ParameterizedTest
  @ValueSource(booleans = {true, false})
  void preservesLocalProviderFormRegardlessOfWebAuthenticationOptionSupport(boolean supported) {
    ConsoleBackendRuntimeConfig.setWebAuthenticationOptionSupported(supported);
    AdminServerResource resource = resource(Json.createObjectBuilder().add("local", true).build());

    JsonObject pdj = resource.populateFormPDJ(ic, Json.createObjectBuilder()).build();
    JsonArray properties = pdj.getJsonObject("sliceForm").getJsonArray("properties");
    JsonObject data = resource.populateFormData(ic, Json.createObjectBuilder()).build();

    assertEquals(
      List.of("name", "url", "state"),
      properties.getValuesAs(JsonObject.class).stream()
        .map(property -> property.getString("name")).collect(Collectors.toList())
    );
    for (JsonObject property : properties.getValuesAs(JsonObject.class)) {
      assertTrue(property.getBoolean("readOnly"));
    }
    assertFalse(data.containsKey("webAuthentication"));
    assertEquals("http://localhost:7001", data.getJsonObject("url").getString("value"));
  }

  private AdminServerResource resource(JsonObject settings) {
    JsonObject json = Json.createObjectBuilder()
      .add("name", "Test Connection")
      .add("type", "adminserver")
      .add("url", "http://localhost:7001")
      .add("settings", settings)
      .build();
    return new AdminServerResource(new ConfiguredProvider("Test Connection", json));
  }

  private boolean hasProperty(JsonArray properties, String name) {
    return properties.getValuesAs(JsonObject.class).stream()
      .anyMatch(property -> name.equals(property.getString("name")));
  }
}
