// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.core.UriBuilder;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;

/**
 * Utilities to help construct urls.
 */
public class UrlUtils {

  private static final String DUMMY_URL_PREFIX = "http://dummyHost:9999/";

  private UrlUtils() {
  }

  public static Path relativeUriToPath(String relativeUri) {
    Path path = new Path();
    for (String encodedComponent : StringUtils.nonEmpty(relativeUri).split("/")) {
      path.addComponent(urlDecode(encodedComponent));
    }
    return path;
  }

  public static String pathToRelativeUri(Path unencodedPath) {
    Path encodedPath = new Path();
    for (String component : unencodedPath.getComponents()) {
      encodedPath.addComponent(urlEncode(component));
    }
    return encodedPath.getSlashSeparatedPath();
  }

  public static String urlEncode(String str) {
    String encodedUri = UriBuilder.fromPath(DUMMY_URL_PREFIX).segment(str).build().toString();
    return encodedUri.substring(DUMMY_URL_PREFIX.length());
  }

  public static String urlDecode(String str) {
    try {
      String encodedUri = DUMMY_URL_PREFIX + str;
      // strip off the beginning "/" from the string that getPath() returns
      return new URI(encodedUri).getPath().substring(1);
    } catch (URISyntaxException e) {
      throw new AssertionError(e); // The CFE should only have sent in valid urls
    }
  }

  /**
   * get the query param to add to an url for a single string
   */
  public static String computeQueryParam(String queryParamName, String value) {
    List<String> values = new ArrayList<>();
    values.add(value);
    return computeQueryParam(queryParamName, values);
  }

  /**
   * get the query param to add to an url for a list of strings
   */
  public static String computeQueryParam(String queryParamName, List<String> values) {
    UriBuilder bldr = UriBuilder.fromPath("");
    for (String value : values) {
      bldr.queryParam(queryParamName, value);
    }
    String uriStr = bldr.build().toString();
    return uriStr.substring(uriStr.indexOf("?") + 1);
  }
}
