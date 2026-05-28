// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Utility methods for resolving hosted-mode filesystem paths.
 */
public final class HostedFilePathUtils {
  private static final String DOWNLOADS_DIRECTORY = "downloads";

  private HostedFilePathUtils() {
  }

  /**
   * Converts an arbitrary value to a safe filesystem path component.
   */
  public static String encodePathComponent(String value) {
    if (value == null || value.isEmpty()) {
      throw new IllegalArgumentException("Path component must not be empty");
    }
    StringBuilder encoded = new StringBuilder();
    value.codePoints().forEach(codePoint -> {
      if (isSafePathComponentCodePoint(codePoint)) {
        encoded.appendCodePoint(codePoint);
      } else {
        for (byte b : new String(Character.toChars(codePoint)).getBytes(StandardCharsets.UTF_8)) {
          encoded.append('%');
          encoded.append(String.format(Locale.ROOT, "%02X", b & 0xff));
        }
      }
    });
    String result = encoded.toString();
    if (".".equals(result) || "..".equals(result)) {
      return result.replace(".", "%2E");
    }
    return result;
  }

  /**
   * Converts a user-supplied hosted filename to a safe single path component.
   */
  public static String toHostedFileName(String fileName) {
    if (fileName == null || fileName.isEmpty()) {
      throw new IllegalArgumentException("File name must not be empty");
    }
    if (fileName.indexOf('/') != -1
        || fileName.indexOf('\\') != -1
        || fileName.indexOf(':') != -1
        || fileName.indexOf('\0') != -1
        || ".".equals(fileName)
        || "..".equals(fileName)) {
      throw new IllegalArgumentException("File name must be a single safe path component");
    }
    return encodePathComponent(fileName);
  }

  /**
   * Resolves the hosted user persistence directory under the configured hosted persistence base.
   */
  public static File resolveHostedUserDirectory(File basePersistenceDirectory, String user) {
    return resolveConfinedPath(basePersistenceDirectory, encodePathComponent(user));
  }

  /**
   * Resolves a hosted provider file under the user's hosted persistence directory.
   */
  public static File resolveHostedFile(File persistenceDirectory, String hostedFileName) {
    validateSingleFileName(hostedFileName);
    return resolveConfinedPath(persistenceDirectory, hostedFileName);
  }

  /**
   * Resolves a hosted provider file from a provider name.
   */
  public static File resolveHostedFileFromName(File persistenceDirectory, String name) {
    return resolveHostedFile(persistenceDirectory, toHostedFileName(name));
  }

  /**
   * Resolves the hosted downloads directory under the user's hosted persistence directory.
   */
  public static File getHostedDownloadsDirectory(File persistenceDirectory) {
    return resolveConfinedPath(persistenceDirectory, DOWNLOADS_DIRECTORY);
  }

  /**
   * Resolves a hosted download file under the hosted downloads directory.
   */
  public static File resolveHostedDownloadFile(File persistenceDirectory, String fileName, String extension) {
    String safeFileName = toHostedFileName(fileName + extension);
    return resolveConfinedPath(getHostedDownloadsDirectory(persistenceDirectory), safeFileName);
  }

  /**
   * Resolves a child path and verifies that it remains under the supplied base directory.
   */
  public static File resolveConfinedPath(File baseDirectory, String childName) {
    if (baseDirectory == null) {
      throw new IllegalArgumentException("Base directory must not be null");
    }
    if (childName == null || childName.isEmpty()) {
      throw new IllegalArgumentException("Child path must not be empty");
    }
    try {
      File canonicalBase = baseDirectory.getCanonicalFile();
      File canonicalChild = new File(canonicalBase, childName).getCanonicalFile();
      if (!canonicalChild.toPath().startsWith(canonicalBase.toPath())) {
        throw new IllegalArgumentException("Path escapes the expected base directory");
      }
      return canonicalChild;
    } catch (IOException e) {
      throw new IllegalArgumentException("Unable to resolve hosted file path", e);
    }
  }

  private static boolean isSafePathComponentCodePoint(int codePoint) {
    return (codePoint >= 'a' && codePoint <= 'z')
      || (codePoint >= 'A' && codePoint <= 'Z')
      || (codePoint >= '0' && codePoint <= '9')
      || codePoint == '.'
      || codePoint == '_'
      || codePoint == '-';
  }

  private static void validateSingleFileName(String fileName) {
    if (fileName == null || fileName.isEmpty()) {
      throw new IllegalArgumentException("File name must not be empty");
    }
    if (fileName.indexOf('/') != -1
        || fileName.indexOf('\\') != -1
        || fileName.indexOf(':') != -1
        || fileName.indexOf('\0') != -1
        || ".".equals(fileName)
        || "..".equals(fileName)) {
      throw new IllegalArgumentException("File name must be a single safe path component");
    }
  }
}