// Copyright (c) 2021, Oracle and/or its affiliates.
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
import javax.json.JsonValue;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.providers.PropertyListDataProviderImpl;

/**
 * Top level JAXRS resource for a page repo of a provider.
 */
public class PropertyListPageRepoResource extends BaseResource {
  // private static final Logger LOGGER = Logger.getLogger(PropertyListPageRepoResource.class.getName());

  // Get the JAXRS resource for a bean, or collection of beans, in the page repo.
  @GET
  @Path("data/{pathSegments: .+}")
  public Response getDataResource() {
    JsonObjectBuilder entity = Json.createObjectBuilder();
    JsonArrayBuilder empty = Json.createArrayBuilder();
    String encodedName =
      StringUtils.urlEncode(getInvocationContext().getProvider().getName());
    entity.add("breadCrumbs", empty);
    entity.add("links", empty);
    entity.add("pageDescription", "/api/"
      + encodedName
      + "/propertyList/pages/properties"
    );
    entity.add("navigation", "PropertyList");
    JsonObjectBuilder self = Json.createObjectBuilder();
    self.add("label", "Property List");
    self.add("name", "PropertyList");
    entity.add("self", self.build());

    JsonObjectBuilder data = Json.createObjectBuilder();
    JsonObjectBuilder properties = Json.createObjectBuilder();
    properties.add("set", "true");
    JsonObjectBuilder value = Json.createObjectBuilder();
    Properties propertyList =
      ((PropertyListDataProviderImpl) getInvocationContext().getProvider()).getProperties();
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
    Properties propertyList =
      ((PropertyListDataProviderImpl) getInvocationContext().getProvider()).getProperties();
    propertyList.clear();
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
    property.add("name", "Properties");
    property.add("label", "Properties");
    property.add("type", "properties");
    properties.add(property.build());
    sliceForm.add("properties", properties.build());
    entity.add("sliceForm", sliceForm.build());
    return Response.ok().entity(
      entity.build()).type(MediaType.APPLICATION_JSON).build();
  }

  // Get the JAXRS resource that returns the nav tree contents for the beans in the page repo.
  @POST
  @Path("navtree")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response getNavTree(JsonObject requestBody) {
    JsonObjectBuilder entity = Json.createObjectBuilder();
    JsonArrayBuilder contents = Json.createArrayBuilder();

    JsonObjectBuilder collectionChild = Json.createObjectBuilder();
    collectionChild.add("expandable", "false");
    collectionChild.add("label", "Properties");
    collectionChild.add("name", "Properties");
    collectionChild.add("type", "collectionChild");

    JsonObjectBuilder rdj = Json.createObjectBuilder();
    rdj.add("label", "Properties");
    rdj.add("resourceData",
      "/api/"
      + getInvocationContext().getProvider().getName()
      + "/propertyList/data/properties"
    );

    collectionChild.add("resourceData", rdj);
    contents.add(collectionChild.build());
    entity.add("contents", contents.build());
    return Response.ok().entity(
      entity.build()).type(MediaType.APPLICATION_JSON).build();
  }

  // Get the JAXRS resource for downloading the contents of the property list
  @Path("download")
  @GET
  @Produces(MediaType.APPLICATION_OCTET_STREAM)
  public Object download() {
    StreamingOutput stream = new StreamingOutput() {
      @Override
      public void write(OutputStream os) throws IOException, FailedRequestException {
        // Uses the default platform encoding for chars to bytes...
        Writer writer = new BufferedWriter(new OutputStreamWriter(os));
        PropertyListDataProviderImpl provider =
          (PropertyListDataProviderImpl) getInvocationContext().getProvider();
        provider.getProperties().store(writer, null);
      }
    };
    return Response.ok(stream).build();
  }
}
