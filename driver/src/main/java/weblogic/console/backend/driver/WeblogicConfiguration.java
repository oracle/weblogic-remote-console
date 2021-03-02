// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.connection.ConnectionCached;
import weblogic.console.backend.connection.ConnectionLifecycleCache;
import weblogic.console.backend.driver.wlsrest.WeblogicRestConfiguration;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * Wraps a WeblogicConfigurationSPI instance and applies some common logic
 * (especially error handling) in front of it.
 */
public class WeblogicConfiguration implements ConnectionCached {

  private static final Logger LOGGER = Logger.getLogger(WeblogicConfiguration.class.getName());

  private WeblogicConfigurationSPI weblogicConfigurationImpl;

  private WeblogicConfigurationSPI getWeblogicConfigurationImpl() {
    return this.weblogicConfigurationImpl;
  }

  public WeblogicConfiguration(WeblogicConfigurationSPI weblogicConfigurationImpl) {
    this.weblogicConfigurationImpl = weblogicConfigurationImpl;
  }

  public JsonObject getBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    return getWeblogicConfigurationImpl().getBeanTreeSlice(invocationContext, query);
  }

  public JsonObject getBeanProperties(
    InvocationContext invocationContext,
    Path beanOrCollection,
    String... properties
  ) throws NoDataFoundException, Exception {
    return getWeblogicConfigurationImpl()
        .getBeanProperties(invocationContext, beanOrCollection, properties);
  }

  public JsonValue getBeanProperty(
    InvocationContext invocationContext,
    Path beanOrCollection,
    String property
  ) throws NoDataFoundException, Exception {
    JsonObject properties = getBeanProperties(invocationContext, beanOrCollection, property);
    // FortifyIssueSuppression Log Forging
    // String is cleaned, even though it is probably not necessary
    LOGGER.finer(
      "getBeanProperty path="
      + beanOrCollection
      + " property="
      + StringUtils.cleanStringForLogging(property)
      + " properties="
      + properties
    );
    return properties.get(property);
  }

  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    JsonObject properties
  ) throws NoDataFoundException, BadRequestException, Exception {
    return createBean(invocationContext, containingProperty, properties, false);
  }

  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    JsonObject properties,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    return getWeblogicConfigurationImpl().createBean(invocationContext, containingProperty, properties, asynchronous);
  }

  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    FormDataMultiPart parts,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    return getWeblogicConfigurationImpl().createBean(invocationContext, containingProperty, parts, asynchronous);
  }

  public JsonArray setBeanProperties(
    InvocationContext invocationContext,
    Path path,
    JsonObject properties
  ) throws NoDataFoundException, BadRequestException, Exception {
    return getWeblogicConfigurationImpl().setBeanProperties(invocationContext, path, properties);
  }

  public void deleteBean(
    InvocationContext invocationContext,
    Path bean
  ) throws NoDataFoundException, BadRequestException, Exception {
    deleteBean(invocationContext, bean, false);
  }

  public void deleteBean(
    InvocationContext invocationContext,
    Path bean,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    getWeblogicConfigurationImpl().deleteBean(invocationContext, bean, asynchronous);
  }

  public void startEdit(InvocationContext invocationContext) throws Exception {
    getWeblogicConfigurationImpl().startEdit(invocationContext);
  }

  public void saveChanges(InvocationContext invocationContext) throws BadRequestException, Exception {
    // TBD - aggregate messages?
    getWeblogicConfigurationImpl().saveChanges(invocationContext);
  }

  public void activate(InvocationContext invocationContext) throws BadRequestException, Exception {
    getWeblogicConfigurationImpl().activate(invocationContext);
  }

  public void cancelEdit(InvocationContext invocationContext) throws Exception {
    getWeblogicConfigurationImpl().cancelEdit(invocationContext);
  }

  public void safeResolve(InvocationContext invocationContext) throws BadRequestException, Exception {
    getWeblogicConfigurationImpl().safeResolve(invocationContext);
  }

  public void forceResolve(InvocationContext invocationContext) throws BadRequestException, Exception {
    getWeblogicConfigurationImpl().forceResolve(invocationContext);
  }

  public WeblogicConfigurationEventListenerRegistration registerConfigurationEventListener(
    InvocationContext invocationContext,
    WeblogicConfigurationEventListener listener
  ) throws Exception {
    return getWeblogicConfigurationImpl().registerConfigurationEventListener(invocationContext, listener);
  }

  public void verifyWeblogicConfigurationVersion(
    InvocationContext invocationContext,
    String versionHave
  ) throws Exception {
    // Uncomment when we enforce that the client sent in the current weblogic version
    /*
    LOGGER.fine("verifyWeblogicConfigurationVersion have=" + versionHave);
    String versionWant = getCurrentConfigurationVersion();
    LOGGER.fine("verifyWeblogicConfigurationVersion want=" + versionWant);
    // Note: if WLS REST api doesn't include the endpoint for getting the wl configuration version,
    // then versionWant will be null.
    if (!StringUtils.nonEmpty(versionWant).equals(StringUtils.nonEmpty(versionHave))) {
      if (StringUtils.isEmpty(versionHave)) {
        LOGGER.severe("Client did not pass in a weblogic configuration version");
      } else {
        throw
          new BadRequestException(
            "wrong weblogic configuration version: want="
            + versionWant
            + " have="
            + versionHave
          );
      }
    }
    */
  }

  private String getCurrentConfigurationVersion(InvocationContext invocationContext) throws Exception {
    return
      getBeanProperties(
        invocationContext,
        new Path("consoleChangeManager.configurationVersion"),
        "weblogicConfigurationVersion"
      )
      .getString("weblogicConfigurationVersion");
  }

  /** Get a WeblogicConfiguration instance from the InvocationContext of the REST resource. */
  public static WeblogicConfiguration getWeblogicConfiguration(InvocationContext invocationContext) {
    Connection connection = invocationContext.getConnection();
    if (connection instanceof ConnectionLifecycleCache) {
      return getWeblogicConfiguration(invocationContext, (ConnectionLifecycleCache) connection);
    }
    return new WeblogicConfiguration(createWeblogicConfigurationSPI(invocationContext));
  }

  /**
   * Get a WeblogicConfiguration instance by looking inside the Connection cache. IFF the instance
   * is not available, create and cache a new WeblogicConfiguration.
   */
  private static WeblogicConfiguration getWeblogicConfiguration(
    InvocationContext invocationContext,
    ConnectionLifecycleCache cache
  ) {
    WeblogicConfiguration instance = cache.getCache(WeblogicConfiguration.class);
    if (instance == null) {
      synchronized (cache) {
        instance = cache.getCache(WeblogicConfiguration.class);
        if (instance == null) {
          instance =
              cache.putCache(
                  WeblogicConfiguration.class,
                  new WeblogicConfiguration(createWeblogicConfigurationSPI(invocationContext)));
        }
      }
    }
    return instance;
  }

  /** Create the configured WeblogicConfigurationSPI implementation. */
  private static WeblogicConfigurationSPI createWeblogicConfigurationSPI(InvocationContext invocationContext) {
    return new WeblogicRestConfiguration(invocationContext.getWeblogicBeanTypes());
  }
}
