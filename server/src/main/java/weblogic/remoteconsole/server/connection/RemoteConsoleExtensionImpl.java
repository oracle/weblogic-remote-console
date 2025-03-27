// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.jar.JarFile;
import javax.ws.rs.core.MediaType;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.utils.RemoteConsoleExtension;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;

/** Contains information about a remote console extension that is returned by an admin server.
 */
class RemoteConsoleExtensionImpl implements RemoteConsoleExtension {
  private String name;
  private String version;
  private Connection connection;
  private boolean initializedJarFile = false;
  private JarFile jarFile = null;

  public RemoteConsoleExtensionImpl(String name, String version) {
    this.name = name;
    this.version = version;
  }

  void setConnection(Connection connection) {
    this.connection = connection;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getVersion() {
    return version;
  }

  @Override
  public synchronized JarFile getJarFile() {
    if (!initializedJarFile) {
      Path path = new Path("domainRuntime.consoleBackend.extensions");
      path.addComponent(getName());
      path.addComponent("download");
      WebLogicRestRequest request =
        WebLogicRestRequest.builder()
          .root(WebLogicRestRequest.CURRENT_WEBLOGIC_REST_API_ROOT)
          .connection(connection)
          .path(UrlUtils.pathToRelativeUri(path))
          .build();
      // System.out.println("DEBUG downloading " + UrlUtils.pathToRelativeUri(path));
      try (InputStream is = WebLogicRestClient.getAsInputStream(request, MediaType.APPLICATION_OCTET_STREAM)) {
        File temp = File.createTempFile(getName(), ".jar");
        temp.deleteOnExit();
        Files.copy(is, temp.toPath(), StandardCopyOption.REPLACE_EXISTING);
        jarFile = new JarFile(temp);
      } catch (IOException e) {
        throw new RuntimeException(e);
      } finally {
        initializedJarFile = true;
      }
    }
    return jarFile;
  }
}
