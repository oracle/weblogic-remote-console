// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.BaseTreeManager;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.PageRestMapping;
import weblogic.console.backend.driver.RuntimePageWeblogicSearchResponseRestMapper;
import weblogic.console.backend.driver.WeblogicRuntime;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.WeblogicActionSource;
import weblogic.console.backend.pagedesc.WeblogicTableSource;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

/** Does the real work behind the JAXRS resources for the monitoring and control pages. */
public class RuntimeTreeManager extends BaseTreeManager {

  private static final Logger LOGGER = Logger.getLogger(RuntimeTreeManager.class.getName());

  /** Returns the RDJ for the root bean or a collection child bean */
  public static Response viewBean(
    InvocationContext invocationContext,
    String slice
  ) throws Exception {
    return (new RuntimeTreeManager(invocationContext)).viewBean(slice);
  }

  /** Returns the RDJ for an optional singleton bean */
  public static Response viewOptionalSingleton(
    InvocationContext invocationContext,
    String slice
  ) throws Exception {
    return (new RuntimeTreeManager(invocationContext)).viewOptionalSingleton(slice);
  }

  /** Returns the RDJ for a collection of beans */
  public static Response viewCollection(InvocationContext invocationContext) throws Exception {
    return (new RuntimeTreeManager(invocationContext)).viewCollection();
  }

  /** Invokes an action on a collection child bean */
  public static Response invokeAction(
    InvocationContext invocationContext,
    String action,
    JsonObject arguments
  ) throws Exception {
    return (new RuntimeTreeManager(invocationContext)).do_invokeAction(action, arguments);
  }

  private WeblogicRuntime weblogicRuntime;

  private WeblogicRuntime getWeblogicRuntime() {
    return this.weblogicRuntime;
  }

  /** Constructor */
  private RuntimeTreeManager(InvocationContext invocationContext) {
    super(invocationContext);
    this.weblogicRuntime = WeblogicRuntime.getWeblogicRuntime(invocationContext);
  }

  private Response do_invokeAction(
    String action,
    JsonObject arguments
  ) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "invokeAction invocationContext="
          + StringUtils.cleanStringForLogging(getInvocationContext())
          + " action="
          + StringUtils.cleanStringForLogging(action)
          + " arguments="
          + StringUtils.cleanStringForLogging(arguments)
      );
      // TBD - convert arguments from RDJ terms to WLS REST terms (e.g. identities)

      // Find out how to invoke the action
      ActionInfo actionInfo = findAction(action);

      WeblogicActionSource actionSource = actionInfo.getActionSource();
      JsonObject results =
        StringUtils.isEmpty(actionSource.getActionMethod())
        ?
          standardInvokeAction(actionSource, arguments)
        :
          customInvokeAction(actionSource, arguments);

      if (actionInfo.isAsynchronous()) {
        // results contains the status of whether the operation
        // completed or is still running (i.e. statusCode),
        // and the corresponding task's entity (in WLS terms).
        // For now, don't send any of this back to the client.
        // Instead, just say that the work has been accepted.
        // Typically the UI doesn't care since it doesn't poll
        // the task.  Instead, it periodically redisplays the
        // corresponding table.
        return Response.accepted(Json.createObjectBuilder().build()).build();
      } else {
        // results contain the status (i.e. statusCode) (which should be 200)
        // and the return value from action (i.e. body)
        // For now, aways return a 200 and the return value.
        // TBD - convert the return value from wls terms to RDJ terms
        // (in case it contains any bean references)?
        return Response.ok().entity(results.getJsonObject("body")).build();
      }
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  private JsonObject standardInvokeAction(
    WeblogicActionSource actionSource,
    JsonObject arguments
  ) throws Exception {
    return
      getWeblogicRuntime().invokeAction(
        getInvocationContext(),
        getUnfoldedBeanPathWithIdentities(),
        actionSource.getName(),
        actionSource.isAsynchronous(),
        arguments
      );
  }

  private JsonObject customInvokeAction(
    WeblogicActionSource actionSource,
    JsonObject arguments
  ) throws Exception {
    String context = "customInvokeAction";
    Method method = PluginInvocationUtils.getMethod(context, actionSource.getActionMethod());
    PluginInvocationUtils.checkSignature(
      context,
      method,
      JsonObject.class, // returns an object to the client
      InvocationContext.class,
      WeblogicRuntime.class,
      String.class,
      JsonObject.class
    );
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    args.add(getWeblogicRuntime());
    args.add(actionSource.getName());
    args.add(arguments);
    return (JsonObject)PluginInvocationUtils.invokeMethod(method, args);
  }

  private ActionInfo findAction(String action) throws Exception {
    // Currently we only support actions on tables
    PagePath pagePath = newTablePagePath();
    WeblogicTableSource tableSource = 
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getWeblogicPageSources()
        .getPageSource(pagePath)
        .asTable()
        .getTableSource();
    for (WeblogicActionSource actionSource : tableSource.getActions()) {
      // async is only configured at the top level and applies to all nested actions
      boolean asynchronous = actionSource.isAsynchronous();
      if (actionSource.getActions().isEmpty()) {
        // stand alone action - see if it matches
        if (actionSource.getName().equals(action)) {
          return new ActionInfo(actionSource, asynchronous);
        }
      } else {
        // action group - see if one of the actions in the group matches
        for (WeblogicActionSource subActionSource : actionSource.getActions()) {
          if (subActionSource.getName().equals(action)) {
            return new ActionInfo(subActionSource, asynchronous);
          }
        }
      }
    }
    throw new BadRequestException("Unsupported action.  Page=" + pagePath + ". Action=" + action);
  }

  // Returns how to in invoke an action and whether it's asynchronous
  private static class ActionInfo {
    private boolean asynchronous;
    private WeblogicActionSource actionSource;

    private ActionInfo(WeblogicActionSource actionSource, boolean asynchronous) {
      this.actionSource = actionSource;
      this.asynchronous = asynchronous;
    }

    private WeblogicActionSource getActionSource() {
      return this.actionSource;
    }

    private boolean isAsynchronous() {
      return this.asynchronous;
    }
  }

  /** Get a slice of the bean tree from WLS. */
  @Override
  protected JsonObject getBeanTreeSlice(JsonObject weblogicRestSearchQuery) throws Exception {
    return getWeblogicRuntime().getBeanTreeSlice(getInvocationContext(), weblogicRestSearchQuery);
  }

  /** Create the RDJ for a collection or a bean slice from the WLS search query results. */
  @Override
  protected JsonObject createRDJ(
    PageRestMapping pageRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    return
      RuntimePageWeblogicSearchResponseRestMapper.createRDJ(
        getWeblogicRuntime(),
        pageRestMapping,
        getInvocationContext(),
        weblogicSearchResponse
      );
  }

  /** Get a bean's subtype discriminator from the WLS search query results. */
  @Override
  protected String getSubTypeDiscriminatorFromSearchResponse(
    PageRestMapping baseTypeDefaultSliceRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    return
      RuntimePageWeblogicSearchResponseRestMapper.getSubTypeDiscriminator(
        getWeblogicRuntime(),
        baseTypeDefaultSliceRestMapping,
        getInvocationContext(),
        weblogicSearchResponse
      );
  }
}
