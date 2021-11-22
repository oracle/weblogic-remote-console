// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a value.
 *
 * It's the base class of the various kinds of values.
 * 
 * Values are used to:
 * - send form property values in JAXRS endpoints' request bodies to the page repos
 * - send bean property values from the page repos to the bean repos
 * - return bean property values from the bean repos to the page repos
 * - return form property values from the page repos to the JAXRS endpoints
 */
public class Value {

  // Returns whether this value is a string.
  public boolean isString() {
    return (this instanceof StringValue);
  }

  // Converts this value to a StringValue.
  // Throws a ClassCastException if this value isn't a StringValue.
  public StringValue asString() {
    return (StringValue)this;
  }

  // Returns whether this value is a boolean.
  public boolean isBoolean() {
    return (this instanceof BooleanValue);
  }

  // Converts this value to a BooleanValue.
  // Throws a ClassCastException if this value isn't a BooleanValue.
  public BooleanValue asBoolean() {
    return (BooleanValue)this;
  }

  // Returns whether this value is an integer .
  public boolean isInt() {
    return (this instanceof IntValue);
  }

  // Converts this value to an IntValue.
  // Throws a ClassCastException if this value isn't an IntValue.
  public IntValue asInt() {
    return (IntValue)this;
  }

  // Returns whether this value is a long.
  public boolean isLong() {
    return (this instanceof LongValue);
  }

  // Converts this value to a LongValue.
  // Throws a ClassCastException if this value isn't a LongValue.
  public LongValue asLong() {
    return (LongValue)this;
  }

  // Returns whether this value is a double.
  public boolean isDouble() {
    return (this instanceof DoubleValue);
  }

  // Converts this value to a DoubleValue.
  // Throws a ClassCastException if this value isn't a DoubleValue.
  public DoubleValue asDouble() {
    return (DoubleValue)this;
  }

  // Returns whether this value is a secret.
  public boolean isSecret() {
    return (this instanceof SecretValue);
  }

  // Converts this value to a SecretValue.
  // Throws a ClassCastException if this value isn't a SecretValue.
  public SecretValue asSecret() {
    return (SecretValue)this;
  }

  // Returns whether this value is a set of properties
  // (i.e. list of name/value pairs).
  public boolean isProperties() {
    return (this instanceof PropertiesValue);
  }

  // Converts this value to a PropertiesValue.
  // Throws a ClassCastException if this value isn't a PropertiesValue.
  public PropertiesValue asProperties() {
    return (PropertiesValue)this;
  }

  // Returns whether this value is a date.
  public boolean isDate() {
    return (this instanceof DateValue);
  }

  // Converts this value to a DateValue.
  // Throws a ClassCastException if this value isn't a DateValue.
  public DateValue asDate() {
    return (DateValue)this;
  }

  // Returns whether this value is a long that really holds a date.
  public boolean isDateAsLong() {
    return (this instanceof DateAsLongValue);
  }

  // Converts this value to a DateAsLongValue.
  // Throws a ClassCastException if this value isn't a DateAsLongValue.
  public DateAsLongValue asDateAsLong() {
    return (DateAsLongValue)this;
  }

  // Returns whether this value is a null reference.
  public boolean isNullReference() {
    return (this instanceof NullReference);
  }

  // Converts this value to a NullReference.
  // Throws a ClassCastException if this value isn't a NullReference.
  public NullReference asNullReference() {
    return (NullReference)this;
  }

  // Returns whether this value is a bean tree path
  // (i.e. is a reference to an existing bean).
  public boolean isBeanTreePath() {
    return (this instanceof BeanTreePath);
  }

  // Converts this value to a BeanTreePath.
  // Throws a ClassCastException if this value isn't a BeanTreePath.
  public BeanTreePath asBeanTreePath() {
    return (BeanTreePath)this;
  }

  // Returns whether this value is an unresolved reference.
  public boolean isUnresolvedReference() {
    return (this instanceof UnresolvedReference);
  }

  // Converts this value to an UnresolvedReference.
  // Throws a ClassCastException if this value isn't an UnresolvedReference.
  public UnresolvedReference asUnresolvedReference() {
    return (UnresolvedReference)this;
  }

  // Returns whether this value is a single reference that's
  // represented as an array of references.
  public boolean isReferenceAsReferences() {
    return (this instanceof ReferenceAsReferencesValue);
  }

  // Converts this value to a ReferenceAsReferencesValue.
  // Throws a ClassCastException if this value isn't a ReferenceAsReferencesValue.
  public ReferenceAsReferencesValue asReferenceAsReferences() {
    return (ReferenceAsReferencesValue)this;
  }

  // Returns whether this value is an array.
  public boolean isArray() {
    return (this instanceof ArrayValue);
  }

  // Converts this value to an ArrayValue.
  // Throws a ClassCastException if this value isn't an ArrayValue.
  public ArrayValue asArray() {
    return (ArrayValue)this;
  }

  // Returns whether this value is a settable value
  // (i.e. can specify whether the value has been set on the bean)
  public boolean isSettable() {
    return (this instanceof SettableValue);
  }

  // Converts this value to a SettableValue.
  // Throws a ClassCastException if this value isn't a SettableValue.
  public SettableValue asSettable() {
    return (SettableValue)this;
  }

  // Returns whether this value is a WDT model token.
  public boolean isModelToken() {
    return (this instanceof ModelToken);
  }

  // Converts this value to a ModelToken.
  // Throws a ClassCastException if this value isn't a ModelToken.
  public ModelToken asModelToken() {
    return (ModelToken)this;
  }

  // Returns whether this value is a throwable.
  public boolean isThrowable() {
    return (this instanceof ThrowableValue);
  }

  // Converts this value to a ThrowableValue.
  // Throws a ClassCastException if this value isn't a ThrowableValue.
  public ThrowableValue asThrowable() {
    return (ThrowableValue)this;
  }

  // Returns whether this value is a health state.
  public boolean isHealthState() {
    return (this instanceof HealthStateValue);
  }

  // Converts this value to a HealthStateValue.
  // Throws a ClassCastException if this value isn't a HealthStateValue.
  public HealthStateValue asHealthState() {
    return (HealthStateValue)this;
  }

  // Returns whether this value is a stream containing the contents of a file.
  public boolean isFileContents() {
    return (this instanceof FileContentsValue);
  }

  // Converts this value to a FileContentsValue.
  // Throws a ClassCastException if this value isn't a FileContentsValue.
  public FileContentsValue asFileContents() {
    return (FileContentsValue)this;
  }

  // Returns whether this value is not knowns
  // (e.g. an unset property that has a derived default)
  public boolean isUnknown() {
    return (this instanceof UnknownValue);
  }

  // Converts this value to an UnknownValue.
  // Throws a ClassCastException if this value isn't an UnknownValue.
  public UnknownValue asUnknown() {
    return (UnknownValue)this;
  }

  public static SettableValue settableValue(Value value) {
    if (value == null) {
      return null;
    }
    if (value.isSettable()) {
      return value.asSettable();
    }
    return new SettableValue(value);
  }

  public static Value unsettableValue(Value value) {
    if (value == null) {
      return null;
    }
    if (value.isSettable()) {
      return value.asSettable().getValue();
    }
    return value;
  }

  AssertionError unsupported(String type) {
    return new AssertionError("Value is not a " + type);
  }
}
