// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.Frontend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class FrontendSessionResolverTest {

  @Test
  void unguardedStandaloneRequestWithoutCookieCreatesFrontendAndStoresCookie() {
    TestFrontendStore store = new TestFrontendStore();

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(false, "renderer", null, null, store);

    assertFalse(resolution.isRejected());
    assertTrue(resolution.shouldStoreCookie());
    assertEquals(1, store.createCount);
    assertEquals("renderer", resolution.getFrontend().getSubID());
  }

  @Test
  void guardedStandaloneRequestWithoutCookieIsRejected() {
    TestFrontendStore store = new TestFrontendStore();

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(true, "renderer", null, null, store);

    assertTrue(resolution.isRejected());
    assertEquals(0, store.createCount);
  }

  @Test
  void guardedStandaloneRequestWithoutUniqueIdIsRejected() {
    TestFrontendStore store = new TestFrontendStore();
    store.add("session", "renderer");

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(true, null, "session", null, store);

    assertTrue(resolution.isRejected());
    assertEquals(0, store.createCount);
  }

  @Test
  void guardedStandaloneRequestWithUnknownBindingIsRejected() {
    TestFrontendStore store = new TestFrontendStore();

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(true, "renderer", "session", null, store);

    assertTrue(resolution.isRejected());
    assertEquals(0, store.createCount);
  }

  @Test
  void guardedStandaloneRequestWithExistingBindingSucceeds() {
    TestFrontendStore store = new TestFrontendStore();
    Frontend existing = store.add("session", "renderer");

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(true, "renderer", "session", null, store);

    assertFalse(resolution.isRejected());
    assertFalse(resolution.shouldStoreCookie());
    assertSame(existing, resolution.getFrontend());
    assertEquals(0, store.createCount);
  }

  @Test
  void unguardedStandaloneRequestWithExistingCookieAndNewUniqueIdCreatesFrontend() {
    TestFrontendStore store = new TestFrontendStore();

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveStandalone(false, "renderer", "session", null, store);

    assertFalse(resolution.isRejected());
    assertFalse(resolution.shouldStoreCookie());
    assertEquals(1, store.createCount);
    assertEquals("session", resolution.getFrontend().getID());
    assertEquals("renderer", resolution.getFrontend().getSubID());
  }

  @Test
  void guardedHostedRequestRequiresExistingServletSessionBinding() {
    TestFrontendStore store = new TestFrontendStore();

    FrontendSessionResolver.Resolution resolution =
      FrontendSessionResolver.resolveHosted(true, "renderer", "servlet-session", store);

    assertTrue(resolution.isRejected());
    assertEquals(0, store.createCount);

    Frontend existing = store.add("servlet-session", "renderer");
    resolution = FrontendSessionResolver.resolveHosted(true, "renderer", "servlet-session", store);

    assertFalse(resolution.isRejected());
    assertSame(existing, resolution.getFrontend());
  }

  private static class TestFrontendStore implements FrontendSessionResolver.FrontendStore {
    private final Map<String, Frontend> frontends = new HashMap<>();
    private int createCount;

    @Override
    public Frontend find(String id, String subId) {
      return frontends.get(Frontend.makeFullID(id, subId));
    }

    @Override
    public Frontend create(String id, String subId) {
      createCount++;
      return add(id, subId);
    }

    Frontend add(String id, String subId) {
      Frontend frontend = new Frontend(id, subId);
      frontends.put(frontend.getFullID(), frontend);
      return frontend;
    }
  }
}
