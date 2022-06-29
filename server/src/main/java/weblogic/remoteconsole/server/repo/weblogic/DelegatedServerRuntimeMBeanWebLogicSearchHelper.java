// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;

import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerRuntimeMBeanNameHandler;

/**
 * Helps conduct searches for the mbeans delegate
 * from DomainRuntime.CombinedServerRuntimes.<server>.ServerRuntime.<rest of path>
 * to   DomainRuntime.ServerRuntimes.<server>.<rest of path>
 */
class DelegatedServerRuntimeMBeanWebLogicSearchHelper extends DelegatedRuntimeMBeanWebLogicSearchHelper {

  DelegatedServerRuntimeMBeanWebLogicSearchHelper() {
    super(DelegatedServerRuntimeMBeanNameHandler.INSTANCE, new IdentityFixer());
  }

  private static class IdentityFixer extends DelegatedIdentityFixer {
    @Override protected JsonArray undelegatedIdentityToDelegatedIdentity(JsonArray undelegatedIdentity) {
      // e.g. convert from
      //   serverRuntimes Server1 JVMRuntime
      // to
      //   combinedServerRuntimes Server1 serverRuntime JVMRuntime
      JsonArrayBuilder bldr = Json.createArrayBuilder();
      bldr.add("combinedServerRuntimes");
      String server = undelegatedIdentity.getString(1);
      bldr.add(server);
      bldr.add("serverRuntime");
      for (int i = 2; i < undelegatedIdentity.size(); i++) {
        bldr.add(undelegatedIdentity.getString(i));
      }
      return bldr.build();
    }
  }
}
