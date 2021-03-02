// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.driver.IdentityUtils;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

/**
 * Utilities to customize the initial property values in a create form RDJ
 */
public class BaseCreateFormPropertiesCustomizer {

  private static final Logger LOGGER =
    Logger.getLogger(BaseCreateFormPropertiesCustomizer.class.getName());

  // The corresponding PDY
  private WeblogicPageSource pageSource;

  protected WeblogicPageSource getPageSource() {
    return this.pageSource;
  }

  // The invocation context
  // (its identity is the identity of the bean that will parent the new bean (e.g. the domain mbean)
  private InvocationContext invocationContext;

  protected InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  // The weblogic configuration (i.e. the object that reads from and writes to WLS)
  private WeblogicConfiguration weblogicConfiguration;

  protected WeblogicConfiguration getWeblogicConfiguration() {
    return this.weblogicConfiguration;
  }

  // Collects the initial property values to return
  private JsonObjectBuilder initialPropertyValues = Json.createObjectBuilder();

  protected JsonObjectBuilder getInitialPropertyValues() {
    return this.initialPropertyValues;
  }

  // The weblogic references we'll use to compute the options for the RDJ reference properties
  private JsonObject weblogicReferences;

  protected JsonObject getWeblogicReferences() {
    return this.weblogicReferences;
  }

  private void setWeblogicReferences(JsonObject weblogicReferences) {
    this.weblogicReferences = weblogicReferences;
  }

  /*package*/ BaseCreateFormPropertiesCustomizer(
    WeblogicPageSource pageSource,
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration
  ) {
    this.pageSource = pageSource;
    this.invocationContext = invocationContext;
    this.weblogicConfiguration = weblogicConfiguration;
  }

  /**
   * Customize the initial property values in the create form RDJ
   */
  /*package*/ JsonObject customize() throws Exception {
    // Get all the references we need from WLS to create the options for the reference properties
    populateWeblogicReferences();

    // Compute all of the initial property values to return in the RDJ
    computeInitialPropertyValues();
    return getInitialPropertyValues().build();
  }

  // Get all the references we need from WLS to create the options for the reference properties
  protected void populateWeblogicReferences() throws Exception {
    JsonObject query = createGetReferencesQuery();
    if (query != null) {
      setWeblogicReferences(
        getWeblogicConfiguration().getBeanTreeSlice(
          getInvocationContext(),
          createGetReferencesQuery()
        )
      );
    }
  }

  // Create the WLS REST query for finding all of the WLS references
  // we need to compute the reference properties' options
  protected JsonObject createGetReferencesQuery() {
    return null;
  }

  // Compute all of the initial property values to return in the RDJ
  protected void computeInitialPropertyValues() throws Exception {
  }

  protected JsonObject addOptions(JsonObject expandedPropertyValue, JsonArray options) throws Exception {
    // don't add a None option since our reference properties are arrays
    // and if you don't want any references, you just specify an empty array.
    boolean addNone = false;
    return
      Json
        .createObjectBuilder(expandedPropertyValue)
        .add(
          "options",
          IdentityUtils.sortRDJReferences(
            options,
            addNone
          )
        )
        .build();
  }

  protected void getRDJIdentities(JsonArrayBuilder bldr, String collection) throws Exception {
    JsonArray weblogicReferences = getWeblogicReferences().getJsonObject(collection).getJsonArray("items");
    JsonArray rdjIdentities =
      IdentityUtils.getRDJIdentitiesFromWeblogicIdentities(
        weblogicReferences,
        getPageSource().getPagePath().getPagesPath().getPerspectivePath(),
        getInvocationContext().getLocalizer()
      );
    bldr.addAll(Json.createArrayBuilder(rdjIdentities));
  }
}
