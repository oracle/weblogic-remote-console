// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/** Base Implementation of the WeblogicConfigurationSPI interface. */
public abstract class AbstractWeblogicConfiguration implements WeblogicConfigurationSPI {

  private static final Logger LOGGER =
    Logger.getLogger(AbstractWeblogicConfiguration.class.getName());

  private WeblogicBeanTypes weblogicBeanTypes;

  protected WeblogicBeanTypes getWeblogicBeanTypes() {
    return this.weblogicBeanTypes;
  }

  public AbstractWeblogicConfiguration(WeblogicBeanTypes weblogicBeanTypes) {
    this.weblogicBeanTypes = weblogicBeanTypes;
  }

  protected abstract void listenersModified(boolean haveListeners) throws Exception;

  // Any code accessing configEventListenerRegistrations
  // must synchronize on configEventListenerRegistrations:
  private Set<ConfigEventListenerRegistration> configEventListenerRegistrations = new HashSet<>();

  @Override
  public WeblogicConfigurationEventListenerRegistration registerConfigurationEventListener(
    InvocationContext invocationContext,
    WeblogicConfigurationEventListener listener
  ) throws Exception {
    LOGGER.info("registerConfigurationEventListener listener=" + listener);
    ConfigEventListenerRegistration registration = new ConfigEventListenerRegistration(listener);
    addListenerRegistration(registration);
    return registration;
  }

  protected void broadcastConfigChanged(String weblogicConfigurationVersion) {
    synchronized (this.configEventListenerRegistrations) {
      // TBD - should we broadcast in parallel (v.s. serially?)
      // Not an issue since ChangeManagerResource only registers one listener
      // regardless of how many CFE SSE listeners connect to it.
      for (ConfigEventListenerRegistration registration : this.configEventListenerRegistrations) {
        registration.getListener().configurationChanged(weblogicConfigurationVersion);
      }
    }
  }

  protected void broadcastChangesCancelled(String weblogicConfigurationVersion) {
    synchronized (this.configEventListenerRegistrations) {
      // TBD - should we broadcast in parallel (v.s. serially?)
      // Not an issue since ChangeManagerResource only registers one listener
      // regardless of how many CFE SSE listeners connect to it.
      for (ConfigEventListenerRegistration registration : this.configEventListenerRegistrations) {
        registration.getListener().changesCancelled(weblogicConfigurationVersion);
      }
    }
  }

  private void addListenerRegistration(
    ConfigEventListenerRegistration registration
  ) throws Exception {
    synchronized (this.configEventListenerRegistrations) {
      this.configEventListenerRegistrations.add(registration);
      listenersModified(haveListener());
    }
  }

  private void removeListenerRegistration(
    ConfigEventListenerRegistration registration
  ) throws Exception {
    synchronized (this.configEventListenerRegistrations) {
      this.configEventListenerRegistrations.remove(registration);
      listenersModified(haveListener());
    }
  }

  private boolean haveListener() {
    return !this.configEventListenerRegistrations.isEmpty();
  }

  private class ConfigEventListenerRegistration implements WeblogicConfigurationEventListenerRegistration {
    private WeblogicConfigurationEventListener listener;

    private WeblogicConfigurationEventListener getListener() {
      return this.listener;
    }

    private ConfigEventListenerRegistration(WeblogicConfigurationEventListener listener)
        throws Exception {
      this.listener = listener;
    }

    @Override
    public synchronized void unregister() throws Exception {
      if (this.listener == null) {
        return; // already unregistered
      }
      removeListenerRegistration(this);
      this.listener = null;
    }
  }

  protected WeblogicBeanIdentity getIdentity(Path containingProperty) throws Exception {
    return
      getWeblogicBeanTypes()
        .getWeblogicConfigBeanIdentityFromUnfoldedBeanPathWithIdentities(containingProperty);
  }
}
