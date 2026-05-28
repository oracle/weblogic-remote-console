// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.InvocationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class MultipartUpdateDispatchTest {

  private static final JsonObject REQUEST_BODY = Json.createObjectBuilder().build();

  @Test
  void editableCollectionChildUsesSubclassUpdateHelperWhenNotMultipart() {
    Response response = new TestEditableCollectionChildBeanResource().updateSliceForm(REQUEST_BODY, null);

    assertEquals(211, response.getStatus());
  }

  @Test
  void editableMandatorySingletonUsesSubclassUpdateHelperWhenNotMultipart() {
    Response response = new TestEditableMandatorySingletonBeanResource().updateSliceForm(REQUEST_BODY, null);

    assertEquals(212, response.getStatus());
  }

  @Test
  void editableOptionalSingletonUsesSubclassUpdateHelperWhenNotMultipart() {
    Response response = new TestEditableOptionalSingletonBeanResource().updateSliceForm(REQUEST_BODY, null);

    assertEquals(213, response.getStatus());
  }

  @Test
  void creatableOptionalSingletonUsesSubclassUpdateHelperWhenNotMultipart() {
    Response response = new TestCreatableOptionalSingletonBeanResource().updateSliceForm(REQUEST_BODY, null);

    assertEquals(214, response.getStatus());
  }

  @Test
  void editableCollectionChildUsesCustomUpdateHelperWhenMultipart() {
    Response response =
      new TestMultipartEditableCollectionChildBeanResource().updateSliceForm(REQUEST_BODY, new FormDataMultiPart());

    assertEquals(221, response.getStatus());
  }

  @Test
  void editableMandatorySingletonUsesCustomUpdateHelperWhenMultipart() {
    Response response =
      new TestMultipartEditableMandatorySingletonBeanResource().updateSliceForm(REQUEST_BODY, new FormDataMultiPart());

    assertEquals(222, response.getStatus());
  }

  @Test
  void editableOptionalSingletonUsesCustomUpdateHelperWhenMultipart() {
    Response response =
      new TestMultipartEditableOptionalSingletonBeanResource().updateSliceForm(REQUEST_BODY, new FormDataMultiPart());

    assertEquals(223, response.getStatus());
  }

  @Test
  void creatableOptionalSingletonUsesCustomUpdateHelperWhenMultipart() {
    Response response =
      new TestMultipartCreatableOptionalSingletonBeanResource().updateSliceForm(REQUEST_BODY, new FormDataMultiPart());

    assertEquals(224, response.getStatus());
  }

  private static class TestEditableCollectionChildBeanResource extends EditableCollectionChildBeanResource {
    @Override
    protected Response updateSliceForm(JsonObject requestBody) {
      return Response.status(211).build();
    }
  }

  private static class TestEditableMandatorySingletonBeanResource extends EditableMandatorySingletonBeanResource {
    @Override
    protected Response updateSliceForm(JsonObject requestBody) {
      return Response.status(212).build();
    }
  }

  private static class TestEditableOptionalSingletonBeanResource extends EditableOptionalSingletonBeanResource {
    @Override
    protected Response updateSliceForm(JsonObject requestBody) {
      return Response.status(213).build();
    }
  }

  private static class TestCreatableOptionalSingletonBeanResource extends CreatableOptionalSingletonBeanResource {
    @Override
    protected Response updateSliceForm(JsonObject requestBody) {
      return Response.status(214).build();
    }
  }

  private static class TestMultipartEditableCollectionChildBeanResource extends EditableCollectionChildBeanResource {
    @Override
    protected UpdateHelper createUpdateHelper() {
      return new TestUpdateHelper(221);
    }
  }

  private static class TestMultipartEditableMandatorySingletonBeanResource
    extends EditableMandatorySingletonBeanResource {
    @Override
    protected UpdateHelper createUpdateHelper() {
      return new TestUpdateHelper(222);
    }
  }

  private static class TestMultipartEditableOptionalSingletonBeanResource
    extends EditableOptionalSingletonBeanResource {
    @Override
    protected UpdateHelper createUpdateHelper() {
      return new TestUpdateHelper(223);
    }
  }

  private static class TestMultipartCreatableOptionalSingletonBeanResource
    extends CreatableOptionalSingletonBeanResource {
    @Override
    protected UpdateHelper createUpdateHelper() {
      return new TestUpdateHelper(224);
    }
  }

  private static class TestUpdateHelper extends UpdateHelper {
    private final int status;

    private TestUpdateHelper(int status) {
      this.status = status;
    }

    @Override
    public Response updateBean(InvocationContext ic, JsonObject requestBody, FormDataMultiPart parts) {
      return Response.status(status).build();
    }
  }
}
