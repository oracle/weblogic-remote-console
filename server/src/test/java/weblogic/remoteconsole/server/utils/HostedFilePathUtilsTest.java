// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class HostedFilePathUtilsTest {

  @TempDir
  File tempDir;

  @Test
  void encodesHostedUserDirectoryComponent() throws Exception {
    File userDirectory = HostedFilePathUtils.resolveHostedUserDirectory(tempDir, "realm/user name");

    assertEquals("realm%2Fuser%20name", userDirectory.getName());
    assertTrue(userDirectory.toPath().startsWith(tempDir.getCanonicalFile().toPath()));
  }

  @Test
  void encodesHostedProviderFileNameWithoutAllowingPathSeparators() throws Exception {
    String hostedFileName = HostedFilePathUtils.toHostedFileName("my model.yaml");
    File hostedFile = HostedFilePathUtils.resolveHostedFile(tempDir, hostedFileName);

    assertEquals("my%20model.yaml", hostedFile.getName());
    assertTrue(hostedFile.toPath().startsWith(tempDir.getCanonicalFile().toPath()));
  }

  @Test
  void rejectsPathLikeHostedProviderFileNames() {
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.toHostedFileName("../model.yaml"));
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.toHostedFileName("/tmp/model.yaml"));
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.toHostedFileName("nested/model.yaml"));
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.toHostedFileName("C:\\temp\\model.yaml"));
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.toHostedFileName(".."));
  }

  @Test
  void resolvesHostedDownloadFilesUnderDownloadsDirectory() throws Exception {
    File hostedDownload = HostedFilePathUtils.resolveHostedDownloadFile(tempDir, "server log", ".txt");

    assertEquals("server%20log.txt", hostedDownload.getName());
    assertEquals("downloads", hostedDownload.getParentFile().getName());
    assertTrue(hostedDownload.toPath().startsWith(tempDir.getCanonicalFile().toPath()));
  }

  @Test
  void rejectsConfinedPathEscapes() {
    assertThrows(IllegalArgumentException.class, () -> HostedFilePathUtils.resolveConfinedPath(tempDir, "../escape"));
  }
}