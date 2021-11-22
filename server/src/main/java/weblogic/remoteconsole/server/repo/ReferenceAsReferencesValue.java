// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds a Reference as an array of References.
 * <p>
 * This is used by some of the JMS mbean properties
 * that are arrays of references but are really
 * only allowed to hold zero or one reference.
 * <p>
 * That is, we want to present them on the page as a single reference
 * even thought the underlying bean repo says they're arrays of references.
 * <p>
 * The Reference can be a BeanTreePath or a NullReference
 * and when the list is empty a NullReference is supplied.
 */
public class ReferenceAsReferencesValue extends Value {
  private List<Value> values;

  public ReferenceAsReferencesValue(List<Value> values) {
    // Ensure that the list is empty or has a single value
    if ((values == null) || (values.size() > 1)) {
      throw new AssertionError("References list must be empty or contain a single Reference!");
    }
    this.values = values;
  }

  public ReferenceAsReferencesValue(Value value) {
    this.values = new ArrayList<Value>();
    if ((value != null) && !value.isNullReference()) {
      values.add(value);
    }
  }

  public Value asReference() {
    Value result = NullReference.INSTANCE;
    if ((this.values != null) && (this.values.size() > 0)) {
      result = this.values.get(0);
    }
    return result;
  }

  public List<Value> asReferences() {
    return this.values;
  }

  public boolean isNullReference() {
    boolean result = false;
    Value value = asReference();
    if ((value != null) && value.isNullReference()) {
      result = true;
    }
    return result;
  }

  public BeanTreePath asBeanTreePath() {
    BeanTreePath result = null;
    Value value = asReference();
    if ((value != null) && value.isBeanTreePath()) {
      result = value.asBeanTreePath();
    }
    return result;
  }

  @Override
  public String toString() {
    return "ReferenceAsReferencesValue<" + asReferences() + ">";
  }
}
