// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a customizer parameter that passes in a property
 * of a collection child or singleton bean.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PropertyParamDef extends ParamDef {

  // The property that should be passed to the customizer.
  public BeanPropertyDef getPropertyDef();
}
