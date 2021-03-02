// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.driver.WeblogicObjectQueryBuilder;

/** Custom code for processing the SAFErrorHandlingBean */
public abstract class SAFErrorHandlingBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(SAFErrorHandlingBeanCustomizer.class.getName());

  private static final String JMS_SYSTEM_RESOURCES = "JMSSystemResources";
  private static final String JMS_RESOURCE = "JMSResource";
  private static final String SAF_IMPORTED_DESTINATIONS = "SAFImportedDestinations";
  private static final String SAF_QUEUES = "SAFQueues";
  private static final String SAF_TOPICS = "SAFTopics";

  // TBD - put this in some common constants class?
  private static final String IDENTITY = "identity";

  // Get the options for a SAFErrorHandlingBean's ErrorDestination property.
  // The list includes every SAFQueue and SAFTopic of every SAFImportedDesinitation
  // in this SAFErrorHandleBean's JMSSystemResource.
  public static JsonObject getErrorDestinationOptions(
    WeblogicConfiguration weblogicConfiguration,
    InvocationContext invocationContext
  ) throws Exception {
    JsonObject query = getErrorDestinationOptionsQuery(invocationContext);
    LOGGER.finest("getErrorDestinationOptions query=" + query);
    JsonObject slice = weblogicConfiguration.getBeanTreeSlice(invocationContext, query);
    LOGGER.finest("getErrorDestinationOptions slice=" + slice);
    JsonArray options = getErrorDestinationOptionsFromSlice(invocationContext, slice);
    LOGGER.finest("getErrorDestinationOptions options=" + options);
    return ExpandedValue.fromValue(options).set(true).getJson();
  }

  // Construct the query for getting all the SAFQueues and SAFTopics for all the
  // SAFImportedDestination's in this SAFErrorHandlingBean's JMSSystemResource.
  private static JsonObject getErrorDestinationOptionsQuery(InvocationContext invocationContext) {
    // Start at the domain
    WeblogicObjectQueryBuilder domainBldr = new WeblogicObjectQueryBuilder();

    // Get this identity's JMSSystemResource
    WeblogicObjectQueryBuilder jmsSystemResourceBldr =
      domainBldr.getOrCreateChild(JMS_SYSTEM_RESOURCES);
    String jmsSystemResourceName = invocationContext.getIdentity().getIdentities().get(0);
    jmsSystemResourceBldr.setKey("name", jmsSystemResourceName);

    // Get this JMSSystemResource's JMSResource
    WeblogicObjectQueryBuilder jmsResourceBldr =
      jmsSystemResourceBldr.getOrCreateChild(JMS_RESOURCE);

    // Get this JMSResource's SAFImportedDestinations
    WeblogicObjectQueryBuilder safImportedDestinationsBldr =
      jmsResourceBldr.getOrCreateChild(SAF_IMPORTED_DESTINATIONS);

    // Get each SAFImportedDestination's SAFQueues and SAFTopics (including identity)
    WeblogicObjectQueryBuilder safQueuesBldr =
      safImportedDestinationsBldr.getOrCreateChild(SAF_QUEUES);
    safQueuesBldr.addField(IDENTITY);

    WeblogicObjectQueryBuilder safTopicsBldr =
      safImportedDestinationsBldr.getOrCreateChild(SAF_TOPICS);
    safTopicsBldr.addField(IDENTITY);

    return domainBldr.getBuilder().build();
  }

  // Create the list of options for this SAFErrorHandleBean's ErrorDestination properties.
  // Find all the SAFQueues and SAFTopics from the from the WLS REST query
  // and return their identities.
  private static JsonArray getErrorDestinationOptionsFromSlice(
    InvocationContext invocationContext,
    JsonObject slice
  ) throws Exception {
    JsonArrayBuilder bldr = Json.createArrayBuilder();

    // Starts at the domain
    JsonObject domain = slice;

    // Get the JMSSystemResource for this identity
    JsonArray jmsSystemResources =
      CollectionValue.getItems(domain.getJsonObject(JMS_SYSTEM_RESOURCES));
    if (jmsSystemResources.isEmpty()) {
      // This JMSSystemResource has been deleted.
      throw
        new NoDataFoundException(
          invocationContext.getIdentity().getFoldedBeanPathWithIdentities().getRelativeUri()
          + " not found"
        );
    }
    if (jmsSystemResources.size() > 1) {
      throw
        new AssertionError(
          "Found multiple JMSSystemResources even though asked for one : "
          + slice
        );
    }
    JsonObject jmsSystemResource = jmsSystemResources.getJsonObject(0);

    // Get the SAFImportedDestinations
    JsonObject jmsResource = jmsSystemResource.getJsonObject(JMS_RESOURCE);
    JsonArray safImportedDestinations =
      CollectionValue.getItems(jmsResource.getJsonObject(SAF_IMPORTED_DESTINATIONS));

    // Loop over the SAFImportedDestinations
    for (int i = 0; i < safImportedDestinations.size(); i++) {
      JsonObject safImportedDestination = safImportedDestinations.getJsonObject(i);

      // Add all its SAFQueues to the list of options
      JsonArray safQueues =
        CollectionValue.getItems(safImportedDestination.getJsonObject(SAF_QUEUES));
      for (int j = 0; j < safQueues.size(); j++) {
        bldr.add(safQueues.getJsonObject(j));
      }

      // Add all its SAFTopics to the list of options
      JsonArray safTopics =
        CollectionValue.getItems(safImportedDestination.getJsonObject(SAF_TOPICS));
      for (int j = 0; j < safTopics.size(); j++) {
        bldr.add(safTopics.getJsonObject(j));
      }
    }
    return bldr.build();
  }
}
