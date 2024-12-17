// Copyright (c) 2020, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the ServerMBean
 */
public class ServerMBeanCustomizer {
  private static final String IDENTITY = "identity";

  private ServerMBeanCustomizer() {
  }

  // Customize the writable ServerMBean JAXRS resources
  public static BaseResource createResource(InvocationContext ic) {
    BeanTreePath btp = ic.getBeanTreePath();
    if (btp.isCreatable() && btp.isCollection()) {
      return new ServerMBeanCreatableBeanCollectionResource();
    } else if (btp.isDeletable() && btp.isCollectionChild()) {
      return new ServerMBeanDeletableCollectionChildBeanResource();
    } else {
      return null;
    }
  }

  // If an automatically created migratable target was created for a server,
  // it needs to be removed before the server can be removed.
  // This customizer handles this - i.e. deletes the migratable target
  // then deletes the server.
  public static void deleteServer(
    InvocationContext ic,
    @Source(
      collection = "/Domain/MigratableTargets",
      properties = {IDENTITY}
    ) List<Map<String,Value>> migratableTargets
  ) {
    BeanEditorRepo beanEditorRepo =
      ic.getPageRepo().getBeanRepo().asBeanEditorRepo();

    // Get the name of the server that we're about to delete
    String serverName = ic.getBeanTreePath().getLastSegment().getKey();

    // Get the name of the corresponding automatically created migratable target.
    String migratableTargetName = serverName + " (migratable)";

    // Loop over the migratable targets.
    // If it's the automatically created one for this server, delete it.
    for (Map<String,Value> migratableTarget : migratableTargets) {
      String name = migratableTarget.get(IDENTITY).asBeanTreePath().getLastSegment().getKey();
      if (migratableTargetName.equals(name)) {
        beanEditorRepo.deleteBean(ic, migratableTarget.get(IDENTITY).asBeanTreePath()).getResults();
      }
    }

    // Now we can delete the server.
    beanEditorRepo.deleteBean(ic, ic.getBeanTreePath()).getResults();
  }

  public static SettableValue getHostnameVerifierType(
    @Source(
      property = "SSL.HostnameVerifier"
    ) SettableValue hostnameVerifier
  ) {
    return HostnameVerifierCustomizer.getHostnameVerifierType(hostnameVerifier);
  }

  public static SettableValue getCustomHostnameVerifier(
    @Source(
      property = "SSL.HostnameVerifier"
    ) SettableValue hostnameVerifier
  ) {
    return HostnameVerifierCustomizer.getCustomHostnameVerifier(hostnameVerifier);
  }

  public static SettableValue getDomainAdministrationPortEnabled(InvocationContext ic)  {
    BeanRepo beanRepo = ic.getBeanTreePath().getBeanRepo();
    BeanReaderRepoSearchBuilder builder = beanRepo.asBeanReaderRepo().createSearchBuilder(ic, false);
    BeanPropertyDef adminPortEnabledPropertyDef =
      beanRepo.getBeanRepoDef().getTypeDef("DomainMBean").getPropertyDef(new Path("AdministrationPortEnabled"));
    BeanTreePath domainBTP = BeanTreePath.create(beanRepo, new Path("Domain"));
    builder.addProperty(domainBTP, adminPortEnabledPropertyDef);
    BeanSearchResults searchResults = builder.search().getResults().getBean(domainBTP);
    Value administrationPortEnabledV = searchResults.getValue(adminPortEnabledPropertyDef);
    return new SettableValue(administrationPortEnabledV);
  }
}
