// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds all the data on a form page (create form or slice form).
 */
public class Form extends Page {
  private boolean exists = true;
  private ModelTokens modelTokens = null;
  private List<FormProperty> properties = new ArrayList<>();

  // Returns the values of the properties on the form.
  public List<FormProperty> getProperties() {
    return this.properties;
  }

  // Returns whether the corresponding bean exists.
  // If false and the bean is an optional singleton, then we
  // won't include the "data" in the response (signals to the CFE
  // that the optional singleton doesn't exist)
  public boolean isExists() {
    return exists;
  }

  public void setExists(boolean val) {
    exists = val;
  }

  public ModelTokens getModelTokens() {
    return modelTokens;
  }

  public void setModelTokens(ModelTokens modelTokens) {
    this.modelTokens = modelTokens;
  }

  @Override
  public String toString() {
    return "Form<" + getPageDef() + "," + getBeanTreePath() + ">";
  }
}
