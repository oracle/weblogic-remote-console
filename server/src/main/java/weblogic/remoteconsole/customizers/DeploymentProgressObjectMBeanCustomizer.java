// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for processing the DeploymentProgressObjectMBean.
 */
public class DeploymentProgressObjectMBeanCustomizer {

  private DeploymentProgressObjectMBeanCustomizer() {
  }

  // The mbean returns a lot of repeated messages.
  // Weed out the repeats.
  public static SettableValue getDeploymentMessages(
    @Source(property = "DeploymentMessages") SettableValue messages
  ) {
    ArrayList<Value> uniqueMessages = new ArrayList<>(); 
    HashSet<String> seenMessages = new HashSet<>();
    for (Value value : messages.getValue().asArray().getValues()) {
      String message = value.asString().getValue();
      if (!seenMessages.contains(message)) {
        seenMessages.add(message);
        uniqueMessages.add(value);
      }
    }
    return new SettableValue(new ArrayValue(uniqueMessages), false);
  }

  public static Value purgeCompletedDeploymentProgressObjects(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    BeanTreePath dmBTP =
        BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.DeploymentManager"));
    InvocationContext dmIC = new InvocationContext(ic, dmBTP);
    BeanActionDef actionDef =
        dmBTP.getTypeDef().getActionDef(new Path("purgeCompletedDeploymentProgressObjects"));
    List<BeanActionArg> args = new ArrayList<>();
    return  dmIC.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(dmIC, actionDef, args).getResults();
  }

}
