// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * Utility code called by the AggregatedMBean JAXRS resources to invoke an action on an mbean on a server.
 */
public class AggregatedMBeanInvokeActionHelper extends InvokeActionHelper {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;

  public AggregatedMBeanInvokeActionHelper(InvocationContext ic, String action, JsonObject requestBody) {
    super(ic, action, requestBody);
  }

  @Override
  protected InvocationContext getSliceTableRowIC(String rowIdentifier) {
    BeanTreePath aggBTP = getInvocationContext().getBeanTreePath();
    Path unaggPath = NAME_HANDLER.getUnaggregatedBeanTreePath(aggBTP).getPath();
    
    // fill in the server name, i.e. DomainRuntime.CombinedServerRuntimes.<ServerName>.Foo.Bar
    unaggPath.getComponents().set(2, rowIdentifier);

    // delegate the action to the unagg bean's collection or singleton
    InvocationContext unaggIc = new InvocationContext(getInvocationContext());
    unaggIc.setIdentity(BeanTreePath.create(aggBTP.getBeanRepo(), unaggPath));
    unaggIc.setIdentifier(null);
    unaggIc.setPagePath(getUnaggPagePath(unaggIc));
    return unaggIc;
  }

  private PagePath getUnaggPagePath(InvocationContext unaggIc) {
    BeanTreePath unaggBTP = unaggIc.getBeanTreePath();
    if (unaggBTP.isCollectionChild()) {
      // Return the table for aggregated collection children
      return
        unaggIc.getPageRepo().getPageRepoDef().newTablePagePath(
          unaggIc.getBeanTreePath().getTypeDef()
        );
    } else {
      // Return the default slice for aggregated singletons
      return
        unaggIc.getPageRepo().getPageRepoDef().newSlicePagePath(
          unaggIc.getBeanTreePath().getTypeDef(),
          new Path()
        );
    }
  }
}
