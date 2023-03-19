// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import javax.json.JsonValue;

/**
 * This class holds an EntitleNet expression.
 * Its in-memory form is the same as it's RDJ json form.
 * 
 * If there is an expression, it's a JsonObject with this structure:
 *   {
 *     "string" : "...", // The string form of the expression
 *     "parsed" : { ... } // The parsed form of the expression
 *   }
 * 
 * If there is not an expression, then it's JsonValue.NULL.
 * 
 * TBD - would it be easier for the CFE if we used this instead?
 *   {
 *     "string": null,
 *     "parsed": null
 *   }
 */
public class EntitleNetExpressionValue extends Value {
  private JsonValue value;

  public EntitleNetExpressionValue(JsonValue value) {
    this.value = value;
  }

  public JsonValue getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "EntitleNetExpressionValue<" + getValue() + ">";
  }
}
