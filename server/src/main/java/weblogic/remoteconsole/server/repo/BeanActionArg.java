// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanActionParamDef;

/**
 * This class holds an input argument for invoking an action.
 */
public class BeanActionArg {

  private BeanActionParamDef paramDef;
  private Value value;

  public BeanActionArg(BeanActionParamDef paramDef, Value value) {
    this.paramDef = paramDef;
    this.value = value;
  }

  public BeanActionParamDef getParamDef() {
    return paramDef;
  }

  public Value getValue() {
    return value;
  }

  @Override
  public String toString() {
    return "BeanActionArg(" + paramDef.getParamName() + "," + value + ")";
  }
}
