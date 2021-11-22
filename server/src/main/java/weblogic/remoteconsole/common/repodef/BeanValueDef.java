// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a value (e.g. a property value, an
 * action parameter value or an action return value)
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanValueDef {

  // Returns whether this value is a string
  public default boolean isString() {
    return ValueKind.STRING == getValueKind();
  }

  // Returns whether this value is an integer.
  public default boolean isInt() {
    return ValueKind.INT == getValueKind();
  }

  // Returns whether this value is a long.
  public default boolean isLong() {
    return ValueKind.LONG == getValueKind();
  }

  // Returns whether this value is a double.
  public default boolean isDouble() {
    return ValueKind.DOUBLE == getValueKind();
  }

  // Returns whether this value is a boolean.
  public default boolean isBoolean() {
    return ValueKind.BOOLEAN == getValueKind();
  }

  // FortifyIssueSuppression(0B1B0FB71A1F873A0413292B9E124AFE) Password Management: Password in Comment
  // Not a password, just an argument
  // Returns whether this value is a secret (e.g. a password)
  public default boolean isSecret() {
    return ValueKind.SECRET == getValueKind();
  }

  // Returns whether this value is a date.
  public default boolean isDate() {
    return ValueKind.DATE == getValueKind();
  }

  // Returns whether this value is a set of name / value pairs.
  public default boolean isProperties() {
    return ValueKind.PROPERTIES == getValueKind();
  }

  // Determines whether this value is a reference to a bean instance.
  public default boolean isReference() {
    return ValueKind.REFERENCE == getValueKind();
  }

  // Determines whether this value is a java.lang.Throwable
  public default boolean isThrowable() {
    return ValueKind.THROWABLE == getValueKind();
  }

  // Determines whether this value is a stream containing
  // the contents of a file.
  public default boolean isFileContents() {
    return ValueKind.FILE_CONTENTS == getValueKind();
  }

  // Determines whether this value is a health state structure.
  public default boolean isHealthState() {
    return ValueKind.HEALTH_STATE == getValueKind();
  }

  // Determines whether this value is void (e.g. a void method)
  public default boolean isVoid() {
    return ValueKind.VOID == getValueKind();
  }

  // enum of the different kinds of values
  public enum ValueKind {
    STRING,
    INT,
    LONG,
    DOUBLE,
    BOOLEAN,
    SECRET,
    DATE,
    PROPERTIES,
    REFERENCE,
    THROWABLE,
    FILE_CONTENTS,
    HEALTH_STATE,
    VOID
  }

  // Get this value's kind
  public ValueKind getValueKind();

  // Returns whether this is an array (e.g. array of references, or array of strings)
  public boolean isArray();

  // If this value is a reference, what is the base bean type of
  // the beans it can refer to.
  public BeanTypeDef getReferenceTypeDef(); // only for Reference/References

  // Determines whether a property that the bean repo handles as
  // an array of references really only can hold zero or one reference
  // therefore should be presented to the user as a single reference.
  //
  // This is needed because some WebLogic JMS bean array of reference properties
  // will only accept zero or one reference.
  public boolean isReferenceAsReferences();

  // Determines whether a property that the bean repo handles as a long
  // really holds a date, thus should be presented to the user as a date.
  public boolean isDateAsLong();
}
