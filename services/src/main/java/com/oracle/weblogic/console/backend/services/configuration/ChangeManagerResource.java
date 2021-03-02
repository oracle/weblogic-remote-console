// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.BaseResource;
import com.oracle.weblogic.console.backend.services.ServiceException;
import weblogic.console.backend.driver.ChangeManagerWeblogicSearchQueryRestMapper;
import weblogic.console.backend.driver.ChangeManagerWeblogicSearchResponseRestMapper;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.utils.StringUtils;

// Uncomment when we add support for listening for Weblogic configuration changes
/*
import org.glassfish.jersey.media.sse.EventOutput;
import org.glassfish.jersey.media.sse.OutboundEvent;
import org.glassfish.jersey.media.sse.SseBroadcaster;
import org.glassfish.jersey.media.sse.SseFeature;
*/

/** JAXRS resource that manages all change manager related endpoints. */
public class ChangeManagerResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(ChangeManagerResource.class.getName());

  @Context HttpHeaders headers;

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChangeManager() throws ServiceException {
    LOGGER.fine("getChangeManager");
    try {
      JsonObject weblogicSearchResponse =
        getWeblogicConfiguration().getBeanTreeSlice(
          getInvocationContext(),
          ChangeManagerWeblogicSearchQueryRestMapper.createChangeManagerQuery(getInvocationContext()
          )
        );
      JsonObject changeManager =
        ChangeManagerWeblogicSearchResponseRestMapper.createChangeManagerResponse(
          getInvocationContext(),
          weblogicSearchResponse
        );
      return Response.ok(changeManager).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @GET
  @Path("/changes")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChanges() throws ServiceException {
    LOGGER.fine("getChanges");
    try {
      JsonObject weblogicSearchResponse =
        getWeblogicConfiguration().getBeanTreeSlice(
          getInvocationContext(),
          ChangeManagerWeblogicSearchQueryRestMapper.createChangesQuery(getInvocationContext())
        );
      JsonObject changes =
        ChangeManagerWeblogicSearchResponseRestMapper.createChangesResponse(
          getInvocationContext(),
          weblogicSearchResponse
        );
      return Response.ok(changes).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/startEdit")
  @Produces(MediaType.APPLICATION_JSON)
  public Response startEdit(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("startEdit weblogicConfigurationVersion="
      + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().startEdit(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/saveChanges")
  @Produces(MediaType.APPLICATION_JSON)
  public Response saveChanges(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("startEdit saveChanges=" + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().saveChanges(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/cancelEdit")
  @Produces(MediaType.APPLICATION_JSON)
  public Response cancelEdit(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("cancelEdit weblogicConfigurationVersion="
      + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().cancelEdit(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/activate")
  @Produces(MediaType.APPLICATION_JSON)
  public Response activate(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("activate weblogicConfigurationVersion="
      + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().activate(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/safeResolve")
  @Produces(MediaType.APPLICATION_JSON)
  public Response safeResolve(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("safeResolve weblogicConfigurationVersion="
      + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().safeResolve(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  @POST
  @Path("/forceResolve")
  @Produces(MediaType.APPLICATION_JSON)
  public Response forceResolve(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws ServiceException {
    // FortifyIssueSuppression Log Forging
    // Could come from user, so scrub it
    LOGGER.fine("forceResolve weblogicConfigurationVersion="
      + StringUtils.cleanStringForLogging(weblogicConfigurationVersion));
    try {
      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);
      getWeblogicConfiguration().forceResolve(getInvocationContext());
      return okResponse();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  // Uncomment when we add support for listening for Weblogic configuration changes
  /*
    @GET
    @Produces(SseFeature.SERVER_SENT_EVENTS)
    @Path("/weblogicConfigurationChanged")
    public EventOutput addWeblogicConfigurationChangedListener() throws Exception {
      LOGGER.info("weblogicConfigurationChanged");
      SseBroadcaster broadcaster = getOrCreateConfigChangedBroadcaster();
      EventOutput eo = new EventOutput();
      broadcaster.add(eo);
      return eo;
    }

    private static SseBroadcaster configChangedBroadcaster = null;
    private static WeblogicConfigurationEventListenerRegistration listenerRegistration = null;

    private static synchronized SseBroadcaster getOrCreateConfigChangedBroadcaster() throws Exception {
      if (configChangedBroadcaster == null) {
        configChangedBroadcaster = new SseBroadcaster();
        listenerRegistration =
          getWeblogicConfiguration().registerConfigurationEventListener(new WeblogicConfigEventListener());
      }
      return configChangedBroadcaster;
    }

    private static void broadcast(String weblogicConfigEventType, String weblogicConfigurationVersion) {
      // the broadcaster must have been initialized if we're receiving events:
      configChangedBroadcaster.broadcast(
        (new OutboundEvent.Builder())
          .name(weblogicConfigEventType)
          .data(String.class, weblogicConfigurationVersion)
          .build()
      );
    }

    private static class WeblogicConfigEventListener implements WeblogicConfigurationEventListener {
      @Override public void configurationChanged(String weblogicConfigurationVersion) {
        broadcast("WeblogicConfigurationChanged", weblogicConfigurationVersion);
      }
      @Override public void changesCancelled(String weblogicConfigurationVersion) {
        broadcast("WeblogicConfigurationChangesCancelled", weblogicConfigurationVersion);
      }
    }
  */

  private void verifyWeblogicConfigurationVersion(String versionHave) throws Exception {
    getWeblogicConfiguration().verifyWeblogicConfigurationVersion(getInvocationContext(), versionHave);
  }

  private Response okResponse() {
    return Response.ok(Json.createObjectBuilder().build()).build();
  }

  /** Obtain a WeblogicConfiguration instance for use by the REST resource */
  private WeblogicConfiguration getWeblogicConfiguration() throws Exception {
    return WeblogicConfiguration.getWeblogicConfiguration(getInvocationContext());
  }
}
