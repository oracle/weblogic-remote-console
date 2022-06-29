// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.providers.PropertyListDataProvider;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Top level JAXRS resource for a page repo of a provider.
 */
public class PropertyListPageRepoResource extends BaseResource {
  // private static final Logger LOGGER = Logger.getLogger(PropertyListPageRepoResource.class.getName());

  // The text for labels and help used with a response
  public static final LocalizableString PROPERTY_LIST_CONFIGURATION_LABEL =
    LocalizedConstants.PROPERTY_LIST_CONFIGURATION_LABEL;
  public static final LocalizableString PROPERTY_LIST_PROPERTIES =
    LocalizedConstants.PROPERTY_LIST_PROPERTIES;
  public static final LocalizableString PROPERTY_LIST_HELP_TEXT =
    LocalizedConstants.PROPERTY_LIST_HELP_TEXT;

  // Get the JAXRS resource for a bean, or collection of beans, in the page repo.
  @GET
  @Path("data/{pathSegments: .+}")
  public Response getDataResource() {
    PropertyListDataProvider provider = (PropertyListDataProvider) getInvocationContext().getProvider();

    JsonObjectBuilder entity = Json.createObjectBuilder();
    JsonArrayBuilder empty = Json.createArrayBuilder();
    String labelProperties = getInvocationContext().getLocalizer().localizeString(PROPERTY_LIST_PROPERTIES);
    entity.add("breadCrumbs", empty);
    entity.add("links", empty);
    entity.add("pageDescription", provider.getPageDescription());
    entity.add("navigation", "Properties");
    JsonObjectBuilder self = Json.createObjectBuilder();
    self.add("label", labelProperties);
    self.add("resourceData", provider.getResourceData());
    entity.add("self", self.build());

    JsonObjectBuilder data = Json.createObjectBuilder();
    JsonObjectBuilder properties = Json.createObjectBuilder();
    properties.add("set", "true");
    JsonObjectBuilder value = Json.createObjectBuilder();
    Properties propertyList = provider.getProperties();
    for (String key : propertyList.stringPropertyNames()) {
      value.add(key, propertyList.getProperty(key));
    }
    properties.add("value", value.build());
    data.add("Properties", properties.build());
    entity.add("data", data.build());
    return Response.ok().entity(
      entity.build()).type(MediaType.APPLICATION_JSON).build();
  }

  @POST
  @Path("data/{pathSegments: .+}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response postDataResource(JsonObject requestBody) {
    PropertyListDataProvider provider = (PropertyListDataProvider) getInvocationContext().getProvider();
    Properties propertyList = provider.getProperties();

    // Check for update or replace action to support adding a new property as
    // the default behavior (i.e. replace) expects the complete set of properties
    JsonString jaction = requestBody.getJsonString("action");
    boolean updateProperties = ((jaction != null) && "update".equalsIgnoreCase(jaction.getString()));
    if (!updateProperties) {
      propertyList.clear();
    }
    for (Map.Entry<String, JsonValue> entry :
        requestBody.getJsonObject("data")
        .getJsonObject("Properties")
        .getJsonObject("value").entrySet()) {
      String value = entry.getValue().toString();
      value = value.substring(1, value.length() - 1);
      propertyList.put(entry.getKey(), value);
    }
    return Response.ok().entity(Json.createObjectBuilder().build()).build();
  }

  // Get the JAXRS resource that describes the pages in the page repo.
  @GET
  @Path("pages/{pathSegments: .+}")
  @Produces(MediaType.APPLICATION_JSON)
  public Object getPagesResource() {
    JsonObjectBuilder entity = Json.createObjectBuilder();
    JsonObjectBuilder sliceForm = Json.createObjectBuilder();
    JsonArrayBuilder properties = Json.createArrayBuilder();
    JsonObjectBuilder property = Json.createObjectBuilder();
    String labelPropertyList = getInvocationContext().getLocalizer().localizeString(PROPERTY_LIST_CONFIGURATION_LABEL);
    String helpText = "<p>" + getInvocationContext().getLocalizer().localizeString(PROPERTY_LIST_HELP_TEXT) + "</p>";
    property.add("name", "Properties");
    property.add("label", labelPropertyList);
    property.add("helpSummaryHTML", helpText);
    property.add("detailedHelpHTML", helpText);
    property.add("type", "properties");
    properties.add(property.build());
    sliceForm.add("properties", properties.build());
    entity.add("sliceForm", sliceForm.build());
    return Response.ok().entity(
      entity.build()).type(MediaType.APPLICATION_JSON).build();
  }

  // Get the JAXRS resource that returns the nav tree contents for the beans in the page repo.
  @POST
  @Path(Root.NAV_TREE_RESOURCE)
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response getNavTree(JsonObject requestBody) {
    JsonObjectBuilder entity = Json.createObjectBuilder();
    JsonArrayBuilder contents = Json.createArrayBuilder();

    JsonObjectBuilder collectionChild = Json.createObjectBuilder();
    String labelProperties = getInvocationContext().getLocalizer().localizeString(PROPERTY_LIST_PROPERTIES);
    collectionChild.add("expandable", false);
    collectionChild.add("label", labelProperties);
    collectionChild.add("name", "Properties");
    collectionChild.add("type", "collectionChild");

    JsonObjectBuilder rdj = Json.createObjectBuilder();
    PropertyListDataProvider provider = (PropertyListDataProvider) getInvocationContext().getProvider();
    rdj.add("label", labelProperties);
    rdj.add("resourceData", provider.getResourceData());

    collectionChild.add("resourceData", rdj);
    contents.add(collectionChild.build());
    entity.add("contents", contents.build());
    return Response.ok().entity(
      entity.build()).type(MediaType.APPLICATION_JSON).build();
  }

  // Get the JAXRS resource for downloading the contents of the property list
  @Path(Root.DOWNLOAD_RESOURCE)
  @GET
  @Produces(MediaType.APPLICATION_OCTET_STREAM)
  public Object download() {
    StreamingOutput stream = new StreamingOutput() {
      @Override
      public void write(OutputStream os) throws IOException, FailedRequestException {
        // Uses the default platform encoding for chars to bytes...
        Writer writer = new BufferedWriter(new OutputStreamWriter(os));
        PropertyListDataProvider provider =
          (PropertyListDataProvider) getInvocationContext().getProvider();
        provider.getProperties().store(writer, null);
      }
    };
    return Response.ok(stream).build();
  }
}
