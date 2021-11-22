// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes how to invoke custom code to manage deleting a bean.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface DeleteBeanCustomizerDef extends CustomizerDef {

  // Returns the type this customizer applies to.
  public BeanTypeDef getTypeDef();
}
