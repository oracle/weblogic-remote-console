// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

/**
 * This POJO mirrors the yaml file format for the default value of a weblogic bean property
 */
public class HarvestedDefaultValue {

  // The default value to use when the domain is running in secure mode.
  //
  // Null if the mbean doesn't provide a default value for secure mode.
  private HarvestedValue secureModeValue;

  public HarvestedValue getSecureModeValue() {
    return this.secureModeValue;
  }

  public void setSecureModeValue(HarvestedValue secureModeValue) {
    this.secureModeValue = secureModeValue;
  }

  // The default value to use then the domain is running in production mode.
  // i.e. a fallback to use if the domain isn't in secure mode or if there
  // isn't a secure mode default.
  //
  // Null if the mbean doesn't provide a default value for production mode.
  private HarvestedValue productionModeValue;

  public HarvestedValue getProductionModeValue() {
    return this.productionModeValue;
  }

  public void setProductionModeValue(HarvestedValue productionModeValue) {
    this.productionModeValue = productionModeValue;
  }

  // The default value to use.
  // i.e. a fallback when not using a secure mode default or a production mode default.
  //
  // Null if the mbean doesn't provide a default value.
  //
  // If there isn't a default value either, then the
  // default value should be whatever is appropriate for the
  // property's java type (e.g. null for a string, false for a boolean,
  // zero for a number).
  private HarvestedValue value;

  public HarvestedValue getValue() {
    return this.value;
  }

  public void setValue(HarvestedValue value) {
    this.value = value;
  }

  private boolean derivedDefault;

  public boolean isDerivedDefault() {
    return derivedDefault;
  }

  public void setDerivedDefault(boolean derivedDefault) {
    this.derivedDefault = derivedDefault;
  }
}
