// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.util.UUID;

import weblogic.remoteconsole.server.repo.Frontend;

class FrontendSessionResolver {
  interface FrontendStore {
    Frontend find(String id, String subId);

    Frontend create(String id, String subId);
  }

  static class Resolution {
    private final Frontend frontend;
    private final boolean storeCookie;
    private final boolean rejected;

    private Resolution(Frontend frontend, boolean storeCookie, boolean rejected) {
      this.frontend = frontend;
      this.storeCookie = storeCookie;
      this.rejected = rejected;
    }

    Frontend getFrontend() {
      return frontend;
    }

    boolean shouldStoreCookie() {
      return storeCookie;
    }

    boolean isRejected() {
      return rejected;
    }
  }

  private FrontendSessionResolver() {
  }

  static Resolution resolveStandalone(
    boolean requiresExistingFrontend,
    String uniqueId,
    String cookieSessionId,
    String headerSessionId,
    FrontendStore store
  ) {
    String sessionId = !isBlank(cookieSessionId) ? cookieSessionId : headerSessionId;
    if (requiresExistingFrontend) {
      return resolveExisting(sessionId, uniqueId, store);
    }

    if (isBlank(sessionId)) {
      Frontend frontend = store.create(UUID.randomUUID().toString(), uniqueId);
      return new Resolution(frontend, true, false);
    }

    Frontend frontend = store.find(sessionId, uniqueId);
    if (frontend == null) {
      frontend = store.create(sessionId, uniqueId);
    }
    return new Resolution(frontend, false, false);
  }

  static Resolution resolveHosted(
    boolean requiresExistingFrontend,
    String uniqueId,
    String servletSessionId,
    FrontendStore store
  ) {
    if (requiresExistingFrontend) {
      return resolveExisting(servletSessionId, uniqueId, store);
    }

    Frontend frontend = store.find(servletSessionId, uniqueId);
    if (frontend == null) {
      frontend = store.create(servletSessionId, uniqueId);
    }
    return new Resolution(frontend, false, false);
  }

  static boolean isBlank(String value) {
    return value == null || value.isBlank();
  }

  private static Resolution resolveExisting(
    String sessionId,
    String uniqueId,
    FrontendStore store
  ) {
    if (isBlank(sessionId) || isBlank(uniqueId)) {
      return new Resolution(null, false, true);
    }

    Frontend frontend = store.find(sessionId, uniqueId);
    if (frontend == null) {
      return new Resolution(null, false, true);
    }

    return new Resolution(frontend, false, false);
  }
}
