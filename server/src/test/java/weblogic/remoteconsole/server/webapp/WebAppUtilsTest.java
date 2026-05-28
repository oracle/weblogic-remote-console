// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import javax.json.JsonObject;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.InvocationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class WebAppUtilsTest {

  @Test
  void readJsonObjectReadsTheEntireEntityStream() {
    InvocationContext ic = new InvocationContext();
    ByteArrayInputStream inputStream =
      new ByteArrayInputStream("{\"contents\":[{\"name\":\"Servers\"}]}\n".getBytes(StandardCharsets.UTF_8));

    JsonObject result = WebAppUtils.readJsonObject(inputStream, ic);

    assertEquals("Servers", result.getJsonArray("contents").getJsonObject(0).getString("name"));
    assertEquals(-1, inputStream.read());
  }

  @Test
  void drainEntityStreamConsumesTheEntireEntityStream() {
    InvocationContext ic = new InvocationContext();
    ByteArrayInputStream inputStream =
      new ByteArrayInputStream("{\"contents\":[]}".getBytes(StandardCharsets.UTF_8));

    WebAppUtils.drainEntityStream(inputStream, ic);

    assertEquals(-1, inputStream.read());
  }
}
