// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import java.io.InputStream;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.file.StreamDataBodyPart;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.IdentityUtils;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/** Does the real work behind the JAXRS resources for the app and libray configuration pages. */
public class DeploymentManager extends ConfigurationTreeManager {

  private static final Logger LOGGER = Logger.getLogger(DeploymentManager.class.getName());

  private static final String RDJ_PROPERTY_NAME = "Name";
  private static final String RDJ_PROPERTY_TARGETS = "Targets";
  private static final String RDJ_PROPERTY_SOURCE_PATH = "SourcePath";
  private static final String RDJ_PROPERTY_PLAN_PATH = "PlanPath";

  private static final String WEBLOGIC_PROPERTY_NAME = StringUtils.getRestName(RDJ_PROPERTY_NAME);
  private static final String WEBLOGIC_PROPERTY_TARGETS = StringUtils.getRestName(RDJ_PROPERTY_TARGETS);
  private static final String WEBLOGIC_PROPERTY_SOURCE_PATH = StringUtils.getRestName(RDJ_PROPERTY_SOURCE_PATH);
  private static final String WEBLOGIC_PROPERTY_PLAN_PATH = StringUtils.getRestName(RDJ_PROPERTY_PLAN_PATH);

  /** Constructor */
  private DeploymentManager(InvocationContext invocationContext) {
    super(invocationContext);
  }

  // deploy an app on the admin server's file system
  public static Response deployApplication(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).deployApplication(
        weblogicConfigurationVersion,
        requestBody
      );
  }

  private Response deployApplication(
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    try {

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      JsonObject data = requestBody.getJsonObject("data");
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "deployApplication"
        + " invocationContext=" + StringUtils.cleanStringForLogging(getInvocationContext())
        + " wlsCfgVer=" + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
        + " data=" + StringUtils.cleanStringForLogging(data)
      );

      // Note: unwrap the expanded values since the multipart form app deployment
      // WLS REST api doesn't support expanded values
      JsonObjectBuilder modelBldr =
        Json.createObjectBuilder()
          .add(WEBLOGIC_PROPERTY_NAME, data.getJsonObject(RDJ_PROPERTY_NAME)) // required
          .add(WEBLOGIC_PROPERTY_SOURCE_PATH,  data.getJsonObject(RDJ_PROPERTY_SOURCE_PATH)); // required
      JsonObject targets = getTargetsWeblogicIdentities(data); // optional
      if (targets != null) {
        modelBldr.add(WEBLOGIC_PROPERTY_TARGETS, targets);
      }
      // If PlanPath is in the request body, and it has a value, and
      // the value is a non-empty string, then pass it along to the WLS REST api.
      // Note - if we were to pass an empty plan path to the WLS REST api, it would
      // complain that the path doesn't exist.
      JsonObject planPath = data.getJsonObject(RDJ_PROPERTY_PLAN_PATH); // optional
      if (planPath != null) {
        ExpandedValue expandedPlanPath = ExpandedValue.wrap(planPath);
        if (expandedPlanPath.hasValue()) {
          String path = expandedPlanPath.getStringValue();
          if (StringUtils.notEmpty(path)) {
            modelBldr.add(WEBLOGIC_PROPERTY_PLAN_PATH, planPath);
          }
        }
      }

      // Don't start the config transaction until after we've validated everything we can
      startEdit();

      // Deploy the application
      // Note: The WLS REST deployment api never sends back field-scoped
      // messages, therefore we don't need to worry about converting
      // WLS field names to RDJ field names.
      JsonArray messages =
        getWeblogicConfiguration()
          .createBean(
            getInvocationContext(),
            new Path("appDeployments"),
            modelBldr.build(),
            true // async
          );

      saveChanges();

      return createdBeanResponse(newCreateFormPagePath(), requestBody, messages);

    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  // upload and deploy an app
  public static Response uploadAndDeployApplication(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    String dataAsString,
    InputStream sourceInputStream,
    FormDataContentDisposition sourcePathDisposition,
    InputStream planInputStream,
    FormDataContentDisposition planPathDisposition
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).uploadAndDeployApplication(
        weblogicConfigurationVersion,
        dataAsString,
        sourceInputStream,
        sourcePathDisposition,
        planInputStream,
        planPathDisposition
      );
  }

  private Response uploadAndDeployApplication(
    String weblogicConfigurationVersion,
    String dataAsString,
    InputStream sourceInputStream,
    FormDataContentDisposition sourcePathDisposition,
    InputStream planInputStream,
    FormDataContentDisposition planPathDisposition
  ) throws Exception {
    try {

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      String sourcePath = getFileName(sourcePathDisposition); // required
      String planPath = getFileName(planPathDisposition); // optional
      JsonObject data = stringToJsonObject(dataAsString); // required
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "uploadAndDeployApplication"
        + " invocationContext=" + StringUtils.cleanStringForLogging(getInvocationContext())
        + " wlsCfgVer=" + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
        + " data=" + StringUtils.cleanStringForLogging(data)
        + " sourcePath=" + StringUtils.cleanStringForLogging(sourcePath)
        + " planPath=" + StringUtils.cleanStringForLogging(planPath)
      );
      FormDataMultiPart parts = new FormDataMultiPart();

      // Note: unwrap the expanded values since the multipart form app deployment
      // WLS REST api doesn't support expanded values
      JsonObjectBuilder modelBldr =
        Json.createObjectBuilder()
          .add(WEBLOGIC_PROPERTY_NAME, ExpandedValue.getValue(data.getJsonObject(RDJ_PROPERTY_NAME))); // required
      JsonObject targets = getTargetsWeblogicIdentities(data); // optional
      if (targets != null) {
        modelBldr.add(WEBLOGIC_PROPERTY_TARGETS, ExpandedValue.getValue(targets));
      }
      parts.field("model", modelBldr.build().toString(), MediaType.APPLICATION_JSON_TYPE);

      parts.bodyPart(new StreamDataBodyPart(WEBLOGIC_PROPERTY_SOURCE_PATH, sourceInputStream, sourcePath));

      if (planInputStream != null) {
        parts.bodyPart(new StreamDataBodyPart(WEBLOGIC_PROPERTY_PLAN_PATH, planInputStream, planPath));
      }

      // Don't start the config transaction until after we've validated everything we can
      startEdit();

      // Upload and deploy the application
      // Note: The WLS REST deployment api never sends back field-scoped
      // messages, therefore we don't need to worry about converting
      // WLS field names to RDJ field names.
      JsonArray messages =
        getWeblogicConfiguration()
          .createBean(
            getInvocationContext(),
            new Path("appDeployments"),
            parts,
            true // async
          );

      saveChanges();

      // Wrap data so that it looks like a normal request body since that's the form createdBeanResponse needs
      JsonObject requestBody = Json.createObjectBuilder().add("data", data).build();
      return createdBeanResponse(newCreateFormPagePath(), requestBody, messages);

    } catch (Throwable t) {
      throw toServiceException(t);
    } finally {
      closeInputStream(sourceInputStream);
      closeInputStream(planInputStream);
    }
  }

  // undeploy an app
  public static Response undeployApplication(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).undeployApplication(
        weblogicConfigurationVersion
      );
  }

  private Response undeployApplication(String weblogicConfigurationVersion) throws Exception {
    return
      deleteBean(
        getInvocationContext(),
        weblogicConfigurationVersion,
        true // asynchronous
      );
  }

  // deploy a library on the admin server's file system
  public static Response deployLibrary(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).deployLibrary(
        weblogicConfigurationVersion,
        requestBody
      );
  }

  private Response deployLibrary(
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    try {

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      JsonObject data = requestBody.getJsonObject("data");
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "deployApplication"
        + " invocationContext=" + StringUtils.cleanStringForLogging(getInvocationContext())
        + " wlsCfgVer=" + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
        + " data=" + StringUtils.cleanStringForLogging(data)
      );

      // Note: unwrap the expanded values since the multipart form app deployment
      // WLS REST api doesn't support expanded values
      JsonObjectBuilder modelBldr =
        Json.createObjectBuilder()
          .add(WEBLOGIC_PROPERTY_NAME, data.getJsonObject(RDJ_PROPERTY_NAME)) // required
          .add(WEBLOGIC_PROPERTY_SOURCE_PATH,  data.getJsonObject(RDJ_PROPERTY_SOURCE_PATH)); // required
      JsonObject targets = getTargetsWeblogicIdentities(data); // optional
      if (targets != null) {
        modelBldr.add(WEBLOGIC_PROPERTY_TARGETS, targets);
      }

      // Don't start the config transaction until after we've validated everything we can
      startEdit();

      // Deploy the application
      // Note: The WLS REST deployment api never sends back field-scoped
      // messages, therefore we don't need to worry about converting
      // WLS field names to RDJ field names.
      JsonArray messages =
        getWeblogicConfiguration()
          .createBean(
            getInvocationContext(),
            new Path("libraries"),
            modelBldr.build(),
            true // async
          );

      saveChanges();

      return createdBeanResponse(newCreateFormPagePath(), requestBody, messages);

    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  // upload and deploy a library
  public static Response uploadAndDeployLibrary(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    String dataAsString,
    InputStream sourceInputStream,
    FormDataContentDisposition sourcePathDisposition
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).uploadAndDeployLibrary(
        weblogicConfigurationVersion,
        dataAsString,
        sourceInputStream,
        sourcePathDisposition
      );
  }

  private Response uploadAndDeployLibrary(
    String weblogicConfigurationVersion,
    String dataAsString,
    InputStream sourceInputStream,
    FormDataContentDisposition sourcePathDisposition
  ) throws Exception {
    try {

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      String sourcePath = getFileName(sourcePathDisposition); // required
      JsonObject data = stringToJsonObject(dataAsString); // required
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "uploadAndDeployLibrary"
        + " invocationContext=" + StringUtils.cleanStringForLogging(getInvocationContext())
        + " wlsCfgVer=" + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
        + " data=" + StringUtils.cleanStringForLogging(data)
        + " sourcePath=" + StringUtils.cleanStringForLogging(sourcePath)
      );
      FormDataMultiPart parts = new FormDataMultiPart();

      // Note: unwrap the expanded values since the multipart form library deployment
      // WLS REST api doesn't support expanded values
      JsonObjectBuilder modelBldr =
        Json.createObjectBuilder()
          .add(WEBLOGIC_PROPERTY_NAME, ExpandedValue.getValue(data.getJsonObject(RDJ_PROPERTY_NAME))); // required
      JsonObject targets = getTargetsWeblogicIdentities(data); // optional
      if (targets != null) {
        modelBldr.add(WEBLOGIC_PROPERTY_TARGETS, ExpandedValue.getValue(targets));
      }
      parts.field("model", modelBldr.build().toString(), MediaType.APPLICATION_JSON_TYPE);

      parts.bodyPart(new StreamDataBodyPart(WEBLOGIC_PROPERTY_SOURCE_PATH, sourceInputStream, sourcePath));

      // Don't start the config transaction until after we've validated everything we can
      startEdit();

      // Upload and deploy the application.
      // Note: The WLS REST deployment api never sends back field-scoped
      // messages, therefore we don't need to worry about converting
      // WLS field names to RDJ field names.
      JsonArray messages =
        getWeblogicConfiguration()
          .createBean(
            getInvocationContext(),
            new Path("libraries"),
            parts,
            true // async
          );

      saveChanges();

      // Wrap data so that it looks like a normal request body since that's the form createdBeanResponse needs
      JsonObject requestBody = Json.createObjectBuilder().add("data", data).build();
      return createdBeanResponse(newCreateFormPagePath(), requestBody, messages);

    } catch (Throwable t) {
      throw toServiceException(t);
    } finally {
      closeInputStream(sourceInputStream);
    }
  }

  // undeploy a library
  public static Response undeployLibrary(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion
  ) throws Exception {
    return
      (new DeploymentManager(invocationContext)).undeployApplication(
        weblogicConfigurationVersion
      );
  }

  private Response undeployLibrary(String weblogicConfigurationVersion) throws Exception {
    return
      deleteBean(
        getInvocationContext(),
        weblogicConfigurationVersion,
        true // asynchronous
      );
  }

  private JsonObject getTargetsWeblogicIdentities(JsonObject data) throws Exception {
    JsonObject targetsRDJIdentities = data.getJsonObject(RDJ_PROPERTY_TARGETS);
    if (targetsRDJIdentities != null) {
      return
        IdentityUtils.rdjIdentitiesToWeblogicIdentities(
          getInvocationContext().getWeblogicBeanTypes(),
          targetsRDJIdentities
        );
    } else {
      return null;
    }
  }

  private JsonObject stringToJsonObject(String jsonObjectAsString) throws Exception {
    JsonReader reader = Json.createReader(new StringReader(jsonObjectAsString));
    try {
      return reader.readObject();
    } finally {
      reader.close();
    }
  }

  private String getFileName(FormDataContentDisposition fileDisposition) {
    if (fileDisposition == null) {
      return null;
    } else {
      return fileDisposition.getFileName();
    }
  }

  private void closeInputStream(InputStream is) {
    if (is == null) {
      return;
    }
    try {
      is.close();
    } catch (Throwable t) {
      LOGGER.log(
        Level.INFO,
        "Unable to close input stream: " + t.toString(),
        t
      );
    }
  }
}
