// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;

/**
 * Repackages static information about a property from a bean that is included
 * in a plugin paramter so that the RDS can efficiently convert between RDJ REST
 * requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a parameter:
 * <ul>
 *   <li>parent - the bean's path segment</li>
 *   <li>beanProperty - the property to include from this bean</li>
 *   <li>referringPluginParameter - the plugin parameter that includes these bean properties</li>
 * </ul>
 */
public class PluginBeanPropertyRestMapping {

  private static final Logger LOGGER =
    Logger.getLogger(PluginBeanPropertyRestMapping.class.getName());

  private PathSegmentRestMapping parent;

  public PathSegmentRestMapping getParent() {
    return this.parent;
  }

  private WeblogicBeanProperty beanProperty;

  public WeblogicBeanProperty getBeanProperty() {
    return this.beanProperty;
  }

  private PluginRestMapping referringPlugin;

  public PluginRestMapping getReferringPlugin() {
    return this.referringPlugin;
  }

  private PluginParameterRestMapping referringPluginParameter;

  public PluginParameterRestMapping getReferringPluginParameter() {
    return this.referringPluginParameter;
  }

  public void setReferringPluginParameter(PluginParameterRestMapping referringPluginParameter) {
    this.referringPluginParameter = referringPluginParameter;
  }

  public Class<?> getJavaClass() {
    if ("identity".equals(getBeanProperty().getRestName())) {
      // identities look like:
      //   a) null
      //   b) [ servers, server1, networkAccessPoints, channel1 ]
      return JsonArray.class;
    }
    String perspective =
      getParent()
        .getPageRestMapping()
        .getPageSource()
        .getPagePath()
        .getPagesPath()
        .getPerspectivePath()
        .getPerspective();
    if ("configuration".equals(perspective)) {
      // wrapped properties look like:
      //   listenPort: { value: 7001, set: true/false }
      //   listenPortEnabled: { value: true, set: true/false }
      //   listenAddress: { value: myhost, set: true/false }
      return JsonObject.class;
    } else {
      // unwrapped properties look like:
      // listenPort: 7001
      // listenPortEnabled: true
      // listenAddress: myhost
      return JsonValue.class;
    }
  }

  public PluginBeanPropertyRestMapping(
    PathSegmentRestMapping parent,
    WeblogicBeanProperty beanProperty,
    PluginRestMapping referringPlugin
  ) throws Exception {
    this.parent = parent;
    this.beanProperty = beanProperty;
    this.referringPlugin = referringPlugin;
    LOGGER.finest("new " + this);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("PluginBeanPropertyRestMapping(")
      .append("parent=")
      .append(getParent())
      .append(", prop=")
      .append(getBeanProperty().getRestName())
      .append(", ")
      .append(getReferringPlugin().getReferrer())
      .append(")");
    return sb.toString();
  }
}
