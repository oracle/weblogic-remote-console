// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.server.repo.InvocationContext;

public interface TypedResource {
  // The description of this resource.  If it is active, the description says
  // so.
  public String getDescription(InvocationContext ic);

  // We are populating the provider table PDJ and this type of provider will
  // add special columns that only apply to this specific type
  public JsonArrayBuilder addSpecialTableProperties(
    InvocationContext ic, JsonArrayBuilder builder);

  // We are populating the provider table and this type of provider will
  // fill in this instance's row
  public JsonObjectBuilder populateTableRowData(
    InvocationContext ic, JsonObjectBuilder builder);

  // Since this is a create form, there is no current instance of the provider.
  // This is filling in defaults that are applicable to this *type* of provider.
  public JsonObjectBuilder populateCreateFormData(
    InvocationContext ic, String type, JsonObjectBuilder builder);

  // We are populating the provider form and this type of provider will
  // fill in this instance
  public JsonObjectBuilder populateFormData(
    InvocationContext ic, JsonObjectBuilder builder);

  // Since this is a create form, there is no current instance of the provider.
  // This is filling in the page description for creating the specific type.
  public JsonObjectBuilder populateCreateFormPDJ(
    InvocationContext ic,
    String type,
    JsonObjectBuilder builder
  );

  // We are extracting the form data from the user's filling in of an edit
  // form or a create form.
  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic, String operationType, JsonObject payload, JsonObjectBuilder builder);

  // We are editing the provider.  The PDJ has no need for information about
  // the provider, except its type.
  public JsonObjectBuilder populateFormPDJ(
    InvocationContext ic, JsonObjectBuilder builder);

  // Starts the current configured provider.  If the provider is presently
  // started, this will tell the live provider to make sure that the endpoint
  // is started.  If it is not started, then we need to create the live provider
  // in the first place and then start it.
  public Provider start(InvocationContext ic);

  public default String getHomeResourceDataLocation() {
    return "/api/-current-/group/edit";
  }
}
