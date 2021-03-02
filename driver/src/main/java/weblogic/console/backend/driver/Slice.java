// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains information that the UI needs a slice on a page,
 * including its label, name and whether it contains child slices.
 */
public class Slice {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  private String pageDescriptionURL;

  public String getPageDescriptionURL() {
    return pageDescriptionURL;
  }

  public void setPageDescriptionURL(String pageDescriptionURL) {
    this.pageDescriptionURL = pageDescriptionURL;
  }

  private List<Slice> slices = new ArrayList<>();

  public List<Slice> getSlices() {
    return slices;
  }

  public void setSlices(List<Slice> slices) {
    this.slices = slices;
  }
}
