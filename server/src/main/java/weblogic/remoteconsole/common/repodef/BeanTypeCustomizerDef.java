// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes how to invoke custom code to manage a feature of a bean type.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanTypeCustomizerDef extends CustomizerDef {

  // Returns the type that this customizer applies to.
  public BeanTypeDef getTypeDef();
}
