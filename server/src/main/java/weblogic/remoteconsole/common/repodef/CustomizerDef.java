// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.lang.reflect.Method;
import java.util.List;

/**
 * This interface describes how to invoke custom code on a method
 * that can define which parameters should be passed in (e.g.
 * ones that can use Source annotations to tell the infra what
 * property values to fetch and pass into the customizer).
 *
 * It contains all of the information that the different parts of the backend needs
 * (e.g. english resource bundle, PDJ, RDJ).
 */
public interface CustomizerDef {

  // Returns the static java customizer method to call.
  public Method getMethod();

  // Returns the descriptions of the parameters to pass to this java method.
  public List<ParamDef> getParamDefs();

  // Returns whether this customizer applies to a bean type
  // (or a child of a bean type, like a property)
  public default boolean isType() {
    return (this instanceof BeanTypeCustomizerDef);
  }

  // Convert this customizer to a bean type customizer.
  // Throws a ClassCastException if this customizer
  // isn't a BeanTypeCustomizerDef.
  public default BeanTypeCustomizerDef asType() {
    return (BeanTypeCustomizerDef)this;
  }

  // Returns whether this customizer applies to a bean property
  public default boolean isProperty() {
    return (this instanceof BeanPropertyCustomizerDef);
  }

  // Convert this customizer to a bean property customizer.
  // Throws a ClassCastException if this customizer
  // isn't a BeanPropertyCustomizerDef.
  public default BeanPropertyCustomizerDef asProperty() {
    return (BeanPropertyCustomizerDef)this;
  }

  // Returns whether this customizer customizes how to
  // get a property value.
  public default boolean isGetPropertyValue() {
    return (this instanceof GetPropertyValueCustomizerDef);
  }

  // Convert this customizer to a get property value customizer.
  // Throws a ClassCastException if this customizer
  // isn't a GetPropertyValueCustomizerDef.
  public default GetPropertyValueCustomizerDef asGetPropertyValue() {
    return (GetPropertyValueCustomizerDef)this;
  }

  // Returns whether this customizer customizes how to
  // get the options for a property value.
  public default boolean isGetPropertyOptions() {
    return (this instanceof GetPropertyOptionsCustomizerDef);
  }

  // Convert this customizer to a get property options customizer.
  // Throws a ClassCastException if this customizer
  // isn't a GetPropertyOptionsCustomizerDef.
  public default GetPropertyOptionsCustomizerDef asGetPropertyOptions() {
    return (GetPropertyOptionsCustomizerDef)this;
  }

  // Returns whether this customizer customizes how to
  // delete a bean of this type.
  public default boolean isDeleteBean() {
    return (this instanceof DeleteBeanCustomizerDef);
  }

  // Convert this customizer to a delete bean customizer.
  // Throws a ClassCastException if this customizer
  // isn't a DeleteBeanCustomizerDef.
  public default DeleteBeanCustomizerDef asDeleteBean() {
    return (DeleteBeanCustomizerDef)this;
  }
}
