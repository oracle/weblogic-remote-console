// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes customizer parameter that is
 * passed in when the customizer is invoked.
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface ParamDef {

  // Returns the correponsing customizer.
  public CustomizerDef getCustomizerDef();

  // Returns whether this is a collection param.
  public default boolean isCollection() {
    return (this instanceof CollectionParamDef);
  }

  // Convert this param to a collection param.
  // Throws a ClassCastException if the param is not a CollectionParamDef.
  public default CollectionParamDef asCollection() {
    return (CollectionParamDef)this;
  }

  // Returns whether this is a property param.
  public default boolean isProperty() {
    return (this instanceof PropertyParamDef);
  }

  // Convert this param to a property param.
  // Throws a ClassCastException if the param is not a PropertyParamDef.
  public default PropertyParamDef asProperty() {
    return (PropertyParamDef)this;
  }

  // Returns whether this param is an invocation context param.
  public default boolean isInvocationContext() {
    return (this instanceof InvocationContextParamDef);
  }

  // Convert this param to a .
  // Throws a ClassCastException if the param is not an InvocationContextParamDef.
  public default InvocationContextParamDef asInvocationContext() {
    return (InvocationContextParamDef)this;
  }
}
