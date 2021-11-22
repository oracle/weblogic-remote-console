// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRuntimeTreeBeanRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/**
 * This class uses the WLS REST api to view and invoke operations on
 * the beans in the domain runtime and server config trees.
 */
public class WebLogicRestRuntimeTreeBeanRepo extends WebLogicRestBeanRepo {
  private static Map<String,String> rootBeanNameToWebLogicRestTreeNameMap = new HashMap<>();

  static {
    rootBeanNameToWebLogicRestTreeNameMap.put("DomainRuntime", "domainRuntime");
    rootBeanNameToWebLogicRestTreeNameMap.put("Domain", "serverConfig");
  }

  public WebLogicRestRuntimeTreeBeanRepo(WebLogicVersion version, Set<String> roles) {
    super(
      version.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class, roles),
      rootBeanNameToWebLogicRestTreeNameMap
    );
  }
}
