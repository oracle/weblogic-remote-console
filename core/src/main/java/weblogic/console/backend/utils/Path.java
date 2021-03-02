// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * General purpose path utilities needed by the console backend.
 * <p>
 * A path is an ordered list of strings that identify something.
 */
public class Path {

  private List<String> components = new ArrayList<>();

  public Path() {
  }

  public Path(String dotSeparatedPath) {
    this(StringUtils.notEmpty(dotSeparatedPath) ? dotSeparatedPath.split("\\.") : (String[]) null);
  }

  public Path(Path toClone) {
    this(toClone.getComponents());
  }

  public Path childPath(String component) {
    Path c = new Path(this);
    c.addComponent(component);
    return c;
  }

  public Path childPath(Path child) {
    Path c = new Path(this);
    c.addComponents(child.getComponents());
    return c;
  }

  public Path subPath(int fromIndex, int toIndex) {
    if (toIndex == -1) {
      toIndex = getComponents().size();
    }
    return new Path(getComponents().subList(fromIndex, toIndex));
  }

  private Path(String[] components) {
    addComponents(components);
  }

  private Path(List<String> components) {
    addComponents(components);
  }

  public void addPath(Path path) {
    addComponents(path.getComponents());
  }

  public void addComponents(String... components) {
    addComponents(components != null ? Arrays.asList(components) : (List<String>) null);
  }

  public void addComponents(List<String> components) {
    if (components != null) {
      for (String component : components) {
        addComponent(component);
      }
    }
  }

  public void addComponent(String component) {
    if (StringUtils.notEmpty(component)) {
      this.components.add(component);
    }
  }

  public String getLastComponent() {
    if (getComponents().isEmpty()) {
      return null;
    } else {
      return getComponents().get(getComponents().size() - 1);
    }
  }

  public String getFirstComponent() {
    if (getComponents().isEmpty()) {
      return null;
    } else {
      return getComponents().get(0);
    }
  }

  public List<String> getComponents() {
    return this.components;
  }

  public Path getParent() {
    Path parent = new Path();
    for (int i = 0; i < getComponents().size() - 1; i++) {
      parent.addComponent(getComponents().get(i));
    }
    return parent;
  }

  public String getDotSeparatedPath() {
    return getPath(getComponents(), ".");
  }

  public String getSlashSeparatedPath() {
    return getPath(getComponents(), "/");
  }

  public String getRelativeUri() throws Exception {
    List<String> components = new ArrayList<>();
    for (String component : getComponents()) {
      components.add(StringUtils.urlEncode(component));
    }
    return getPath(components, "/");
  }

  public boolean isEmpty() {
    return getComponents().isEmpty();
  }

  public int length() {
    return getComponents().size();
  }

  private String getPath(List<String> components, String separator) {
    StringBuilder sb = new StringBuilder();
    boolean first = true;
    for (String component : components) {
      if (!first) {
        sb.append(separator);
      }
      sb.append(component);
      first = false;
    }
    return sb.toString();
  }

  @Override
  public String toString() {
    return this.getDotSeparatedPath();
  }
}
