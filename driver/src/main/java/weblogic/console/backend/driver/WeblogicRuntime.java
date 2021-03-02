// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonObject;

import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.connection.ConnectionCached;
import weblogic.console.backend.connection.ConnectionLifecycleCache;
import weblogic.console.backend.driver.file.WeblogicFileRuntime;
import weblogic.console.backend.driver.wlsrest.WeblogicRestRuntime;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * Used by all control and monitoring pages that manage the Weblogic runtime mbeans.
 * <p>
 * It shields them from directly using the WLS REST api to manage the mbeans so
 * that we can swap in different implementations (e.g. a testing one tha mocks out WLS)
 * <p>
 * Wraps a WeblogicRuntimeSPI instance.
 */
public class WeblogicRuntime implements ConnectionCached {
  private static String TEST_RUNTIME_FILENAME = System.getProperty("fake.server.file");

  private static final Logger LOGGER = Logger.getLogger(WeblogicRuntime.class.getName());

  private WeblogicRuntimeSPI weblogicRuntimeImpl;

  private WeblogicRuntimeSPI getWeblogicRuntimeImpl() {
    return this.weblogicRuntimeImpl;
  }

  public WeblogicRuntime(WeblogicRuntimeSPI weblogicRuntimeImpl) {
    this.weblogicRuntimeImpl = weblogicRuntimeImpl;
  }

  public JsonObject getBeanTreeSlice(
    InvocationContext invocationContext,
    JsonObject query
  ) throws BadRequestException, Exception {
    return getWeblogicRuntimeImpl().getBeanTreeSlice(invocationContext, query);
  }

  public JsonObject getConfigBeanTreeSlice(
    InvocationContext invocationContext,
    JsonObject query
  ) throws BadRequestException, Exception {
    return getWeblogicRuntimeImpl().getConfigBeanTreeSlice(invocationContext, query);
  }

  public JsonObject invokeAction(
    InvocationContext invocationContext,
    Path bean,
    String action,
    boolean asynchronous,
    JsonObject arguments
  ) throws BadRequestException, NoDataFoundException, Exception {
    return getWeblogicRuntimeImpl().invokeAction(invocationContext, bean, action, asynchronous, arguments);
  }

  /** Get a WeblogicRuntime instance from the InvocationContext of the REST resource. */
  public static WeblogicRuntime getWeblogicRuntime(InvocationContext invocationContext) {
    Connection connection = invocationContext.getConnection();
    if (connection instanceof ConnectionLifecycleCache) {
      return getWeblogicRuntime(invocationContext, (ConnectionLifecycleCache) connection);
    }
    return new WeblogicRuntime(createWeblogicRuntimeSPI(invocationContext));
  }

  /**
   * Get a WeblogicRuntime instance by looking inside the Connection cache.
   * IFF the instance is not available, create and cache a new WeblogicRuntime.
   */
  private static WeblogicRuntime getWeblogicRuntime(
    InvocationContext ic,
    ConnectionLifecycleCache cache
  ) {
    WeblogicRuntime instance = cache.getCache(WeblogicRuntime.class);
    if (instance == null) {
      synchronized (cache) {
        instance = cache.getCache(WeblogicRuntime.class);
        if (instance == null) {
          instance =
            cache.putCache(
              WeblogicRuntime.class,
              new WeblogicRuntime(createWeblogicRuntimeSPI(ic))
            );
        }
      }
    }
    return instance;
  }

  /** Create the configured WeblogicRuntimeSPI implementation. */
  private static WeblogicRuntimeSPI createWeblogicRuntimeSPI(InvocationContext ic) {
    if (!StringUtils.isEmpty(TEST_RUNTIME_FILENAME)) {
      return WeblogicFileRuntime.getWeblogicRuntimeSPI(ic, TEST_RUNTIME_FILENAME);
    }
    return new WeblogicRestRuntime(ic.getWeblogicBeanTypes());
  }
}
