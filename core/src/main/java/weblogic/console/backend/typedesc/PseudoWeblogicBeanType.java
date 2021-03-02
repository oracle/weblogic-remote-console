// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.List;

/**
 * This class holds the effective description of a pseudo Weblogic bean type, i.e. one defined in a
 * pseudo-type.yaml file, e.g. JDBCGenericSystemResourcePseudoMBean/pseudo-type.yaml
 */
public class PseudoWeblogicBeanType extends WeblogicBeanType {

  private WeblogicBeanType baseType;
  private ConsolePseudoWeblogicBeanType consolePseudoType;

  /*package*/ WeblogicBeanType getBaseType() {
    return this.baseType;
  }

  /*package*/ ConsolePseudoWeblogicBeanType getConsolePseudoType() {
    return this.consolePseudoType;
  }

  @Override
  public String getName() {
    return getConsolePseudoType().getName();
  }

  @Override
  public WeblogicBeanType getActualWeblogicBeanType() {
    return getBaseType();
  }

  @Override
  protected String do_getSubTypeDiscriminatorPropertyName() {
    return null;
  }

  @Override
  protected List<SubType> do_getSubTypes() {
    return null;
  }

  public PseudoWeblogicBeanType(
    WeblogicBeanType baseType,
    ConsolePseudoWeblogicBeanType consolePseudoType
  ) {
    super(baseType.getTypes(), baseType.getHarvestedType(), baseType.getConsoleType());
    this.baseType = baseType;
    this.consolePseudoType = consolePseudoType;
  }
}
