// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.ObjectMapper;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class BookmarkManager {
  private static final Logger LOGGER = Logger.getLogger(BookmarkManager.class.getName());
  private static final String OLD_FILENAME = "bookmarks.json";
  private static final String FILENAME = "bookmarksv2.json";
  private static final String OLD_FILETYPE = "bookmarksV1";
  private static final String FILETYPE = "bookmarksV2";
  private Map<String, String> bookmarks;

  private String badFile(InvocationContext ic, String fileName) {
    String newPath = null;
    do {
      // FortifyIssueSuppression Insecure Randomness
      // This is obviously not intended to be securely random
      newPath = fileName + "-" + new Random().nextInt(100000);
    } while (new File(newPath).exists());
    // FortifyIssueSuppression Log Forging
    // This path name comes from our own code only
    LOGGER.warning("Bookmarks file is tainted, tainted file saved as " + newPath);
    new File(fileName).renameTo(new File(newPath));
    return newPath;
  }

  public void add(
    InvocationContext ic,
    String resourceData,
    String label) {
    // A resourceData looks like /api/<provider>/tree/path.
    // But, for bookmarks, we store tree/path.
    String path = resourceData.replaceAll("^/api/[^/]*/", "");
    readBookmarksFromFile(ic);
    bookmarks.put(path, label);
    writeBookmarksToFile(ic);
  }

  public void delete(InvocationContext ic, String resourceData) {
    // A resourceData looks like /api/<provider>/tree/path.
    // But, for bookmarks, we store tree/path.
    String path = resourceData.replaceAll("^/api/[^/]*/", "");
    readBookmarksFromFile(ic);
    bookmarks.remove(path);
    writeBookmarksToFile(ic);
  }

  private synchronized void readBookmarksFromFile(InvocationContext ic) {
    if (bookmarks != null) {
      return;
    }
    bookmarks = new HashMap<>();
    String fullPath =
      PersistenceManager.getPersistenceFilePath(ic) + "/" + FILENAME;
    if (!new File(fullPath).exists()) {
      readBookmarksFromOldFile(ic);
      return;
    }
    try (FileInputStream is = new FileInputStream(fullPath)) {
      JsonObject in = Json.createReader(is).readObject();
      if (in.getString("fileType") == null) {
        badFile(ic, fullPath);
        return;
      }
      if (!in.getString("fileType").equals(FILETYPE)) {
        badFile(ic, fullPath);
        return;
      }
      for (JsonValue bookmark : in.getJsonArray("bookmarks")) {
        bookmarks.put(((JsonObject) bookmark).getString("path"),
          ((JsonObject) bookmark).getString("label"));
      }
    } catch (Exception ioe) {
      // FortifyIssueSuppression Log Forging
      // This path name comes from our own code only
      LOGGER.severe(
        "Problem reading" + " " + fullPath + ": " + ioe.getMessage()
      );
      badFile(ic, fullPath);
    }
  }

  private void readBookmarksFromOldFile(InvocationContext ic) {
    String fullPath =
      PersistenceManager.getPersistenceFilePath(ic) + "/" + OLD_FILENAME;
    if (!new File(fullPath).exists()) {
      return;
    }
    try (FileInputStream is = new FileInputStream(fullPath)) {
      JsonObject in = Json.createReader(is).readObject();
      if (!in.getString("fileType").equals(OLD_FILETYPE)) {
        badFile(ic, fullPath);
        return;
      }
      for (JsonValue bookmark : in.getJsonArray("bookmarks")) {
        String value = ((JsonObject) bookmark).getString("value");
        if (value.split("/").length < 5) {
          continue;
        }
        String path = value.replaceAll("^/api/[^/]*/", "");
        JsonArray breadCrumbs = ((JsonObject) bookmark).getJsonArray("breadcrumbLabels");
        String label = null;
        for (JsonValue labelValue : breadCrumbs) {
          if (label == null) {
            label = ((JsonString) labelValue).getString();
          } else {
            label = label + " / " + ((JsonString) labelValue).getString();
          }
        }
        bookmarks.put(path, label);
      }
    } catch (Exception ioe) {
      // FortifyIssueSuppression Log Forging
      // This path name comes from our own code only
      LOGGER.severe(
        "Problem reading" + " " + fullPath + ": " + ioe.getMessage()
      );
      badFile(ic, fullPath);
    }
  }

  public boolean check(InvocationContext ic, String resourceData) {
    readBookmarksFromFile(ic);
    // A resourceData looks like /api/<provider>/tree/path.
    // But, for bookmarks, we store tree/path
    String path = resourceData.replaceAll("^/api/[^/]*/", "");
    return bookmarks.containsKey(path);
  }

  public Set<Map.Entry<String, String>> getAll(InvocationContext ic) {
    readBookmarksFromFile(ic);
    return bookmarks.entrySet();
  }

  public synchronized void writeBookmarksToFile(InvocationContext ic) {
    String dirPath = PersistenceManager.getPersistenceFilePath(ic);
    if (!new File(dirPath).isDirectory()) {
      new File(dirPath).mkdirs();
    }
    String fullPath = dirPath + "/" + FILENAME;
    if (bookmarks.isEmpty()) {
      new File(fullPath).delete();
      return;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("fileType", FILETYPE);
    JsonArrayBuilder bookmarksBuilder = Json.createArrayBuilder();
    for (String path : bookmarks.keySet()) {
      bookmarksBuilder.add(Json.createObjectBuilder()
        .add("label", bookmarks.get(path))
        .add("path", path));
    }
    builder.add("bookmarks", bookmarksBuilder);
    try {
      ObjectMapper mapper = new ObjectMapper();
      mapper.writerWithDefaultPrettyPrinter().writeValue(
        new File(fullPath),
        mapper.readValue(builder.build().toString(), Object.class)
      );
    } catch (Throwable t) {
      LOGGER.severe(
        "Problem writing" + " " + fullPath + ": " + t.getMessage()
      );
      throw new WebApplicationException(Response.status(
        Status.INTERNAL_SERVER_ERROR.getStatusCode(),
          ic.getLocalizer().localizeString(LocalizedConstants.CANNOT_WRITE_BOOKMARKS_FILE_MESSAGE, t.getMessage())
      ).build());
    }
  }
}
