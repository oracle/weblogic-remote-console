// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This is the base class for creating/modifying beans when a form is posted.
 * 
 * It handles converting between list of property values at the page level
 * to the list of properties that must be set at the bean repo level.
 * 
 * It also handles aggregating any messages returned from the bean repo.
 * For example, when the bean repo validates the property values, it may
 * find that several of them are invalid and return a separate message
 * for each one.
 */
class FormManager extends PageManager {

  private BeansPropertyValues beansPropertyValues;

  protected FormManager(InvocationContext ic, List<FormProperty> formProperties) {
    this(ic, convertFormPropertyValuesToBeanPropertyValues(ic, formProperties));
  }

  protected FormManager(InvocationContext ic, BeansPropertyValues beansPropertyValues) {
    super(ic);
    this.beansPropertyValues = beansPropertyValues;
  }

  private static BeansPropertyValues convertFormPropertyValuesToBeanPropertyValues(
    InvocationContext ic,
    List<FormProperty> formProperties) {
    BeansPropertyValues rtn = new BeansPropertyValues(ic.getBeanTreePath());
    for (FormProperty formProperty : formProperties) {
      rtn.addPropertyValue(
        convertFormPropertyValueToBeanPropertyValue(formProperty)
      );
    }
    return rtn;
  }

  private static BeanPropertyValue convertFormPropertyValueToBeanPropertyValue(FormProperty formProperty) {
    BeanPropertyDef propertyDef = formProperty.getPropertyDef();
    SettableValue settableValue = formProperty.getValue().asSettable(); // write always uses SettableValues
    if (propertyDef.isReferenceAsReferences() && settableValue.getValue() != null) {
      // Convert from a null reference or a single reference to a list of references
      List<Value> references = new ArrayList<>();
      Value value = settableValue.getValue();
      if (!value.isNullReference()) {
        references.add(value); // i.e. a reference of some sort
      }
      settableValue = new SettableValue(new ArrayValue(references), settableValue.getState());
    }
    return new BeanPropertyValue(propertyDef, settableValue);
  }

  protected BeansPropertyValues getBeansPropertyValues() {
    return beansPropertyValues;
  }

  protected void convertBeanMessagesToFormMessages(
    BeanTreePath beanPath,
    Response<?> beanResponse,
    Response<?> formResponse
  ) {
    int formPathLength = getInvocationContext().getBeanTreePath().getPath().length();
    int beanPathLength = beanPath.getPath().length();
    Path formRelativeBeanPath = beanPath.getPath().subPath(formPathLength, beanPathLength);
    for (Message beanMessage : beanResponse.getMessages()) {
      String beanProperty = beanMessage.getProperty();
      String formProperty =
        beanProperty != null
        ? formRelativeBeanPath.childPath(beanProperty).getDotSeparatedPath()
        : null;
      formResponse.addMessage(
        new Message(beanMessage.getSeverity(), formProperty, beanMessage.getText())
      );
    }
  }
}
