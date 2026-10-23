// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.json.Json;
import javax.json.JsonArray;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriBuilder;

import org.glassfish.jersey.uri.UriComponent;
import org.junit.jupiter.api.Test;
import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.utils.RemoteConsoleExtension;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestRuntimeTreeBeanRepo;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class WebAppComponentRuntimeMBeanCustomizerTest {

  @Test
  void targetsSelectedWebAppThroughAdminServerEndpoint() {
    assertSessionsRequest(
      beanPath("AdminServer", "MyApp", "myapp.war"), "AdminServer", "MyApp", "myapp.war"
    );
  }

  @Test
  void targetsManagedServerWebAppThroughAdminServerEndpoint() {
    assertSessionsRequest(
      beanPath("ms1", "MyApp", "ms1_/myapp"), "ms1", "MyApp", "ms1_/myapp"
    );
  }

  @Test
  void targetsSelectedWebAppThroughCombinedServerRuntimes() {
    assertSessionsRequest(
      delegatedBeanPath("AdminServer", "MyApp", "myapp.war"), "AdminServer", "MyApp", "myapp.war"
    );
  }

  @Test
  void targetsManagedServerWebAppThroughCombinedServerRuntimes() {
    assertSessionsRequest(
      delegatedBeanPath("ms1", "MyApp", "ms1_/myapp"), "ms1", "MyApp", "ms1_/myapp"
    );
  }

  @Test
  void preservesSpecialCharactersInRuntimeKeys() {
    assertSessionsRequest(
      beanPath("Admin Server", "MyApp#v1", "/myapp+%&.war"), "Admin Server", "MyApp#v1", "/myapp+%&.war"
    );
  }

  @Test
  void preservesSpecialCharactersThroughCombinedServerRuntimes() {
    assertSessionsRequest(
      delegatedBeanPath("Admin Server", "MyApp#v1", "/myapp+%&.war"), "Admin Server", "MyApp#v1", "/myapp+%&.war"
    );
  }

  @Test
  void mapsSessionWithoutDomainFilteringFieldsToTypedCells() {
    JsonArray sessions = Json.createArrayBuilder().add(
      Json.createObjectBuilder()
        .add("monitoringId", "session-1")
        .add("timeLastAccessed", 1700000000000L)
        .add("maxInactiveInterval", 1800L)
        .add("contextRoot", "/myapp")
        .add("componentName", "myapp.war")
    ).build();

    List<TableRow> rows = WebAppComponentRuntimeMBeanCustomizer.toTableRows(sessions);

    assertEquals(1, rows.size());
    List<TableCell> cells = rows.get(0).getCells();
    assertEquals(4, cells.size());
    assertEquals("ContextRoot", cells.get(0).getName());
    assertEquals("/myapp", cells.get(0).getValue().asString().getValue());
    assertEquals("TimeLastAccessed", cells.get(1).getName());
    assertEquals(1700000000000L, cells.get(1).getValue().asDateAsLong().getValue());
    assertEquals("MaxInactiveInterval", cells.get(2).getName());
    assertEquals(1800L, cells.get(2).getValue().asLong().getValue());
    assertEquals("MonitoringId", cells.get(3).getName());
    assertEquals("session-1", cells.get(3).getValue().asString().getValue());
  }

  @Test
  void mapsEmptySessionsToEmptyTable() {
    assertTrue(WebAppComponentRuntimeMBeanCustomizer.toTableRows(Json.createArrayBuilder().build()).isEmpty());
  }

  private void assertSessionsRequest(BeanTreePath beanPath, String server, String application, String component) {
    WebLogicRestRequest request = WebAppComponentRuntimeMBeanCustomizer.getSessionsRequestBuilder(beanPath)
      .path(UrlUtils.pathToRelativeUri(WebAppComponentRuntimeMBeanCustomizer.SESSIONS_PATH))
      .build();

    assertEquals(List.of("domainRuntime/webAppSessions"), request.path());
    assertEquals(
      Map.of("serverName", server, "applicationName", application, "componentName", component),
      request.queryParams()
    );
    UriBuilder uri = UriBuilder.fromPath(String.join("/", request.path()));
    request.queryParams().forEach((name, value) -> uri.queryParam(name, value));
    MultivaluedMap<String, String> decodedParams = UriComponent.decodeQuery(uri.build(), true);
    assertEquals(server, decodedParams.getFirst("serverName"));
    assertEquals(application, decodedParams.getFirst("applicationName"));
    assertEquals(component, decodedParams.getFirst("componentName"));
  }

  private BeanTreePath delegatedBeanPath(String server, String application, String component) {
    Path path = new Path();
    path.addComponents(
      "DomainRuntime", "CombinedServerRuntimes", server, "ServerRuntime",
      "ApplicationRuntimes", application, "ComponentRuntimes", component
    );
    return beanPath(path);
  }

  private BeanTreePath beanPath(String server, String application, String component) {
    Path path = new Path();
    path.addComponents(
      "DomainRuntime", "ServerRuntimes", server, "ApplicationRuntimes", application, "ComponentRuntimes", component
    );
    return beanPath(path);
  }

  private BeanTreePath beanPath(Path path) {
    WebLogicMBeansVersion version = new WebLogicMBeansVersion() {
      @Override
      public WebLogicVersion getWebLogicVersion() {
        return WebLogicVersions.getVersion("14.1.2.0.0");
      }

      @Override
      public Set<String> getRoles() {
        return Set.of("Admin");
      }

      @Override
      public Set<String> getCapabilities() {
        return ALL_CAPABILITIES;
      }

      @Override
      public List<RemoteConsoleExtension> getExtensions() {
        return List.of();
      }
    };
    return BeanTreePath.create(new WebLogicRestRuntimeTreeBeanRepo(version), path);
  }
}
