// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes an field of a bean .
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanFieldDef extends BeanValueDef {

  // The name that is used to identify this field in forms in the HTTP api.
  public String getFormFieldName();

  // Whether this property's value must be specified.
  public boolean isRequired();

  // Returns whether this field is a property.
  public default boolean isBeanPropertyDef() {
    return (this instanceof BeanPropertyDef);
  }

  // Converts this field to a property.
  // Throws a ClassCastException if this page path is not a BeanPropertyDef
  public default BeanPropertyDef asBeanPropertyDef() {
    return (BeanPropertyDef)this;
  }

  // Returns whether this field is an action parameter.
  public default boolean isBeanActionParamDef() {
    return (this instanceof BeanActionParamDef);
  }

  // Converts this field to a property.
  // Throws a ClassCastException if this page path is not a BeanActionParamDef
  public default BeanActionParamDef asBeanActionParamDef() {
    return (BeanActionParamDef)this;
  }

  // Returns whether this field is a property.
  public default boolean isPagePropertyDef() {
    return (this instanceof PagePropertyDef);
  }

  // Converts this field to a property.
  // Throws a ClassCastException if this page path is not a PagePropertyDef
  public default PagePropertyDef asPagePropertyDef() {
    return (PagePropertyDef)this;
  }

  // Returns whether this field is an action parameter.
  public default boolean isPageActionParamDef() {
    return (this instanceof PageActionParamDef);
  }

  // Converts this field to a property.
  // Throws a ClassCastException if this page path is not a PageActionParamDef
  public default PageActionParamDef asPageActionParamDef() {
    return (PageActionParamDef)this;
  }
}
