// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreatableOptionalSingletonBeanResource;
import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.EditableMandatorySingletonBeanResource;

/** 
 * TBD
 */
public class CreatableDescriptorBeanCustomizer {
  private CreatableDescriptorBeanCustomizer() {
  }

  public static BaseResource createResource(InvocationContext ic) {
    BeanTreePath btp = ic.getBeanTreePath();
    if (btp.isCollection()) {
      return new CreatableBeanCollectionResource();
    } else if (btp.isCollectionChild()) {
      return new DeletableCollectionChildBeanResource();
    } else if (btp.isMandatorySingleton()) {
      return new EditableMandatorySingletonBeanResource();
    } else if (btp.isOptionalSingleton()) {
      return new CreatableOptionalSingletonBeanResource();
    }
    return null;
  }

  // Create a new child in this collection
  public static Value createCollectionChild(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    BeanPropertyValues propertyValues = new BeanPropertyValues(ic.getBeanTreePath());
    for (FormProperty formProperty : formProperties) {
      // The property names on the action input form must match the property names on the descriptor bean:
      String propertyName = formProperty.getName();
      BeanPropertyDef propertyDef = ic.getBeanTreePath().getTypeDef().getPropertyDef(new Path(propertyName));
      propertyValues.addPropertyValue(
        new BeanPropertyValue(propertyDef, formProperty.getValue().asSettable())
      );
    }
    ic.getPageRepo().getBeanRepo().asBeanEditorRepo().createBean(ic, propertyValues).getResults();
    return null;
  }
}
