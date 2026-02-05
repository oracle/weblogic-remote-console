// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a link to a WebLogic help topic external to the remote console.
 */
public class HelpTopicDefSource extends YamlSource {

  public enum Type {
    edocs,
    CoherenceEdocs,
    generic
  }

  private StringValue href = StringValue.create();
  private Value<Type> type = Value.create(Type.edocs);
  private StringValue label = StringValue.create();

  // The relative URL of the external help relative to 'type'
  // and the version of WebLogic that the user has connected to.

  public String getHref() {
    return href.getValue();
  }

  public void setHref(String value) {
    href = href.setValue(value);
  }

  // The type of WebLogic help it references.

  public Type getType() {
    return type.getValue();
  }

  public void setType(Type value) {
    type = type.setValue(value);
  }

  // The english label to display in the remote console
  // for this external help link.

  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label = label.setValue(value);
  }
}
