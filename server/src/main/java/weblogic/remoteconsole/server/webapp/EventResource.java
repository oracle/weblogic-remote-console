// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;

import weblogic.remoteconsole.server.repo.Frontend;

public class EventResource {
  @GET
  // @Produces(MediaType.SERVER_SENT_EVENTS)
  @Produces("text/event-stream")
  public void getServerSentEvents(
    @Context SseEventSink eventSink,
    @Context Sse sse,
    @Context ResourceContext resContext) {
    Frontend.getFromContext(resContext).setSSEObject(sse);
    Frontend.getFromContext(resContext).setSSESink(eventSink);
  }

}
