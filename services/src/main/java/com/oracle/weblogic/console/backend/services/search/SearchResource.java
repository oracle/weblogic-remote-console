// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.search;

import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.BaseResource;
import com.oracle.weblogic.console.backend.services.ServiceException;
import weblogic.console.backend.search.PageResults;
import weblogic.console.backend.search.Searcher;

public class SearchResource extends BaseResource {

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @javax.ws.rs.Path("pages")
  public Response search(
    @QueryParam("query") @DefaultValue("") String query
  ) throws ServiceException {
    try {
      Path directory = findIndexDir();
      List<PageResults> results = doSearch(query, directory);
      JsonArrayBuilder ab = Json.createArrayBuilder();
      for (PageResults pr : results) {
        ab.add(
          Json.createObjectBuilder()
            .add("title", pr.getPageTitle())
            .add("link", pr.getPagePath())
            .build()
        );
      }
      JsonObject obj = Json.createObjectBuilder().add("results", ab).build();
      return Response.ok(obj).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  private List<PageResults> doSearch(String query, Path directory) throws Exception {
    Searcher searcher = new Searcher();
    return searcher.search(directory.normalize().toString(), query);
  }

  // TBD - we need to use the same algorithm that ResourceBundles do to
  // match up the locale with the language:
  private Path findIndexDir() throws Exception {
    Locale locale = getInvocationContext().getLocalizer().getLocale();
    String language = (locale != null) ? locale.getLanguage() : null;
    Path dir = findIndexDir(language);
    if (dir == null) {
      // fall back to english
      dir = findIndexDir("en");
    }
    if (dir == null) {
      throw
        new Exception(
          "Missing index.  weblogic version="
          + getWeblogicVersion()
          + " locale="
          + locale
        );
    }
    return dir;
  }

  private Path findIndexDir(String language) throws Exception {
    if (language != null) {
      String index = language;
      URL r =
        getClass()
          .getClassLoader()
          .getResource(getWeblogicVersion() + "/" + index + "/write.lock");
      if (r != null) {
        Path lockFile = Paths.get(r.toURI());
        if (lockFile != null && lockFile.toFile().exists()) {
          return lockFile.getParent();
        }
      }
    }
    return null;
  }

  private String getWeblogicVersion() throws Exception {
    return getInvocationContext().getConnection().getDomainVersion();
  }
}
