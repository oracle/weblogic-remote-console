// Copyright (c) 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * Custom JAXRS resource for uploading and deploying LibraryMBeans
 */
public class LibraryMBeanUploadableCreatableBeanCollectionResource extends CreatableBeanCollectionResource {
  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @FormDataParam("requestBody") JsonObject requestBody,
    @FormDataParam("Source") FormDataBodyPart source
  ) {
    setCreateFormPagePath();
    return CreateHelper.create(getInvocationContext(), requestBody, source);
  }
}
