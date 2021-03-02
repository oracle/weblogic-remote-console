// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.file;

import java.io.File;
import java.io.FileReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

import weblogic.console.backend.driver.AbstractWeblogicRuntime;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.driver.WeblogicRuntimeSPI;
import weblogic.console.backend.utils.Path;

/**
 * File based based implementation of the WeblogicRuntimeSPI interface.
 * <p>
 * Extends AbstractWeblogicRuntime and uses the response conversion logic
 * to provide a JSON reply from the WebLogic reply in the file specified.
 * <p>
 * WeblogicFileRuntime is used for testing the WebLogic Console Backend.
 */
public class WeblogicFileRuntime extends AbstractWeblogicRuntime implements WeblogicRuntimeSPI {
  private static final Logger LOGGER = Logger.getLogger(WeblogicFileRuntime.class.getName());

  private JsonObject response = null;

  private WeblogicFileRuntime(InvocationContext invocationContext) {
    super(invocationContext.getWeblogicBeanTypes());
  }

  private WeblogicFileRuntime(InvocationContext invocationContext, JsonObject response) throws Exception {
    super(invocationContext.getWeblogicBeanTypes());
    this.response = fixServerRuntimes(response);
  }

  /**
   * Obtain a WeblogicRuntimeSPI instance based the WebLogic response JSON
   * located in the specified filename.
   */
  public static WeblogicFileRuntime getWeblogicRuntimeSPI(InvocationContext invocationContext, String filename) {
    try {
      JsonObject runtime = null;
      // FortifyIssueSuppression Unreleased Resource: Streams
      // FortifyIssueSuppression Path Manipulation
      // This is test code
      try (JsonReader reader = Json.createReader(new FileReader(filename))) {
        runtime = reader.readObject();

        // Do no convert the JSON object to String unless the proper log level is enabled!
        // FortifyIssueSuppression Log Forging
        // The string is coming from WebLogic and is, therefore, safe
        if (LOGGER.isLoggable(Level.FINEST)) {
          LOGGER.finest(
            "\n>>>> WebLogic JSON response: <<<<\n"
            + runtime.toString()
            + "\n>>>> END response <<<<"
          );
        }
      }

      // Create the runtime and log the location of the WebLogic response JSON file
      WeblogicFileRuntime result = new WeblogicFileRuntime(invocationContext, runtime);
      // FortifyIssueSuppression Log Forging
      // FortifyIssueSuppression Path Manipulation
      // This is test code
      LOGGER.info("FILE: WeblogicFileRuntime using file: " + new File(filename).getAbsolutePath());
      return result;
    } catch (Exception exc) {
      LOGGER.log(
        Level.INFO,
        "FILE: Unable to create WeblogicFileRuntime with exception: " + exc.toString(),
        exc
      );
      return new WeblogicFileRuntime(invocationContext);
    }
  }

  /**
   * Return a JSON response based on the WebLogic response that was obtained from a file.
   * The use of the file content normalizes the returned data over time when testing the
   * WebLogic Console Backend.
   */
  @Override
  public JsonObject getBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    LOGGER.finest("FILE: getBeanTreeSlice query=" + query);
    if (response == null) {
      throw new Exception("Unable to read and/or parse the WebLogic runtime response file!");
    }
    return response;
  }

  @Override
  public JsonObject getConfigBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    throw
      new Exception(
        "WeblogicFileRuntime does not support getConfigBeanTreeSlice"
        + " query=" + query
      );
  }

  @Override
  public JsonObject invokeAction(
    InvocationContext invocationContext,
    Path bean,
    String action,
    boolean asynchronous,
    JsonObject arguments
  ) throws BadRequestException, NoDataFoundException, Exception {
    throw
      new Exception(
        "WeblogicFileRuntime does not support invokeAction"
        + " bean=" + bean
        + " action=" + action
        + " asynchronous=" + asynchronous
        + " arguments=" + arguments
      );
  }
}
