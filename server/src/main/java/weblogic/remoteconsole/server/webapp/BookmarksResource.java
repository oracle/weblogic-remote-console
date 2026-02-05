// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.ObjectMapper;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class BookmarksResource {
  private static final Logger LOGGER = Logger.getLogger(BookmarksResource.class.getName());
  private static final String FILENAME = "bookmarks.json";
  private static final String FILETYPE = "bookmarksV1";

  private static String badFile(InvocationContext ic, String fileName) {
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

  private static void checkSupported(InvocationContext ic) {
    if (PersistenceManager.getPersistenceFilePath(ic) == null) {
      throw new WebApplicationException(Response.status(
        Status.METHOD_NOT_ALLOWED.getStatusCode(),
          "There is no support for bookmarks in this deployment"
      ).build());
    }
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(@Context ResourceContext resourceContext) {
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    checkSupported(ic);
    JsonArray wholeThing = readBookmarksFromFile(ic);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    if (wholeThing != null) {
      builder.add("bookmarks", wholeThing);
    }
    return
      WebAppUtils.addCookieFromContext(resourceContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  private static String getKey(JsonObject bookmark) {
    if (!bookmark.containsKey("value")) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Every bookmark must have a URL"
      ).build());
    }
    String value = bookmark.getString("value");
    JsonObject slice = bookmark.getJsonObject("slice");
    if ((slice != null) && slice.containsKey("name")) {
      if (slice.get("name").getValueType() != JsonValue.ValueType.STRING) {
        throw new WebApplicationException(Response.status(
          Status.BAD_REQUEST.getStatusCode(), "A slice must be a string"
        ).build());
      }
      return value + "slice-" + slice.getString("name");
    } else {
      return value;
    }
  }

  @PUT
  @Produces(MediaType.APPLICATION_JSON)
  public Response put(@Context ResourceContext resourceContext, JsonObject data) {
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    checkSupported(ic);
    JsonArray fillThemIn;
    if (!data.containsKey("bookmarks")
      || data.get("bookmarks").getValueType() != JsonValue.ValueType.ARRAY) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "A PUT request must put in some bookmarks"
      ).build());
    }
    fillThemIn = data.getJsonArray("bookmarks");
    JsonArray currentBookmarks = readBookmarksFromFile(ic);
    JsonArrayBuilder outputBookmarks = Json.createArrayBuilder();
    Set<String> covered = new HashSet<>();
    if (currentBookmarks != null) {
      for (JsonObject currentBookmark : currentBookmarks.getValuesAs(JsonObject.class)) {
        String currentKey = getKey(currentBookmark);
        for (JsonObject newBookmark : fillThemIn.getValuesAs(JsonObject.class)) {
          String newKey = getKey(newBookmark);
          if (newKey.equals(currentKey)) {
            currentBookmark = newBookmark;
            covered.add(currentKey);
          }
        }
        outputBookmarks.add(currentBookmark);
      }
    }
    for (JsonObject newBookmark : fillThemIn.getValuesAs(JsonObject.class)) {
      String newKey = getKey(newBookmark);
      if (!covered.contains(newKey)) {
        outputBookmarks.add(newBookmark);
      }
    }
    JsonArray outputArray = outputBookmarks.build();
    writeBookmarksToFile(ic, outputArray);
    JsonObjectBuilder result = Json.createObjectBuilder();
    result.add("bookmarks", outputArray);
    return
      WebAppUtils.addCookieFromContext(resourceContext,
        Response.ok(result.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(@Context ResourceContext resourceContext, JsonObject data) {
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    checkSupported(ic);
    JsonArray wholeThing = null;
    try {
      wholeThing = data.getJsonArray("bookmarks");
    } catch (Exception e) {
      // No bookmarks is okay
    }
    writeBookmarksToFile(ic, wholeThing);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    if (wholeThing != null) {
      builder.add("bookmarks", wholeThing);
    }
    return
      WebAppUtils.addCookieFromContext(resourceContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  private static JsonArray readBookmarksFromFile(InvocationContext ic) {
    String path = PersistenceManager.getPersistenceFilePath(ic);
    String fullPath = path + "/" + FILENAME;
    if (!new File(fullPath).exists()) {
      return null;
    }
    try (FileInputStream is = new FileInputStream(fullPath)) {
      JsonObject in = Json.createReader(is).readObject();
      if ((in.getString("fileType") == null)
        || !in.getString("fileType").equals(FILETYPE)) {
        badFile(ic, fullPath);
        return null;
      }
      return in.getJsonArray("bookmarks");
    } catch (Exception ioe) {
      // FortifyIssueSuppression Log Forging
      // This path name comes from our own code only
      LOGGER.severe(
        "Problem reading" + " " + fullPath + ": " + ioe.getMessage()
      );
      badFile(ic, fullPath);
    }
    return null;
  }

  private static void writeBookmarksToFile(InvocationContext ic, JsonArray theWholeThing) {
    String path = PersistenceManager.getPersistenceFilePath(ic);
    if (!new File(path).isDirectory()) {
      new File(path).mkdirs();
    }
    String fullPath = path + "/" + FILENAME;
    if ((theWholeThing == null)
      || (theWholeThing.size() == 0)) {
      new File(fullPath).delete();
      return;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("fileType", FILETYPE);
    builder.add("bookmarks", theWholeThing);
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
          "Can't write bookmarks file " + t.getMessage()
      ).build());
    }
  }
}
