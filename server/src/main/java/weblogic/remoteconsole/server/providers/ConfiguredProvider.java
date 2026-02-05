// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Collection;
import java.util.Collections;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.server.repo.InvocationContext;

public class ConfiguredProvider {
  private boolean shouldBePersisted;
  private String name;
  private JsonObject json;
  private TypedResource typedResource;
  private Provider provider;

  public ConfiguredProvider(String name, JsonObject json) {
    if (name.contains("/")) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "A provider name may not contain a \"/\""
      ).build());
    }
    this.name = name;
    this.json = json;
    String type = json.getString("type");
    if (type.equals("adminserver")) {
      typedResource = new AdminServerResource(this);
    } else if (type.equals("model")) {
      typedResource = new WDTResource(this);
    } else if (type.equals("properties")) {
      typedResource = new PropertyListResource(this);
    } else if (type.equals("composite")) {
      typedResource = new WDTCompositeResource(this);
    } else {
      throw new AssertionError(
        "The provider " + name + " has a type I don't recognize " + type);
    }
  }

  public Collection<Root> getRoots() {
    if (provider == null) {
      return Collections.emptyList();
    }
    return provider.getRoots().values();
  }

  public void updateLastUsed() {
    JsonObjectBuilder update = Json.createObjectBuilder(json);
    update.add("lastUsed", System.currentTimeMillis() / 1000);
    setJSON(update.build());
  }

  public long getLastUsed() {
    return json.containsKey("lastUsed")
      ? json.getJsonNumber("lastUsed").longValue()
      : 0;
  }

  public String getName() {
    return name;
  }

  public TypedResource getTypedResource() {
    return typedResource;
  }

  public String getDescription(InvocationContext ic) {
    return typedResource.getDescription(ic);
  }

  public JsonObject getJSON() {
    return json;
  }

  public void setJSON(JsonObject json) {
    this.json = json;
  }

  public void populateTableRowData(InvocationContext ic, JsonObjectBuilder builder) {
    typedResource.populateTableRowData(ic, builder);
  }

  public JsonObjectBuilder populateCreateFormData(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder) {
    return typedResource.populateCreateFormData(ic, operationType, builder);
  }

  public JsonObjectBuilder populateFormData(InvocationContext ic, JsonObjectBuilder builder) {
    return typedResource.populateFormData(ic, builder);
  }

  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic,
    String operationType,
    JsonObject payload,
    JsonObjectBuilder builder) {
    return typedResource.populateFromFormData(ic, operationType, payload, builder);
  }

  public void populateFormPDJ(InvocationContext ic, JsonObjectBuilder builder) {
    typedResource.populateFormPDJ(ic, builder);
  }

  public void start(InvocationContext ic) {
    if (provider == null) {
      provider = typedResource.start(ic);
    } else {
      provider.start(ic);
    }
  }

  public void terminate() {
    if (provider != null) {
      provider.terminate();
      provider = null;
    }
  }

  public Provider getLiveProvider() {
    return provider;
  }

  public boolean shouldBePersisted() {
    return shouldBePersisted;
  }
}
