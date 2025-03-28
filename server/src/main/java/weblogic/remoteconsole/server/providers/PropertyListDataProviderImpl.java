// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for property lists.  The Properties object
 * is initialized via an InputStream immediately.
*/
public class PropertyListDataProviderImpl implements PropertyListDataProvider {
  public static final String TYPE_NAME = "PropertyList";
  private String name;
  private String label;
  private String pageDescription;
  private String resourceData;
  private String lastMessage = null;
  private Properties properties = new Properties();
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;

  public PropertyListDataProviderImpl(String name, String label) {
    this.name = name;
    this.label = label;
    editRoot = new Root(
      this,
      Root.PROPERTY_LIST_CONFIGURATION_NAME,
      Root.CONFIGURATION_ROOT,
      Root.PROPERTY_LIST_CONFIGURATION_LABEL,
      false, // editable
      Root.NAV_TREE_RESOURCE,
      Root.DOWNLOAD_RESOURCE
    );
    roots.put(Root.PROPERTY_LIST_CONFIGURATION_NAME, editRoot);

    // Compute the properties resource data location
    resourceData = "/" + UriUtils.API_URI + "/" + UrlUtils.urlEncode(name) + "/propertyList/data/Properties";
    pageDescription = "/" + UriUtils.API_URI + "/" + UrlUtils.urlEncode(name) + "/propertyList/pages/Properties";
  }

  @Override
  public String getPageDescription() {
    return pageDescription;
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
      properties.load(is);
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

  private static JsonObject makeHelpClause(
    InvocationContext ic,
    LocalizableString summary,
    LocalizableString detail
  ) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("helpSummaryHTML", ic.getLocalizer().localizeString(summary));
    ret.add("helpDetailHTML", ic.getLocalizer().localizeString(detail));
    return ret.build();
  }

  public static JsonObject getHelp(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name",
      makeHelpClause(
        ic,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL
    ));
    ret.add("file",
      makeHelpClause(
        ic,
        LocalizedConstants.PROPERTY_LIST_PROVIDER_HELP_FILE_SUMMARY,
        LocalizedConstants.PROPERTY_LIST_PROVIDER_HELP_FILE_DETAIL
    ));
    return ret.build();
  }

  @Override
  public String getLabel() {
    return label;
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
    if ((getLabel() != null) && !getName().equals(getLabel())) {
      ret.add("label", getLabel());
    }
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
