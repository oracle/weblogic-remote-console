// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/** 
 * Custom code for processing the JMSDestinationRuntimeMBean
 */
public class JMSDestinationRuntimeMBeanCustomizer {

  private JMSDestinationRuntimeMBeanCustomizer() {
  }

  public static Response<SettableValue> getDestinationName(
    @Source(property = "Name") SettableValue nameVal
  ) {
    // Uniform distributed queue and topic names look like JMSModule!JMSServerOrSubDeployment@QueueOrTopic
    // Normal queue and topic names look like JMSModule!QueueOrTopic
    String name = StringUtils.nonNull(nameVal.getValue().asString().getValue());
    int idx = name.lastIndexOf("@");
    if (idx == -1) {
      idx = name.lastIndexOf("!");
    }
    if (idx != -1) {
      name = name.substring(idx + 1, name.length());
    }
    return new Response<SettableValue>().setSuccess(new SettableValue(new StringValue(name)));
  }
}
