// Copyright (c) 2021, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for property lists.  The Properties object
 * is initialized via an InputStream immediately.
*/
public class PropertyListDataProviderImpl implements PropertyListDataProvider {
  public static final String TYPE_NAME = "PropertyList";
  private String name;
  private String pageDescription;
  private String resourceData;
  private Properties properties;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;
  private String fileName;

  public PropertyListDataProviderImpl() {
    makeRoots();
  }

  @Override
  public String getLastRootUsed() {
    return Root.PROPERTY_LIST_CONFIGURATION_NAME;
  }

  public PropertyListDataProviderImpl(String name, String fileName) {
    this.name = name;
    this.fileName = fileName;
    makeRoots();

    // Compute the properties resource data location
    resourceData = "/" + UriUtils.API_URI + "/" + UrlUtils.urlEncode(name) + "/propertyList/data/Properties";
    pageDescription = "/" + UriUtils.API_URI + "/" + UrlUtils.urlEncode(name) + "/propertyList/pages/Properties";
  }

  private void makeRoots() {
    editRoot = new Root(
      this,
      Root.PROPERTY_LIST_CONFIGURATION_NAME,
      Root.CONFIGURATION_ROOT,
      Root.PROPERTY_LIST_CONFIGURATION_LABEL,
      LocalizedConstants.PROPERTY_LIST_CONFIGURATION_DESCRIPTION,
      false, // editable
      Root.NAV_TREE_RESOURCE
    );
    roots.put(Root.PROPERTY_LIST_CONFIGURATION_NAME, editRoot);
  }

  @Override
  public String getPageDescription() {
    return pageDescription;
  }

  public static void save(
    InvocationContext ic,
    Properties properties,
    String fileName,
    String name
  ) {
    try (FileOutputStream fos = new FileOutputStream(fileName)) {
      properties.store(fos, name);
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
         e.getMessage()).build());
    }
  }

  @Override
  public void save(InvocationContext ic) {
    save(ic, properties, fileName, getName());
  }

  @Override
  public String getResourceData() {
    return resourceData;
  }

  @Override
  public Properties getProperties() {
    return properties;
  }

  @Override
  public void parse(InputStream is, InvocationContext ic) {
    try {
      properties = new Properties();
      properties.load(is);
    } catch (Exception e) {
      properties = null;
      Throwable walk = e;
      for ( ; ; ) {
        if (walk.getCause() == null) {
          break;
        }
        walk = walk.getCause();
      }
      String message = walk.getMessage();
      if (message == null) {
        message = walk.getClass().getName();
      }
      throw new FailedRequestException(message);
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
  public boolean start(InvocationContext ic) {
    if (properties == null) {
      try (FileInputStream fis = new FileInputStream(fileName)) {
        parse(fis, ic);
      } catch (Exception e) {
        throw new WebApplicationException(Response.status(
          Status.BAD_REQUEST.getStatusCode(),
           e.getMessage()).build());
      }
    }
    ic.setProvider(this);
    ic.setPageRepoByName(Root.EDIT_NAME);
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
    ret.add("providerType", getType());
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Root root : getRoots().values()) {
      builder.add(root.toJSON(ic));
    }
    ret.add("lastRootUsed", getLastRootUsed());
    ret.add("roots", builder);
    ret.add("mode", "standalone");
    return ret.build();
  }

  @Override
  public boolean isValidPath(String path) {
    return true;
  }

  @Override
  public void updateStatus(InvocationContext ic) {
  }

  @Override
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic) {
    LinkedHashMap<String, String> ret = new LinkedHashMap<>();
    return ret;
  }
}
