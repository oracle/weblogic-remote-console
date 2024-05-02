// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for processing the RealmRuntimeMBean 
 */
public class RealmRuntimeMBeanCustomizer {

  private RealmRuntimeMBeanCustomizer() {
  }

  public static Response<Value> unlockUser(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Response<Value> response =
        delegateAction(ic,
            "UserLockoutManagerRuntime",
            "clearLockout",
            formProperties);
    if (response.isSuccess()) {
      response.addSuccessMessage(
        ic.getLocalizer().localizeString(LocalizedConstants.UNLOCK_USER_SUCCESS));
    }
    return response;
  }

  private static Response<Value> delegateAction(
    InvocationContext ic,
    String singletonChild,
    String action,
    List<FormProperty> pageArgs
  ) {
    BeanTreePath realPath = ic.getBeanTreePath().childPath(new Path(singletonChild));
    List<BeanActionArg> beanArgs = new ArrayList<>();
    for (FormProperty pageArg : pageArgs) {
      beanArgs.add(
        new BeanActionArg(
          pageArg.getFieldDef().asBeanActionParamDef(),
          pageArg.getValue().asSettable().getValue()
        )
      );
    }
    return
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        realPath,
        realPath.getTypeDef().getActionDef(new Path(action)),
        beanArgs
      );
  }
}
