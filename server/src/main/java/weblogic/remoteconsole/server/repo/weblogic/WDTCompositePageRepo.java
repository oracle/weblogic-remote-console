// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.weblogic.WDTCompositePageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageReaderRepo;

/**
 * This class manages a WDT model from a ordered list of of models.
 */
public class WDTCompositePageRepo extends PageReaderRepo {
  public WDTCompositePageRepo(
    WebLogicMBeansVersion mbeansVersion,
    List<Map<String, Object>> models,
    InvocationContext ic
  ) {
    super(
      mbeansVersion.findOrCreate(WDTCompositePageRepoDef.class),
      new WDTCompositeTreeBeanRepo(mbeansVersion, models, ic)
    );
  }
}
