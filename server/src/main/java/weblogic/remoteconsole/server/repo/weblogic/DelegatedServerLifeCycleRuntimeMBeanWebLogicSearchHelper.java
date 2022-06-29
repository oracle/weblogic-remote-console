// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;

import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerLifeCycleRuntimeMBeanNameHandler;

/**
 * Helps conduct searches for the mbeans delegate
 * from DomainRuntime.CombinedServerRuntimes.<server>.ServerLifeCycleRuntime.<rest of path>
 * to   DomainRuntime.ServerLifeCycleRuntimes.<server>.<rest of path>
 */
class DelegatedServerLifeCycleRuntimeMBeanWebLogicSearchHelper extends DelegatedRuntimeMBeanWebLogicSearchHelper {

  DelegatedServerLifeCycleRuntimeMBeanWebLogicSearchHelper() {
    super(DelegatedServerLifeCycleRuntimeMBeanNameHandler.INSTANCE, new IdentityFixer());
  }

  private static class IdentityFixer extends DelegatedIdentityFixer {
    @Override protected JsonArray undelegatedIdentityToDelegatedIdentity(JsonArray undelegatedIdentity) {
      // e.g. convert from
      //   serverLifeCycleRuntimes Server1 JVMRuntime
      // to
      //   combinedServerRuntimes Server1 serverLifeCycleRuntime JVMRuntime
      JsonArrayBuilder bldr = Json.createArrayBuilder();
      bldr.add("combinedServerRuntimes");
      String server = undelegatedIdentity.getString(1);
      bldr.add(server);
      bldr.add("serverLifeCycleRuntime");
      for (int i = 2; i < undelegatedIdentity.size(); i++) {
        bldr.add(undelegatedIdentity.getString(i));
      }
      return bldr.build();
    }
  }
}
