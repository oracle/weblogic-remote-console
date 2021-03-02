// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.driver.WeblogicObjectQueryBuilder;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NAME;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_PLAN;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_PLAN_PATH;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE_PATH;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_TARGETS;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_UPLOAD_FILES;

/**
 * Customize the initial property values in the AppDeploymentMBean create form RDJ
 */
public class AppDeploymentMBeanCreateFormPropertiesCustomizer extends BaseCreateFormPropertiesCustomizer {

  private static final String WEBLOGIC_PROPERTY_SERVERS = "servers";
  private static final String WEBLOGIC_PROPERTY_CLUSTERS = "clusters";

  private static final Logger LOGGER =
    Logger.getLogger(AppDeploymentMBeanCreateFormPropertiesCustomizer.class.getName());

  /*package*/ AppDeploymentMBeanCreateFormPropertiesCustomizer(
    WeblogicPageSource pageSource,
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration
  ) {
    super(pageSource, invocationContext, weblogicConfiguration);
  }

  // Create the WLS REST query for finding all of the WLS references
  // we need to compute the reference properties' options
  @Override
  protected JsonObject createGetReferencesQuery() {
    // Start at the domain
    WeblogicObjectQueryBuilder domainBldr = new WeblogicObjectQueryBuilder();

    // Get all the servers and clusters identities
    // so we can compute the Targets property's options
    domainBldr.getOrCreateChild(WEBLOGIC_PROPERTY_SERVERS).addField("identity");
    domainBldr.getOrCreateChild(WEBLOGIC_PROPERTY_CLUSTERS).addField("identity");

    JsonObject query = domainBldr.getBuilder().build();
    return query;
  }

  // Compute all of the initial property values to return in the RDJ
  @Override
  protected void computeInitialPropertyValues() throws Exception {
    JsonObjectBuilder properties = getInitialPropertyValues();

    JsonObject nullValue = ExpandedValue.fromValue(JsonValue.NULL).set(false).getJson();
    properties.add(CREATE_FORM_PROPERTY_NAME, nullValue);
    properties.add(CREATE_FORM_PROPERTY_SOURCE_PATH, nullValue);
    properties.add(CREATE_FORM_PROPERTY_PLAN_PATH, nullValue);
    properties.add(CREATE_FORM_PROPERTY_SOURCE, nullValue);
    properties.add(CREATE_FORM_PROPERTY_PLAN, nullValue);

    properties.add(
      CREATE_FORM_PROPERTY_UPLOAD_FILES,
      ExpandedValue.fromBoolean(false).set(false).getJson()
    );

    properties.add(
      CREATE_FORM_PROPERTY_TARGETS,
      addOptions(
        ExpandedValue
          .fromReferences(Json.createArrayBuilder().build())
          .set(false)
          .getJson(),
        getTargetsOptions()
      )
    );
  }

  // Get the RDJ identities of all the servers and clusters,
  // i.e. of the available targets the user can choose from
  protected JsonArray getTargetsOptions() throws Exception {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    getRDJIdentities(bldr, WEBLOGIC_PROPERTY_SERVERS);
    getRDJIdentities(bldr, WEBLOGIC_PROPERTY_CLUSTERS);
    return bldr.build();
  }
}
