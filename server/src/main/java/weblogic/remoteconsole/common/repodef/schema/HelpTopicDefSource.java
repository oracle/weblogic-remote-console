// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a link to a WebLogic help topic external to the remote console.
 */
public class HelpTopicDefSource {

  public enum Type {
    edocs,
    generic
  }

  private StringValue href = new StringValue();
  private Value<Type> type = new Value<>(Type.edocs);
  private StringValue label = new StringValue();

  // The relative URL of the external help relative to 'type'
  // and the version of WebLogic that the user has connected to.

  public String getHref() {
    return href.getValue();
  }

  public void setHref(String value) {
    href.setValue(value);
  }

  // The type of WebLogic help it references.

  public Type getType() {
    return type.getValue();
  }

  public void setType(Type value) {
    type.setValue(value);
  }

  // The english label to display in the remote console
  // for this external help link.

  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }
}
