// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
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

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
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
  private static final long  RECORD_LIMIT = Long.MAX_VALUE;
  private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");


  private WLDFDataAccessRuntimeMBeanCustomizer() {
  }

  /**
   * Customize to return the default directory for downloading log file.
   *
   */
  public static void customizeDownloadLogsInputForm(InvocationContext ic, Page page) {
    Value logFileDirectoryValue = new StringValue(getDirectoryName(ic));
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties = null;
    Date sinceDate = getSinceDate(ic);
    Date untilDate = new Date(System.currentTimeMillis());
    newProperties = List.of(
      CustomizerUtils.createFormProperty("LogFileDirectory", oldProperties, logFileDirectoryValue),
      CustomizerUtils.createFormProperty("Since", oldProperties, new DateValue(sinceDate)),
      CustomizerUtils.createFormProperty("Until", oldProperties, new DateValue(untilDate)),
      CustomizerUtils.createFormProperty("MaxRecords", oldProperties, new LongValue(-1))
    );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
  }


  private static Date getSinceDate(InvocationContext ic) {
    String logFile = "";
    BeanTreePath beanTreePath = null;
    //if user is downloading multiple logfiles, will leave the Since field empty.
    if (ic.getIdentifiers() != null) {
      if (ic.getIdentifiers().size() > 1) {
        return null;
      }
      logFile = ic.getBeanTreePath().getLastSegment().getKey();
      String serverName = ic.getIdentifiers().get(0);
      String path =
        "DomainRuntime.CombinedServerRuntimes."
        + serverName
        + ".ServerRuntime.WLDFRuntime.WLDFAccessRuntime.WLDFDataAccessRuntimes."
        + logFile;
      beanTreePath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path(path)
      );
    } else {
      if (ic.getIdentities() != null) {
        if (ic.getIdentities().size() > 1) {
          return null;
        }
        logFile = ic.getIdentities().get(0).getPath().getLastComponent();
      } else {
        //for Table (unaggrated) multi downloads
        logFile = ic.getBeanTreePath().getPath().getLastComponent();
      }
      beanTreePath =
        BeanTreePath.create(
          ic.getBeanTreePath().getBeanRepo(),
          ic.getBeanTreePath().getPath().childPath(logFile)
        );
    }
    InvocationContext variableIC = new InvocationContext(ic, beanTreePath);
    BeanTypeDef typeDef = beanTreePath.getTypeDef();
    BeanPropertyDef earliestAvailableTimestampPropertyDef =
      typeDef.getPropertyDef(new Path("EarliestAvailableTimestamp"));
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(variableIC, false);
    builder.addProperty(beanTreePath, earliestAvailableTimestampPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(beanTreePath);
    if (beanResults == null) {
      throw Response.notFoundException();
    }
    long earliestAvailableTimestamp =  beanResults.getValue(earliestAvailableTimestampPropertyDef).asLong().getValue();
    return new Date(earliestAvailableTimestamp);
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
    // e.g. JMSMessageLog/AdminJMSServer, we will replace that with "_".
    logFile = logFile.replace(File.separator, "_");
    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    return  serverName + "_" + logFile + "_" + simpleDateFormat.format(timestamp);
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

    String wlsSince = getDateTime("Since", formProperties);
    String wlsUntil = getDateTime("Until", formProperties);
    long wlsMaxRecords = getRecordLimit(formProperties, "MaxRecords");
    String serverName = ic.getBeanTreePath().getPath().getComponents().get(2);
    String logFile = ic.getBeanTreePath().getPath().getLastComponent();
    BeanTreePath beanTreePath = BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path("DomainRuntime.ServerRuntimes" + "." + serverName + "."
            + "WLDFRuntime.WLDFAccessRuntime.WLDFDataAccessRuntimes" + "." + logFile)
    );
    try {
      new Thread(() -> {
        customizerLogs(ic, file, outputFormat, wlsSince, wlsUntil, wlsMaxRecords, beanTreePath);
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
    FormProperty formProperty = CustomizerUtils.findOptionalFormProperty(propName, formProperties);
    if (formProperty != null) {
      return formProperty.getValue().asSettable().getValue().asString().getValue();
    }
    return "";
  }

  private static long getRecordLimit(List<FormProperty> formProperties, String propName) {
    FormProperty formProperty = CustomizerUtils.findOptionalFormProperty(propName, formProperties);
    if (formProperty != null) {
      long limit = formProperty.getValue().asSettable().getValue().asLong().getValue();
      //return (limit < 0) ? RECORD_LIMIT : limit;
      if (limit < 0) {
        return RECORD_LIMIT;
      } else {
        return limit;
      }
    }
    return RECORD_LIMIT;
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


  private static String getDateTime(String propName, List<FormProperty> formProperties) {
    FormProperty dateFormProperty = CustomizerUtils.findOptionalFormProperty(propName, formProperties);
    if (dateFormProperty != null) {
      Date date = dateFormProperty.getValue().asSettable().getValue().asDate().getValue();
      if (date != null) {
        return (new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")).format(date);
      }
    }
    return null;
  }

  private static Response<JsonObject> customizerLogs(
      InvocationContext ic,
      File file,
      String outputFormat,
      String since,
      String until,
      long maxRecords,
      BeanTreePath realPath
  ) {
    Response<JsonObject> response = new Response<>();
    JsonObject requestBody = null;
    if (since != null) {
      if (until != null) {
        requestBody = Json.createObjectBuilder()
          .add("since", Json.createValue(since))
          .add("until", Json.createValue(until))
          .add("limit", Json.createValue(maxRecords))    // record limit is a required field.
          .build();
      } else {
        requestBody = Json.createObjectBuilder()
          .add("since", Json.createValue(since))
          .add("limit", Json.createValue(maxRecords))    // record limit is a required field.
          .build();
      }
    } else {
      if (until != null) {
        requestBody = Json.createObjectBuilder()
          .add("until", Json.createValue(until))
          .add("limit", Json.createValue(maxRecords))    // record limit is a required field.
          .build();
      } else {
        requestBody = Json.createObjectBuilder()
          .add("limit", Json.createValue(maxRecords))    // record limit is a required field.
          .build();
      }
    }
    Path restActionPath = getRestActionPath(ic, realPath, "search");

    try {
      // FortifyIssueSuppression Log Forging
      // file location & name is obtained from persistence manager directory and MBean actions.
      LOGGER.fine("writing out to : " + file.getName());
      javax.ws.rs.core.Response restResponse =
        webLogicRestInvoker_post(
          ic,
          restActionPath,
          requestBody,  //request body will have since and until
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
      //both is and os will automatically be closed when the block finishes.
      try (InputStream is = restResponse.readEntity(InputStream.class)) {
        try (OutputStream os = new FileOutputStream(file, false)) {
          is.transferTo(os);
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
