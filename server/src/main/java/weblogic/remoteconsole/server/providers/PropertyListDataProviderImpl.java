// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for property lists.  The Properties object
 * is initialized via an InputStream immediately.
*/
public class PropertyListDataProviderImpl implements PropertyListDataProvider {
  // public static final String TYPE_NAME = "PropertyList";
  public static final String TYPE_NAME = "WDTModel";
  private String name;
  private String lastMessage = null;
  private Properties properties = new Properties();
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;

  public PropertyListDataProviderImpl(String name) {
    this.name = name;
    String encodedName = StringUtils.urlEncode(name);
    editRoot = new Root(
      // Root.PROPERTY_LIST_CONFIGURATION_NAME,
      // Root.CONFIGURATION_ROOT,
      // Root.PROPERTY_LIST_CONFIGURATION_LABEL,
      /* Frontend can't tolerate other names right now */
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      "/" + UriUtils.API_URI + "/" + encodedName + "/" + Root.PROPERTY_LIST_CONFIGURATION_NAME + "/navtree",
      null, // no change manager
      "/" + UriUtils.API_URI + "/" + encodedName + "/" + Root.PROPERTY_LIST_CONFIGURATION_NAME + "/download",
      false // it is not read only
    );
    roots.put("Property List", editRoot);
  }

  public Properties getProperties() {
    return properties;
  }

  public void parse(InputStream is, InvocationContext ic) {
    try {
      Object parsedJSON = new Yaml().load(is);
      if (!(parsedJSON instanceof Map)) {
        throw new FailedRequestException("Not a property list");
      }
      Map<String, Object> map = (Map<String, Object>) parsedJSON;
      if (!map.containsKey("contents")) {
        throw new FailedRequestException("Not a property list");
      }
      properties.load(new StringReader(map.get("contents").toString()));
    } catch (Exception e) {
      Throwable walk = e;
      for ( ; ; ) {
        if (walk.getCause() == null) {
          break;
        }
        walk = walk.getCause();
      }
      lastMessage = walk.getMessage();
      if (lastMessage == null) {
        System.err.println("The exception " + walk + "(" + walk.getClass() + ") has no message");
      }
      throw new FailedRequestException(toJSON(ic));
    }
  }

  @Override
  public String getType() {
    return TYPE_NAME;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void terminate() {
  }

  @Override
  public void test(InvocationContext ic) {
    start(ic);
  }

  @Override
  public boolean start(InvocationContext ic) {
    ic.setProvider(this);
    if (editRoot.getPageRepo() == null) {
      lastMessage = null;
    }
    return true;
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", getName());
    ret.add(ProviderResource.PROVIDER_TYPE, getType());
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Root root : getRoots().values()) {
      builder.add(root.toJSON(ic));
    }
    ret.add("roots", builder);
    ret.add("mode", "standalone");
    if (lastMessage != null) {
      ret.add("messages", createMessages(lastMessage));
    }
    return ret.build();
  }

  @Override
  public boolean isValidPath(String path) {
    return true;
  }
}
