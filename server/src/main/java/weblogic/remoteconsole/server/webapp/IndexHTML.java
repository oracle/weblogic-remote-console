// Copyright (c) 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.common.utils.SupportedLocales;

@Path("/index.html")
@Produces(MediaType.TEXT_HTML)
public class IndexHTML {
  // a cache of language-specific index.html strings
  private static Map<String,String> resources = new HashMap<>();

  @GET
  public String get(@Context HttpHeaders headers) throws IOException {
    // Get the list of languages preferences set in the browser via the Accept-Language header
    String selectedLang = SupportedLocales.getFirstSupportedAcceptLanguage(
      ((headers != null) ? headers.getAcceptableLanguages() : null));

    // Attempt to get the language-specific index.html from the cashe
    String resource = resources.get(selectedLang);

    if (resource == null) {
      // not in the cache, so get the unmodified, English index.html, and modify it for the
      // selected language
      BufferedReader reader = new BufferedReader(
        new InputStreamReader(
          getClass().getClassLoader().getResource("frontend/index.html.in").openStream()
        )
      );
      String s;
      // FortifyIssueSuppression Denial of Service
      // This is reading data from a resource
      while ((s = reader.readLine()) != null) {
        if (resource == null) {
          resource = s;
        } else {
          resource = resource + "\n" + s;
        }
      }
      if (!selectedLang.equals("en")) {
        resource = resource.replace("<html lang=\"en\">", "<html lang=\"" + selectedLang + "\">");
      }
      // cache it
      resources.put(selectedLang,resource);
    }

    return resource;
  }

}
