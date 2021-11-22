// Copyright (c) 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTEditTreeBeanRepo;

/**
 * Download the current state of the WDT model.
 */
public class DownloadResource extends BaseResource {
  @GET
  @Produces(MediaType.APPLICATION_OCTET_STREAM)
  public Response getWDTModel() {
    BeanRepo beanRepo = getInvocationContext().getPageRepo().getBeanRepo();
    if (!(beanRepo instanceof WDTEditTreeBeanRepo)) {
      // No content when the WDT repo is not found...
      return Response.noContent().build();
    }
    // Get the WDT BeanRepo and provide the handling for the output stream....
    WDTEditTreeBeanRepo wdtBeanRepo = (WDTEditTreeBeanRepo)beanRepo;
    StreamingOutput stream = new StreamingOutput() {
      @Override
      public void write(OutputStream os) throws IOException, FailedRequestException {
        // Uses the default platform encoding for chars to bytes...
        Writer writer = new BufferedWriter(new OutputStreamWriter(os));
        wdtBeanRepo.writeWDTModel(writer, getInvocationContext());
        writer.flush();
      }
    };
    return Response.ok(stream).build();
  }
}
