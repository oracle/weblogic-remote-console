// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing the ServerMBean
 */
public class ServerMBeanCustomizer {
  private static final String IDENTITY = "identity";

  private ServerMBeanCustomizer() {
  }

  // If an automatically created migratable target was created for a server,
  // it needs to be remove before the server can be removed.
  // This customizer handles this - i.e. deletes the migratable target
  // then deletes the server.
  public static Response<Void> deleteServer(
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
        Response<Void> response =
          beanEditorRepo.deleteBean(
            ic,
            migratableTarget.get(IDENTITY).asBeanTreePath()
          );
        if (!response.isSuccess()) {
          return response;
        }
      }
    }

    // Now we can delete the server.
    return beanEditorRepo.deleteBean(ic, ic.getBeanTreePath());
  }
}
