// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.plugins;

import java.io.InputStream;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.configuration.ConfigurationCollectionResource;
import com.oracle.weblogic.console.backend.services.configuration.DeploymentManager;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

/** Customizes the AppDeploymentMBean collection JAXRS resource */
public class AppDeploymentMBeanCollectionResource extends ConfigurationCollectionResource {

  private static final Logger LOGGER = Logger.getLogger(AppDeploymentMBeanCollectionResource.class.getName());

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion,
    @FormDataParam("data") String data,
    @FormDataParam("Source") InputStream sourceInputStream,
    @FormDataParam("Source") FormDataContentDisposition sourcePathDisposition,
    @FormDataParam("Plan") InputStream planInputStream,
    @FormDataParam("Plan") FormDataContentDisposition planPathDisposition
  ) throws Exception {
    return
      DeploymentManager.uploadAndDeployApplication(
        getInvocationContext(),
        weblogicConfigurationVersion,
        data,
        sourceInputStream,
        sourcePathDisposition,
        planInputStream,
        planPathDisposition
      );
  }

  @Override
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return
      DeploymentManager.deployApplication(
        getInvocationContext(),
        weblogicConfigurationVersion,
        requestBody
      );
  }
}
