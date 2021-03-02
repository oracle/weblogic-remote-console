// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.glassfish.jersey.server.ResourceConfig;
import weblogic.management.rest.lib.bean.Constants;
import weblogic.management.rest.lib.bean.utils.BeanResourceRegistry;
import weblogic.management.rest.lib.bean.utils.ResourceDef;

/**
 * Registers the console's weblogic REST extension's jaxrs resources with the WLS REST webapp.
 */
public class ResourceInitializer implements weblogic.management.rest.lib.utils.ResourceInitializer {
  @Override
  public void initialize(ResourceConfig resourceConfig) {
    registerCustomResources();
  }

  private void registerCustomResources() {
    BeanResourceRegistry registry = BeanResourceRegistry.instance();
    registerConsoleBackendResource(registry);
    registerConsoleChangeManagerResource(registry);
    customizeRealmProviders(registry);
  }

  private void registerConsoleBackendResource(BeanResourceRegistry registry) {
    // add it to all of the bean trees so that search can find it (so we don't need a 2nd RPC to get this data)
    registerConsoleBackendResource(registry, "weblogic.management.configuration.DomainMBean");
    registerConsoleBackendResource(registry, "weblogic.management.runtime.DomainRuntimeMBean");
    registerConsoleBackendResource(registry, "weblogic.management.runtime.ServerRuntimeMBean");
  }

  private void registerConsoleBackendResource(BeanResourceRegistry registry, String mbeanType) {
    registry.customResources().register(
      mbeanType,
      "consoleBackend",
      ResourceDef.resourceDef(null, ConsoleBackendResource.class)
    );
  }

  private void registerConsoleChangeManagerResource(BeanResourceRegistry registry) {
    // The edit tree is only on the admin server, so we don't need to also check
    // that this is the admin server.
    registry.customResources().register(
      "weblogic.management.configuration.DomainMBean",
      "consoleChangeManager",
      ResourceDef.resourceDef(null, ConsoleChangeManagerResource.class),
      Constants.BEAN_TREE_EDIT
    );
  }

  private void customizeRealmProviders(BeanResourceRegistry registry) {
    customizeRealmProviderCollectionChild(registry, "auditors");
    customizeRealmProviderCollectionChild(registry, "authenticationProviders");
    customizeRealmProviderCollectionChild(registry, "authorizers");
    customizeRealmProviderCollectionChild(registry, "certPathProviders");
    customizeRealmProviderCollectionChild(registry, "credentialMappers");
    customizeRealmProviderCollectionChild(registry, "passwordValidators");
    customizeRealmProviderCollectionChild(registry, "roleMappers");
    customizeRealmProviderSingletonChild(registry, "adjudicator");
  }

  private void customizeRealmProviderCollectionChild(BeanResourceRegistry registry, String collection) {
    registry.collectionChildResources().register(
      "weblogic.management.security.RealmMBean",
      collection,
      ResourceDef.resourceDef(null, ProviderCollectionChildResource.class)
    );
  }

  private void customizeRealmProviderSingletonChild(BeanResourceRegistry registry, String singleton) {
    registry.singletonChildResources().register(
      "weblogic.management.security.RealmMBean",
      singleton,
      ResourceDef.resourceDef(null, ProviderSingletonChildResource.class)
    );
  }
}
