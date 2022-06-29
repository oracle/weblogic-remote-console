// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This class holds a template that can be combined with a
 * bean tree path to construct related bean tree paths.
 *
 * This is used for construction links (e.g. from a ServerMBean
 * to its corresponding ServerLifeCycleRuntimeMBean) and for
 * locating the beans (options) that a bean reference property
 * can refer to.
 */
public class BeanTreePathTemplate {

  private Path pathTemplate;

  // Construct a template for an url, e.g 'DomainRuntime/NodeManagerRuntimes/<Machine>'
  public BeanTreePathTemplate(String pathTemplate) {
    // Convert it a Path (change '/' to '.' since that's what Path's constructor expects)
    this.pathTemplate = new Path(pathTemplate.replaceAll("/", "."));
  }

  // Expands a path template given a bean identity containing the values to substitute
  // in the template.
  //
  // For example, if path template is 'DomainRuntime/NodeManagerRuntimes/<Machine>'
  // and the bean identity is 'Domain/Machines/Machine1', then this method will return
  // 'DomainRuntime/NodeManagerRuntimes/Machine1'
  //
  // If the bean identity doesn't contain matching values for all the
  // variables in the path template, then this method will return null to indicate
  // that the path couldn't be expanded.
  public Path expand(BeanTreePath values) {
    Path path = new Path();
    for (String templateComponent : this.pathTemplate.getComponents()) {
      String pathComponent = computePathComponentFromTemplate(templateComponent, values);
      if (pathComponent == null) {
        // we can't find a match for this template component.  That's OK.
        return null;
      }
      path.addComponent(pathComponent);
    }
    return path;
  }

  private String computePathComponentFromTemplate(String templateComponent, BeanTreePath values) {
    if (templateComponent.startsWith("<")) {
      if (!templateComponent.endsWith(">")) {
        throw new AssertionError("Template doesn't end with '>': " + templateComponent);
      }
      // Get the type instance name from the template component.
      String typeInstanceName = templateComponent.substring(1, templateComponent.length() - 1);
      if (typeInstanceName.isEmpty()) {
        throw new AssertionError("Empty template: " + templateComponent);
      }
      // Try to find a segment in values whose type matches the type instance name.
      // It should be a collection child.  Return its key.
      //
      // For example:
      //
      // If the template component is <Machine>, then the type instance name is 'Machine'.
      //
      // If values is /Domain/Machines/Machine1, then the first segment, 'Domain'
      // is the root bean's 'Domain' child bean, whose type is 'DomainMBean' and
      // whose type instance name is 'Domain'.  It doesn't match the type instance name
      // we want ('Machine1'), so we move on to the second segment.
      //
      // The second segment, 'Machines/Machine1', is the DomainMBean's 'Machines' child bean.
      // The 'Machines' child bean's type is 'MachineMBean', and its type instance
      // name is 'Machine'.  So, it matches the type instance name in the template component.
      //
      // So, we verify that 'Machines' is a collection, and that the segment has a key
      // (it does - i.e. Machine1).  So we return that key.
      //
      // Whew!
      for (BeanTreePathSegment segment : values.getSegments()) {
        BeanChildDef childDef = segment.getChildDef();
        if (childDef.getChildTypeDef().getInstanceName().equals(typeInstanceName)) {
          if (childDef.isCollection()) {
            if (segment.isKeySet()) {
              return segment.getKey();
            } else {
              throw
                new AssertionError(
                  templateComponent + " is a collection, not a collection child:"
                  + " " + childDef.getChildName() + " " + values
                );
            }
          } else {
            // Some types, like MinThreadsConstraintRuntime, are sometimes
            // collection children and sometimes singleton children.
            // When the link has <TypeName> in it, it's specifying a link
            // from a collection child of this type to a collection child
            // in a corresponding collection.
            // When the current bean is a singleton, we can't make the
            // link since we don't know the current bean's name.
            // So, just omit the link.
            return null;
          }
        }
      }
      return null; // can't find a value that matches the template - that's OK
    } else {
      // This component is not a template, e.g. Domain or *. Use it as-is.
      return templateComponent;
    }
  }
}
