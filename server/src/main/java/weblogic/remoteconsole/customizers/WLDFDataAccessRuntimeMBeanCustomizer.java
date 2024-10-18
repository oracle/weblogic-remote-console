// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestBeanRepo;
import weblogic.remoteconsole.server.utils.ResponseHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestClientException;
import weblogic.remoteconsole.server.utils.WebLogicRestClientHelper;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;


/**
 * Custom code for processing the WLDFDataAccessRuntimeMBean
 */
public class WLDFDataAccessRuntimeMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(WLDFDataAccessRuntimeMBeanCustomizer.class.getName());
  private static final int  RECORD_LIMIT = 400;
  private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");

  private WLDFDataAccessRuntimeMBeanCustomizer() {
  }

  /**
   * Customize to return the default directory for downloading log file.
   *
   */
  public static Response<Void> customizeDownloadLogsInputForm(InvocationContext ic, Page page) {
    return getResponseForInputForm(ic, page, false);
  }

  private static Response<Void> getResponseForInputForm(InvocationContext ic, Page page, boolean includeFileName) {
    Value logFileDirectoryValue = new StringValue(getDirectoryName(ic));
    Value logFileNameValue = new StringValue(getFileNameToDownload(ic));
    Response<Void> response = new Response<>();
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties = null;
    if (includeFileName) {
      newProperties = List.of(
          createFormProperty("LogFileDirectory", oldProperties, logFileDirectoryValue),
          createFormProperty("LogFileName", oldProperties, logFileNameValue)
      );
    } else {
      newProperties = List.of(
          createFormProperty("LogFileDirectory", oldProperties, logFileDirectoryValue)
      );
    }
    oldProperties.clear();
    oldProperties.addAll(newProperties);
    response.setSuccess(null);
    return response;
  }

  private static String getFileNameToDownload(InvocationContext ic) {
    String serverName = "";
    String logFile = "";
    if (ic.getIdentifiers() != null) {
      logFile = ic.getBeanTreePath().getLastSegment().getKey();
      serverName = ic.getIdentifiers().get(0);
    } else
      if (ic.getIdentities() != null) {
        serverName = ic.getIdentities().get(0).getPath().getComponents().get(2);
        logFile = ic.getIdentities().get(0).getPath().getLastComponent();
      } else {
        //for Table (unaggrated) multi downloads
        serverName = ic.getBeanTreePath().getPath().getComponents().get(2);
        logFile = ic.getBeanTreePath().getPath().getLastComponent();
      }
    // the logfile requested may have "/" or path separator char in it,
    // eg. JMSMessageLog/AdminJMSServer, we will replace that with "_".
    logFile = logFile.replace(File.separator, "_");
    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    return  serverName + "_" + logFile + "_" + simpleDateFormat.format(timestamp);
  }

  private static FormProperty createFormProperty(
      String propName,
      List<FormProperty> oldProperties,
      Value propValue
  ) {
    return
        new FormProperty(
            findRequiredFormProperty(propName, oldProperties).getFieldDef(),
            propValue
        );
  }

  private static FormProperty findRequiredFormProperty(String propertyName, List<FormProperty> formProperties) {
    FormProperty formProperty = findOptionalFormProperty(propertyName, formProperties);
    if (formProperty == null) {
      throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
    } else {
      return formProperty;
    }
  }

  private static FormProperty findOptionalFormProperty(String propertyName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propertyName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    return null;
  }

  /**
   * Customize the WLDFDataAccessRuntimeMBean for downloading log files with specified location
   * and format.
   */
  public static Response<Value> downloadLogs(
      InvocationContext ic, PageActionDef pageActionDef, List<FormProperty> formProperties
  ) {
    //for downloading multiple logs, user doesn't specify filename. We need to general it.
    String logFileName = getFileNameToDownload(ic);
    return doDownload(ic, pageActionDef, formProperties, logFileName);
  }

  private static Response<Value> doDownload(
      InvocationContext ic, PageActionDef pageActionDef, List<FormProperty> formProperties, String logFileName
  ) {
    Response<Value> response = new Response<Value>();
    final String fileFormat = getFormProperty(formProperties, "FileFormat");
    final String extension = (fileFormat.equals("JSON")) ? ".json" : ".txt";
    final String outputFormat = (fileFormat.equals("JSON")) ? MediaType.APPLICATION_JSON : MediaType.TEXT_PLAIN;
    final String logFileDirectory = getFormProperty(formProperties, "LogFileDirectory");
    if (logFileName == null) {
      logFileName = getFormProperty(formProperties, "LogFileName");
    }
    final String fullFilePath = logFileDirectory + File.separatorChar + logFileName + extension;
    File file = new File(fullFilePath);
    try {
      Files.createDirectories(Paths.get(logFileDirectory));
    } catch (Exception ex) {
      response.setServiceNotAvailable();
      //ex.printStackTrace();
      response.addMessage(new Message(Message.Severity.FAILURE,
          ic.getLocalizer().localizeString(LocalizedConstants.DOWNLOADLOGFILE_ERROR)
              + file.toString()));
      return response;
    }
    String serverName = ic.getBeanTreePath().getPath().getComponents().get(2);
    String logFile = ic.getBeanTreePath().getPath().getLastComponent();
    BeanTreePath beanTreePath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path("DomainRuntime.ServerRuntimes" + "." + serverName + "."
            + "WLDFRuntime.WLDFAccessRuntime.WLDFDataAccessRuntimes" + "." + logFile)
    );
    try {
      new Thread(() -> {
        customizerLogs(ic, file, outputFormat, beanTreePath);
      }).start();
      // FortifyIssueSuppression Log Forging
      // file name is created based on persistence manager location
      response.addMessage(new Message(Message.Severity.SUCCESS, file.toString()));
    } catch (Exception ex) {
      response.setServiceNotAvailable();
      //ex.printStackTrace();
      response.addMessage(new Message(Message.Severity.FAILURE,
          ic.getLocalizer().localizeString(LocalizedConstants.DOWNLOADLOGFILE_ERROR)
              + file.toString()));
    }
    return response;
  }


  private static String getFormProperty(List<FormProperty> formProperties, String propName) {
    for (FormProperty oneProp : formProperties) {
      if (oneProp.getName().equals(propName)) {
        String val = oneProp.getValue().asSettable().getValue().asString().getValue();
        return val;
      }
    }
    return "";
  }

  private static String getDirectoryName(InvocationContext ic) {
    String persistenceDirectoryPath = PersistenceManager.getPersistenceFilePath(ic);
    String dirName = (persistenceDirectoryPath == null)
        ? System.getProperty("java.io.tmpdir") : persistenceDirectoryPath + "/downloads";
    return dirName;
  }

  private static Path getRestActionPath(InvocationContext ic, BeanTreePath beanPath, String actionName) {
    //we have to hard code the root.
    Path restActionPath = new Path("domainRuntime");
    // add in the rest of the bean tree path,
    // e.g. ServerRuntimes/AdminServer/WLDFRuntime/WLDFAccessRuntime/WLDFDataAccessRuntimes
    restActionPath.addPath(WebLogicRestBeanRepo.getTreeRelativeRestPath(beanPath));
    // Add the name of the action:
    restActionPath.addComponent(actionName);
    return WebLogicRestBeanRepo.shortcutAdminServerRuntimePath(ic, restActionPath);
  }

  private static Response<JsonObject> customizerLogs(
      InvocationContext ic,
      File file,
      String outputFormat,
      BeanTreePath realPath
  ) {
    //start from record ID of 0. loop starting from the nextRecordId returned, until "nextRecordId" is not available.
    int fromId = 0;
    Response<JsonObject> response = new Response<>();
    javax.ws.rs.core.Response restResponse;
    JsonObject requestBody = Json.createObjectBuilder()
        .add("limit", Json.createValue(RECORD_LIMIT))
        .add("fromId", Json.createValue(fromId))
        .build();
    Path restActionPath = getRestActionPath(ic, realPath, "search");

    try {
      // FortifyIssueSuppression Unreleased Resource: Streams
      FileWriter fileWriter = new FileWriter(file);

      // FortifyIssueSuppression Log Forging
      // file location & name is obtained from persistence manager directory and MBean actions.
      LOGGER.fine("writing out to : " + file.getName());
      while (fromId >= 0) {
        LOGGER.fine("Start with record id: " + fromId);
        restResponse = webLogicRestInvoker_post(
            ic,
            restActionPath,
            requestBody,
            false,
            false,
            false,
            outputFormat
        );
        if (restResponse == null) {
          return response.setServiceNotAvailable();
        }
        int status = restResponse.getStatus();
        if (javax.ws.rs.core.Response.Status.NOT_FOUND.getStatusCode() == status) {
          return response.setNotFound();
        }
        if (javax.ws.rs.core.Response.Status.BAD_REQUEST.getStatusCode() == status) {
          return response.setUserBadRequest();
        }
        String content = restResponse.readEntity(String.class);
        String logs = content.substring(0, content.lastIndexOf(">") + 1);
        int ix = content.lastIndexOf("nextRecordId=");
        if (ix == -1) {
          fromId = -1;
        } else {
          String idStart = content.substring(ix + 13);
          fromId = Integer.parseInt(idStart);
        }
        fileWriter.write(logs);
        if (fromId == -1) {
          fileWriter.flush();
          fileWriter.close();
          LOGGER.fine("End of record reached.");
        } else {
          requestBody = Json.createObjectBuilder()
              .add("limit", Json.createValue(RECORD_LIMIT))
              .add("fromId", Json.createValue(fromId))
              .build();
        }
      }
    } catch (IOException ex) {
      LOGGER.severe(ex.getLocalizedMessage());
      return response.setServiceNotAvailable();
    }
    response.setSuccess(null);
    return response;
  }

  private static javax.ws.rs.core.Response webLogicRestInvoker_post(
      InvocationContext ic,
      Path path,
      JsonObject requestBody,
      boolean expandedValues,
      boolean saveChanges,
      boolean asynchronous,
      String acceptType
  ) {
    WebLogicRestRequest.Builder builder = WebLogicRestRequest.builder();
    builder.root(WebLogicRestRequest.CURRENT_WEBLOGIC_REST_API_ROOT);
    try {
      javax.ws.rs.core.Response restResponse =
          webLogicRestClient_post(
              builder
                  .connection(ic.getConnection())
                  .path(path.getComponents())
                  .saveChanges(saveChanges)
                  .expandedValues(expandedValues)
                  .asynchronous(asynchronous)
                  // returns properties tagged @restInternal,
                  // e.g. some deprecated ServerRuntimeMBean properties the remote console uses:
                  .internal(true)
                  .build(),
              requestBody,
              acceptType
          );
      return restResponse;
    } catch (WebLogicRestClientException e) {
      LOGGER.log(Level.WARNING, "Unexpected WebLogic Rest exception", e);
      return null;
    }
  }

  public static javax.ws.rs.core.Response webLogicRestClient_post(
      WebLogicRestRequest request,
      JsonObject data,
      String acceptType)
        throws WebLogicRestClientException {
    return webLogicRestClient_post2(request, Entity.entity(data, MediaType.APPLICATION_JSON), acceptType);
  }

  public static javax.ws.rs.core.Response webLogicRestClient_post2(
      WebLogicRestRequest request,
      Entity<Object> entity,
      String acceptType)
        throws WebLogicRestClientException {
    WebTarget webTarget = WebLogicRestClient.getWebTarget(request);
    MultivaluedMap<String, Object> headers = WebLogicRestClientHelper.createHeaders(request);
    javax.ws.rs.core.Response response = null;
    try {
      response =
          webTarget.request()
              .headers(headers)
              .accept(acceptType)
              .post(entity, javax.ws.rs.core.Response.class);

      if (WebLogicRestClientHelper.isErrorResponse("POST", response.getStatus())) {
        response = WebLogicRestClientHelper.getWebLogicRestErrorMessages(response);
      }
    } catch (ProcessingException pe) {
      if (response != null) {
        response.close();
      }
      response = WebLogicRestClient.handleProcessingException(pe);
    } catch (Exception e) {
      if (response != null) {
        response.close();
      }
      e.printStackTrace();
      response = ResponseHelper.createExceptionResponse(e);
    }
    return response;
  }

}
