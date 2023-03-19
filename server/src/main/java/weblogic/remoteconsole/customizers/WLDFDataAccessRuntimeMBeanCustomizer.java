// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
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

  private WLDFDataAccessRuntimeMBeanCustomizer() {
  }

  /**
   * Customize the WLDFDataAccessRuntimeMBean for downloading log files.
   */
  public static Response<Value> downloadLogAsJson(InvocationContext ic) {
    return downloadLog(ic, MediaType.APPLICATION_JSON);
  }

  public static Response<Value> downloadLogAsPlainText(InvocationContext ic) {
    return downloadLog(ic, MediaType.TEXT_PLAIN);
  }

  private static Response<Value> downloadLog(InvocationContext ic, String outputFormat) {
    Response<Value> response = new Response<Value>();
    String dirName = getDirectoryName();
    String fileName = getFileName(ic);
    try {
      File file = getOutputLogFile(dirName, fileName);
      new Thread(() -> {
        customizerLogs(ic, file, outputFormat);
      }).start();
      // FortifyIssueSuppression Log Forging
      // file name is created based on persistence manager location
      response.addMessage(new Message(Message.Severity.SUCCESS, file.toString()));
    } catch (Exception ex) {
      response.setServiceNotAvailable();
      ex.printStackTrace();
      response.addMessage(new Message(Message.Severity.FAILURE,
          ic.getLocalizer().localizeString(LocalizedConstants.DOWNLOADLOGFILE_ERROR)
              + dirName +  " : " + fileName));
    }
    return response;
  }

  private static BeanTreePath getRealBeanTreePath(InvocationContext ic) {
    return
        BeanTreePath.create(
            ic.getBeanTreePath().getBeanRepo(),
            new Path("DomainRuntime.ServerRuntimes" + "." + getServerName(ic) + "."
                + "WLDFRuntime.WLDFAccessRuntime.WLDFDataAccessRuntimes" + "." + getLogFileName(ic))
        );
  }

  private static String getServerName(InvocationContext ic) {
    // The bean path the user invoked is DomainRuntime/CombinedServerRuntimes/serverName
    // Extract the server name from it
    return ic.getBeanTreePath().getSegments().get(1).getKey();
  }

  private static String getLogFileName(InvocationContext ic) {
    // The bean path the user invoked is DomainRuntime/CombinedServerRuntimes/serverName
    // Extract the logfile name from it
    return ic.getBeanTreePath().getSegments().get(5).getKey();
  }

  private static final SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");

  private static String getFileName(InvocationContext ic) {
    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    return getServerName(ic)
        + "_" + getLogFileName(ic).replace("/", "_")
        + "_" + sdf1.format(timestamp);
  }

  private static String getDirectoryName() {
    String persistenceDirectoryPath = PersistenceManager.getPersistenceFilePath();
    String dirName = (persistenceDirectoryPath == null)
        ? System.getProperty("java.io.tmpdir") : persistenceDirectoryPath + "/downloads";
    return dirName;
  }

  private static File getOutputLogFile(String dirName, String fileName) throws Exception {
    // FortifyIssueSuppression Path Manipulation
    // dirName is created based on persistence manager location
    Files.createDirectories(Paths.get(dirName));
    // FortifyIssueSuppression Path Manipulation
    return new File(dirName, fileName);
  }

  private static Path getRestActionPath(BeanTreePath beanPath, String actionName) {
    //we have to hard code the root.
    Path restActionPath = new Path("domainRuntime");
    // add in the rest of the bean tree path,
    // e.g. ServerRuntimes/AdminServer/WLDFRuntime/WLDFAccessRuntime/WLDFDataAccessRuntimes
    restActionPath.addPath(WebLogicRestBeanRepo.getTreeRelativeRestPath(beanPath));
    // Add the name of the action:
    restActionPath.addComponent(actionName);
    return restActionPath;
  }


  private static Response<JsonObject> customizerLogs(
      InvocationContext ic,
      File file,
      String outputFormat
  ) {
    //start from record ID of 0. loop starting from the nextRecordId returned, until "nextRecordId" is not available.
    int fromId = 0;
    Response<JsonObject> response = new Response<>();
    javax.ws.rs.core.Response restResponse;
    BeanTreePath realPath = getRealBeanTreePath(ic);
    JsonObject requestBody = Json.createObjectBuilder()
        .add("limit", Json.createValue(RECORD_LIMIT))
        .add("fromId", Json.createValue(fromId))
        .build();
    Path restActionPath = getRestActionPath(realPath, "search");

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
