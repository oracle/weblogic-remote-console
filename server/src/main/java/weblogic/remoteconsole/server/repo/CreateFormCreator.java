// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This class manages creating a new bean.
 * 
 * The caller constructs one, passing in the properties to set on the new
 * bean and its mandatory singleton child beans, then calls create.
 * 
 * This class takes care of starting a configuration transaction and
 * saving the changes if the bean repo requires it.
 * 
 * It's public so that type-specific create customizers can use it.
 */
public class CreateFormCreator extends FormManager {

  public CreateFormCreator(InvocationContext ic, BeansPropertyValues beansPropertyValues) {
    super(ic, beansPropertyValues);
  }

  public CreateFormCreator(InvocationContext ic, List<FormProperty> formProperties) {
    super(ic, formProperties);
    // Make sure we have a BeanPropertyValues for the top level bean.
    // i.e. some optional singletons don't specify any properties for the singleton.
    getBeansPropertyValues().addBean(getInvocationContext().getBeanTreePath());
  }

  public Response<Void> create() {
    return ConfigurationTransactionHelper.editConfiguration(
      getInvocationContext(),
      new ConfigurationTransactionHelper.ConfigurationEditor() {
        @Override
        public Response<Void> editConfiguration() {
          return doCreate();
        }
      }
    );
  }
  
  private Response<Void> doCreate() {
    Response<Void> overallResponse = new Response<>();
    createTopLevelBean(overallResponse);
    if (overallResponse.isSuccess()) {
      updateChildBeans(overallResponse);
    }
    return overallResponse; 
  }

  private void createTopLevelBean(Response<Void> overallResponse) {
    BeanPropertyValues beanPropertyValues = findTopLevelBeanPropertyValues();
    aggregateResponse(
      getBeanRepo().asBeanEditorRepo().createBean(getInvocationContext(), beanPropertyValues),
      beanPropertyValues,
      overallResponse
    );
  }

  private void updateChildBeans(Response<Void> overallResponse) {
    // The rest of the beans in the list are automatically created when the
    // top level bean is created and need to be updated (v.s. created).
    boolean first = true;
    for (BeanPropertyValues beanPropertyValues : getSortedBeansPropertyValues()) {
      if (!first) {
        aggregateResponse(
          getBeanRepo().asBeanEditorRepo().updateBean(
            getInvocationContext(),
            fixChildBeanPath(beanPropertyValues)),
          beanPropertyValues,
          overallResponse
        );
        if (!overallResponse.isSuccess()) {
          return;
        }
      } else {
        // The first bean is the top level bean. Skip it.
      }
      first = false;
    }
  }

  private void aggregateResponse(
    Response<Void> oneResponse,
    BeanPropertyValues beanPropertyValues,
    Response<Void> overallResponse
  ) {
    convertBeanMessagesToFormMessages(beanPropertyValues.getBeanTreePath(), oneResponse, overallResponse);
    if (!oneResponse.isSuccess()) {
      overallResponse.copyStatus(oneResponse);
    }
  }

  private BeanPropertyValues fixChildBeanPath(BeanPropertyValues beanPropertyValues) {
    BeanPropertyValues topLevelProps = findTopLevelBeanPropertyValues();
    BeanTreePath topLevelBeanTreePath = topLevelProps.getBeanTreePath();
    if (!topLevelBeanTreePath.isCollection()) {
      // It's an optional singleton, so the child bean path is directly under the top level bean path,
      // thus doesn't need to be fixed.
      return beanPropertyValues;
    }
    // It's a collection child.  The child bean path will be something like "*/child/..."
    // Need to convert it to "MyTopLevelBean/child/..."
    BeanTreePath childBeanTreePath = beanPropertyValues.getBeanTreePath();
    BeanTreePathSegment firstRelativeSegment =
      childBeanTreePath.getSegments().get(topLevelBeanTreePath.getSegments().size() - 1);
    if (!firstRelativeSegment.getChildDef().isCollection() || firstRelativeSegment.isKeySet()) {
      throw new AssertionError("Child bean tree path didn't wildcard the key property: " + childBeanTreePath);
    }
    Path topLevelPath = topLevelBeanTreePath.getPath();
    Path childPath = childBeanTreePath.getPath();
    Path relativeChildPath = childPath.subPath(topLevelPath.length() + 1, childPath.length());
    String key = getKeyAsString(topLevelProps);
    Path actualChildPath = topLevelPath.childPath(key).childPath(relativeChildPath);
    BeanTreePath actualChildBeanTreePath =
      BeanTreePath.create(childBeanTreePath.getBeanRepo(), actualChildPath);
    BeanPropertyValues rtn = new BeanPropertyValues(actualChildBeanTreePath);
    for (BeanPropertyValue propertyValue : beanPropertyValues.getPropertyValues()) {
      rtn.addPropertyValue(propertyValue);
    }
    return rtn;
  }

  private String getKeyAsString(BeanPropertyValues topLevelPropertyValues) {
    BeanTreePath creatorBeanTreePath = topLevelPropertyValues.getBeanTreePath();
    if (!creatorBeanTreePath.isCollection()) {
      return null;
    }
    for (BeanPropertyValue propertyValue : topLevelPropertyValues.getPropertyValues()) {
      if (propertyValue.getPropertyDef().isKey()) {
        return propertyValue.getValue().getValue().asString().getValue();
      }
    }
    throw new AssertionError("Couldn't find the key property when creating a " + creatorBeanTreePath);
  }

  private BeanPropertyValues findTopLevelBeanPropertyValues() {
    // The top level bean is always the first one.
    return getSortedBeansPropertyValues().get(0);
  }

  // Return a list of bean/values that need to be set.
  // Weed out any properties tagged as 'unset' since creating a bean starts off
  // with all unset properties (ditto for its mandatory singletons).
  // The first entry on the list contains the properties to set on
  // the top level bean to be created.
  private List<BeanPropertyValues> getSortedBeansPropertyValues() {
    List<BeanPropertyValues> beansValues = new ArrayList<>();
    boolean first = true;
    for (BeanPropertyValues beanValues : getBeansPropertyValues().getSortedBeansPropertyValues()) {
      BeanPropertyValues setBeanValues = new BeanPropertyValues(beanValues.getBeanTreePath());
      for (BeanPropertyValue propertyValue : beanValues.getPropertyValues()) {
        if (!propertyValue.getValue().isUnset()) {
          setBeanValues.addPropertyValue(propertyValue);
        } else {
          // The property says it should be unset.  Don't add it to the list of properties to set
          // since newly created beans have all their properties unset initially.
        }
      }
      if (first || !setBeanValues.getPropertyValues().isEmpty()) {
        // If it's the top leval bean (regardless of whether any properties are set)
        // or if it's a mandatory singleton with some set properties, then
        // add it to the list of beans we need to process.
        beansValues.add(setBeanValues);
      }
      first = false;
    }
    return beansValues;
  }
}
