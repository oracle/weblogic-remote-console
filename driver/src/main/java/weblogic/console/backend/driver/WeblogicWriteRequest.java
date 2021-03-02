// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonObject;

import weblogic.console.backend.utils.Path;

/**
 * Holds the data needed to make a WebLogic REST request to create or modify a bean:
 * <ul>
 *   <li> the relative Weblogic REST uri from the folded bean to the bean that needs to be modified</li>
 *   <li> the JSON request body (in weblogic REST terms)</li>
 * </ul>
 * <p>
 * Example1: SSLMBean level properties for the Server General page:
 * <ul>
 *   <li>
 *     weblogicBeanPath [ SSL ] // since the SSLMBean gets folded into the ServerMBean
 *   </li>
 *   <li>
 *     requestBody { listenPort: 7002 } // want to set the SSLMBean's listenPort to 7002
 *   </li>
 * </ul>
 * <p>
 * Example: ServerMBean level properties for the Server General page:
 * <ul>
 *   <li>weblogicBeanPath [] // since ServerMBean is the top level folded ban on the page</li>
 *   <li>requestBody { listenPort: 7001 } // want to set the ServerMBean's listenPort to 7001</li>
 * </ul>
 */
public class WeblogicWriteRequest {
  private PathSegmentRestMapping segmentMapping;

  public PathSegmentRestMapping getSegmentMapping() {
    return this.segmentMapping;
  }

  private Path weblogicBeanPath;

  public Path getWeblogicBeanPath() {
    return this.weblogicBeanPath;
  }

  private JsonObject weblogicWriteRequestBody;

  public JsonObject getWeblogicWriteRequestBody() {
    return this.weblogicWriteRequestBody;
  }

  /*package*/ WeblogicWriteRequest(
    PathSegmentRestMapping segmentMapping,
    Path weblogicBeanPath,
    JsonObject weblogicWriteRequestBody
  ) {
    this.segmentMapping = segmentMapping;
    this.weblogicBeanPath = weblogicBeanPath;
    this.weblogicWriteRequestBody = weblogicWriteRequestBody;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("WeblogicWriteRequest(")
      .append("weblogicPathPath=")
      .append(getWeblogicBeanPath())
      .append(", weblogicWriteRequestBody=")
      .append(getWeblogicWriteRequestBody());
    return sb.toString();
  }
}
