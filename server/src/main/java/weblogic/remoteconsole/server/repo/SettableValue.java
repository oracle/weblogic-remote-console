// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a settable value, i.e. one that can indicate whether the value
 * has been set or not, e.g. in config.xml or in a WDT model.
 * 
 * It also may say that we don't know whether the value has been set.
 * For example, some of the WLDF beans don't extend SettableBean therefore
 * don't support finding out if their properties have been set.
 */
public class SettableValue extends Value {

  public enum State {
    SET,
    UNSET,
    UNKNOWN
  }

  private Value value;
  private State state = State.UNKNOWN;

  public SettableValue(Value value) {
    this.value = value;
  }

  public SettableValue(Value value, boolean set) {
    this(value, (set) ? State.SET : State.UNSET);
  }

  public SettableValue(Value value, State state) {
    this(value);
    this.state = state;
  }

  public Value getValue() {
    return this.value;
  }

  public boolean isSet() {
    return getState() == State.SET;
  }

  public boolean isUnset() {
    return getState() == State.UNSET;
  }

  public State getState() {
    return state;
  }

  @Override
  public String toString() {
    return "SettableValue<" + getValue() + "," + getState() + ">";
  }
}
