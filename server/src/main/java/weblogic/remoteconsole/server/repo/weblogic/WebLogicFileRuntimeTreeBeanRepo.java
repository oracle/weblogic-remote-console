// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.io.File;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRuntimeTreeBeanRepoDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * File based based implementation of a RuntimeTreeBeanRepo that implements BeanReaderRepo.
 * <p>
 * Uses a file to obtain the JSON response data from a WebLogic DomainRuntime tree.
 * <p>
 * WebLogicFileRuntimeTreeBeanRepo is used for testing the WebLogic Console Backend only!
 */
public class WebLogicFileRuntimeTreeBeanRepo extends WebLogicRestBeanRepo {
  private static final Logger LOGGER = Logger.getLogger(WebLogicFileRuntimeTreeBeanRepo.class.getName());

  // Only for DomainRuntime tree as the read only Domain tree is not handled!
  private static Map<String,String> rootBeanNameToWebLogicRestTreeNameMap = Map.of("DomainRuntime", "domainRuntime");

  // The search results as obtained from the file
  private JsonObject searchResults = null;

  public WebLogicFileRuntimeTreeBeanRepo(WebLogicMBeansVersion mbeansVersion, String filename) {
    super(
      mbeansVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class),
      rootBeanNameToWebLogicRestTreeNameMap
    );

    // Get the search results from the WLS REST response in the file
    this.searchResults = createSearchResultsFromFile(filename);
  }

  /**
   * Obtain the WebLogic response JSON located in the specified filename and fixup the results.
   */
  private JsonObject createSearchResultsFromFile(String filename) {
    JsonObject runtime = null;
    try {
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
      // FortifyIssueSuppression Log Forging
      // FortifyIssueSuppression Path Manipulation
      // This is test code
      LOGGER.info("FILE: WebLogicFileRuntimeTreeBeanRepo using file: " + new File(filename).getAbsolutePath());

      // Get the BeanTypeDef for the tree and use that for fixing the results...
      Path tree = new Path("DomainRuntime");
      BeanTypeDef rootTypeDef = getBeanRepoDef().getRootTypeDef().getChildDef(tree).getChildTypeDef();
      runtime = WebLogicRestSearchResultsFixer.fixServerRuntimes(runtime, rootTypeDef);
      LOGGER.info("FILE: WebLogicFileRuntimeTreeBeanRepo completed fixServerRuntimes()");
    } catch (Exception exc) {
      // Report on any exceptions (e.g. issue finding/reading the file) then continue as
      // the runtime search will return not found status and test results will not match.
      LOGGER.log(
        Level.INFO,
        "FILE: Unable to create WebLogicFileRuntimeTreeBeanRepo with exception: " + exc.toString(),
        exc
      );
    }
    return runtime;
  }

  /**
   * Return a BeanReaderRepoSearchBuilder where the results are backed by the WLS REST response in a file.
   *
   * Create a WebLogicRestBeanRepoSearchBuilder so that the WebLogicRestBeanRepoSearchResults can be used
   * as the BeanReaderRepoSearchResults implemenation for the search results found in the file.
   */
  @Override  
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext invocationContext, boolean includeIsSet) {
    LOGGER.fine("FILE: WebLogicFileRuntimeTreeBeanRepo createSearchBuilder() " + invocationContext.getBeanTreePath());
    return
      new FileBeanReaderRepoSearchBuilder(
        this.searchResults,
        (WebLogicRestBeanRepoSearchBuilder) super.createSearchBuilder(invocationContext, false)
      );
  }

  /**
   *  The implementation of BeanReaderRepoSearchBuilder which will return
   *  the WLS REST response contained in the file as specified when
   *  the WebLogicFileRuntimeTreeBeanRepo is created at connection time.
   */
  class FileBeanReaderRepoSearchBuilder implements BeanReaderRepoSearchBuilder {
    private JsonObject rootBeanSearchResults = null;
    private WebLogicRestBeanRepoSearchBuilder weblogicRestBeanRepoSearchBuilder;

    public FileBeanReaderRepoSearchBuilder(
      JsonObject rootBeanSearchResults,
      WebLogicRestBeanRepoSearchBuilder weblogicRestBeanRepoSearchBuilder
    ) {
      this.rootBeanSearchResults = rootBeanSearchResults;
      this.weblogicRestBeanRepoSearchBuilder = weblogicRestBeanRepoSearchBuilder;
    }

    /**
     * Adding proprties is ignored except to check that the tree being searched is valid!
     */
    @Override
    public void addProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
      verifySupportsBean(beanTreePath);
    }

    /**
     * Return a response based on the WebLogic response that was obtained from
     * a file. The use of the file content normalizes the returned data over time
     * when testing the WebLogic Console Backend.
     */
    @Override
    public Response<BeanReaderRepoSearchResults> search() {
      LOGGER.fine("FILE: WebLogicFileRuntimeTreeBeanRepo search()");
      Response<BeanReaderRepoSearchResults> response = new Response<>();

      // Any problems reading the file results in not found responses at runtime...
      if (rootBeanSearchResults == null) {
        return response.setNotFound();
      }

      // Create the search results used with BeanReaderRepoSearchResults
      Map<String,JsonObject> searchResults = new HashMap<String,JsonObject>();
      searchResults.put("DomainRuntime", rootBeanSearchResults);

      // Return the results from the file...
      return
        response.setSuccess(
          new WebLogicRestBeanRepoSearchResults(weblogicRestBeanRepoSearchBuilder, searchResults)
        );
    }
  }
}
