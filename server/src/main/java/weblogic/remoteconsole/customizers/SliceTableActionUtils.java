// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanActionParamDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Utilities to help implement slice table actions
 */
class SliceTableActionUtils {

  private SliceTableActionUtils() {
  }

  // Invokes a corresponding bean action that takes the row's identifier as a param
  // and whose other params are surfaced on the page level action. For example:
  //
  // JTARuntimeMBean has forceCommit(String xid, boolean global)
  // It's surfaced in the UI as forceCommitSelectedTransactions(boolean global)
  // The row's identifier is the same as the xid.
  static Response<Value> invokeRowAction(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties,
    String beanActionName,
    String identifierParamName
  ) {
    Response<Value> response = new Response<>();
    BeanTreePath btp = ic.getBeanTreePath();
    BeanActionDef beanActionDef = btp.getTypeDef().getActionDef(new Path(beanActionName));
    List<BeanActionArg> args = new ArrayList<>();
    for (BeanActionParamDef beanParamDef : beanActionDef.getParamDefs()) {
      if (identifierParamName.equals(beanParamDef.getParamName())) {
        args.add(
          new BeanActionArg(
            beanParamDef,
            new StringValue(ic.getIdentifier())
          )
        );
      } else {
        args.add(
          new BeanActionArg(
            beanParamDef,
            findParamValue(beanParamDef, formProperties)
          )
        );
      }
    }
    return ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, btp, beanActionDef, args);
  }

  private static Value findParamValue(
    BeanActionParamDef beanParamDef,
    List<FormProperty> formProperties
  ) {
    for (FormProperty formProperty : formProperties) {
      PageActionParamDef pageParamDef = formProperty.getFieldDef().asPageActionParamDef();
      if (beanParamDef.getParamName().equals(pageParamDef.getParamName())) {
        return formProperty.getValue().asSettable().getValue();
      }
    }
    throw new AssertionError("Could not find " + beanParamDef + " in " + formProperties);
  }
}
