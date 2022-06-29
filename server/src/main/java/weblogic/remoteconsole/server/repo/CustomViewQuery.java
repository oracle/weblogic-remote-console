// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Collections;
import java.util.List;

/**
 * POJO that holds information about a custom view's query
 * (i.e. the filtering rules for selecting matching beans
 * based on their bean tree paths and on their property values)
 */
public class CustomViewQuery {
  private String name;
  private CustomViewDef viewDef;
  private List<CustomViewPathSegment> path;
  private List<CustomViewProperty> properties;

  public CustomViewQuery(
    CustomViewDef viewDef,
    String name,
    List<CustomViewPathSegment> path,
    List<CustomViewProperty> properties
  ) {
    this.viewDef = viewDef;
    this.name = name;
    this.path = Collections.unmodifiableList(path);
    this.properties = Collections.unmodifiableList(properties);
  }

  // The view's name
  public String getName() {
    return name;
  }

  public CustomViewDef getViewDef() {
    return viewDef;
  }

  // The filtering rules for selecting beans based on their bean tree path:
  public List<CustomViewPathSegment> getPath() {
    return path;
  }

  // The filtering rules for selecting beans based on their property values:
  public List<CustomViewProperty> getProperties() {
    return properties;
  }
}
