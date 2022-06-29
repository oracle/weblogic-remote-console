// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * General purpose path utilities needed by the console backend.
 * <p>
 * A path is an ordered list of strings that identify something.
 */
public class Path  implements Comparable {

  private List<String> components = new ArrayList<>();

  public Path() {
  }

  public static Path fromRelativeUri(String relativeUri) {
    Path path = new Path();
    for (String encodedComponent : StringUtils.nonEmpty(relativeUri).split("/")) {
      path.addComponent(StringUtils.urlDecode(encodedComponent));
    }
    return path;
  }

  public Path(String dotSeparatedPath) {
    this(StringUtils.notEmpty(dotSeparatedPath) ? dotSeparatedPath.split("\\.") : (String[]) null);
  }

  public Path(Path toClone) {
    this(toClone.getComponents());
  }

  public Path clone() {
    return new Path(this);
  }

  public Path childPath(String component) {
    Path rtn = clone();
    rtn.addComponent(component);
    return rtn;
  }

  public Path childPath(Path child) {
    Path rtn = clone();
    rtn.addComponents(child.getComponents());
    return rtn;
  }

  public Path subPath(int fromIndex /* inclusive */, int toIndex /* exclusive */) {
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

  public String getUnderscoreSeparatedPath() {
    return getSeparatedPath("_");
  }

  public String getDotSeparatedPath() {
    return getSeparatedPath(".");
  }

  public String getSlashSeparatedPath() {
    return getSeparatedPath("/");
  }

  public String getSeparatedPath(String separator) {
    return getPath(getComponents(), separator);
  }

  public String getRelativeUri() {
    List<String> encodedComponents = new ArrayList<>();
    for (String component : getComponents()) {
      encodedComponents.add(StringUtils.urlEncode(component));
    }
    return getPath(encodedComponents, "/");
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
  public int compareTo(Object obj) {
    if (obj == null) {
      throw new NullPointerException();
    }
    Path path = Path.class.cast(obj);
    List<String> lhs = getComponents(); // left hand side = this
    List<String> rhs = path.getComponents(); // right hand side = obj
    // compare all the segments up to the size of the shortest of lhs/rhs
    int size = Math.min(lhs.size(), rhs.size());
    for (int i = 0; i < size; i++) {
      int comp = lhs.get(i).compareTo(rhs.get(i));
      if (comp != 0) {
        return comp;
      }
    }
    if (lhs.size() == size && rhs.size() == size) {
      return 0; // same path
    }
    if (lhs.size() > size) {
      // e.g. lhs = A/B/C, rhs = A/B -> A/B then A/B/C
      return 1; // lhs > rhs
    } else {
      // e.g. lhs = A/B, rhs = A/B/C -> A/B then A/B/C
      return -1; // lhs < rhs
    }
  }

  @Override
  public int hashCode() {
    int result = 1;
    for (String component : getComponents()) {
      result = result * component.hashCode();
    }
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == this) {
      return true;
    }
    if (!Path.class.isInstance(obj)) {
      return false;
    }
    Path other = Path.class.cast(obj);
    List<String> lhs = getComponents();
    List<String> rhs = other.getComponents();
    if (lhs.size() != rhs.size()) {
      return false;
    }
    for (int i = 0; i < lhs.size(); i++) {
      if (!lhs.get(i).equals(rhs.get(i))) {
        return false;
      }
    }
    return true;
  }

  @Override
  public String toString() {
    return this.getDotSeparatedPath();
  }
}
