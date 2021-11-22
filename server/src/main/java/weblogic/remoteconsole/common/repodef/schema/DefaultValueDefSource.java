// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml file format for the default value of a bean property.
 */
public class DefaultValueDefSource {
  private Value<ValueDefSource> secureModeValue = new Value<>(null);
  private Value<ValueDefSource> productionModeValue = new Value<>(null);
  private Value<ValueDefSource> value = new Value<>(null);
  private BooleanValue derivedDefault = new BooleanValue();


  // The default value to use when the domain is running in secure mode.
  // Null if the mbean doesn't provide a default value for secure mode.
  // Should not be specified if derivedDefault is true.
  public ValueDefSource getSecureModeValue() {
    return secureModeValue.getValue();
  }

  public void setSecureModeValue(ValueDefSource val) {
    secureModeValue.setValue(val);
  }

  // The default value to use then the domain is running in production mode.
  // i.e. a fallback to use if the domain isn't in secure mode or if there
  // isn't a secure mode default.
  // Null if the mbean doesn't provide a default value for production mode.
  // Should not be specified if derivedDefault is true.
  public ValueDefSource getProductionModeValue() {
    return productionModeValue.getValue();
  }

  public void setProductionModeValue(ValueDefSource val) {
    productionModeValue.setValue(val);
  }

  // The default value to use.
  // i.e. a fallback when not using a secure mode default or a production mode default.
  //
  // Null if the mbean doesn't provide a default value.
  // Should not be specified if derivedDefault is true.
  //
  // If there isn't a default value either, then the
  // default value should be whatever is appropriate for the
  // property's java type (e.g. null for a string, false for a boolean,
  // zero for a number).
  //
  // Note: some mbean encrypted string properties have default values
  // that are byte arrays that contain the default string in cleartext.
  public ValueDefSource getValue() {
    return value.getValue();
  }

  public void setValue(ValueDefSource val) {
    value.setValue(val);
  }

  // Whether this property has a derived (i.e. computed) default value.
  // If true, then secure mode value, production mode value and value
  // must not be specified.
  public boolean isDerivedDefault() {
    return derivedDefault.getValue();
  }

  public void setDerivedDefault(boolean val) {
    derivedDefault.setValue(val);
  }
}
