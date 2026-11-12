// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeansPropertyValues;
import weblogic.remoteconsole.server.repo.CreateFormCreator;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * Custom JAXRS resource for creating NoSQLSystemResourceMBeans.
 */
public class NoSQLSystemResourceMBeanCreatableCollectionResource extends CreatableBeanCollectionResource {
  private static final String NAME = "Name";
  private static final String NOSQL_RESOURCE_NAME = "NoSQLResource.Name";
  private static final String NOSQL_RESOURCE_PROVIDER_NAME = "NoSQLResource.ProviderName";
  private static final String DESCRIPTOR_FILE_NAME = "DescriptorFileName";
  private static final String DESCRIPTOR_FILE_SUFFIX = "-nosql.xml";

  // The create form supplies a page-only default for ProviderName. Replace that
  // field with the descriptor bean property before the form creator runs.
  static void addNoSQLResourceProviderName(
    BeanTreePath collectionPath,
    BeansPropertyValues beanValues,
    List<FormProperty> formProperties
  ) {
    for (FormProperty formProperty : formProperties) {
      BeanPropertyDef formPropertyDef = formProperty.getFieldDef().asBeanPropertyDef();
      if (NOSQL_RESOURCE_PROVIDER_NAME.equals(formPropertyDef.getPropertyPath().getDotSeparatedPath())) {
        BeanTypeDef typeDef = collectionPath.getTypeDef();
        BeanPropertyDef providerNameDef = typeDef.getPropertyDef(new Path(NOSQL_RESOURCE_PROVIDER_NAME), true);
        if (providerNameDef == null) {
          throw new AssertionError("Can't find bean property " + NOSQL_RESOURCE_PROVIDER_NAME);
        }
        SettableValue providerNameValue =
          new SettableValue(formProperty.getValue().asSettable().getValue(), true);
        getTopLevelBeanPropertyValues(collectionPath, beanValues).getPropertyValues().removeIf(
          propertyValue ->
            NOSQL_RESOURCE_PROVIDER_NAME.equals(
              propertyValue.getPropertyDef().getPropertyPath().getDotSeparatedPath()
            )
        );
        beanValues.addPropertyValue(new BeanPropertyValue(providerNameDef, providerNameValue));
        return;
      }
    }
    throw new AssertionError("Can't find " + NOSQL_RESOURCE_PROVIDER_NAME);
  }

  private static BeanPropertyValues getTopLevelBeanPropertyValues(
    BeanTreePath collectionPath,
    BeansPropertyValues beanValues
  ) {
    for (BeanPropertyValues propertyValues : beanValues.getSortedBeansPropertyValues()) {
      if (collectionPath.equals(propertyValues.getBeanTreePath())) {
        return propertyValues;
      }
    }
    throw new AssertionError("Can't find top-level NoSQL system resource values");
  }

  @Override
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    return (new NoSQLSystemResourceMBeanCreator()).createBean(getInvocationContext(), requestBody);
  }

  private static class NoSQLSystemResourceMBeanCreator extends CreateHelper {
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      String name = getName(formProperties);
      return (new NoSQLSystemResourceMBeanFormCreator(ic, formProperties, name)).create();
    }

    private String getName(List<FormProperty> formProperties) {
      for (FormProperty formProperty : formProperties) {
        BeanPropertyDef propertyDef = formProperty.getFieldDef().asBeanPropertyDef();
        if (NAME.equals(propertyDef.getPropertyPath().getDotSeparatedPath())) {
          return formProperty.getValue().asSettable().getValue().asString().getValue();
        }
      }
      throw new AssertionError("Can't find " + NAME);
    }
  }

  private static class NoSQLSystemResourceMBeanFormCreator extends CreateFormCreator {
    private NoSQLSystemResourceMBeanFormCreator(
      InvocationContext ic,
      List<FormProperty> formProperties,
      String name
    ) {
      super(ic, formProperties);
      addDescriptorFileName(ic, name);
      addNoSQLResourceName(ic, name);
      addNoSQLResourceProviderName(ic.getBeanTreePath(), getBeansPropertyValues(), formProperties);
    }

    private void addDescriptorFileName(InvocationContext ic, String name) {
      addStringProperty(ic, DESCRIPTOR_FILE_NAME, name + DESCRIPTOR_FILE_SUFFIX);
    }

    private void addNoSQLResourceName(InvocationContext ic, String name) {
      addStringProperty(ic, NOSQL_RESOURCE_NAME, name);
    }

    private void addStringProperty(InvocationContext ic, String propertyName, String value) {
      BeanPropertyDef propertyDef =
        ic.getBeanTreePath().getTypeDef().getPropertyDef(new Path(propertyName), true);
      if (propertyDef == null) {
        throw new AssertionError("Can't find " + propertyName);
      }
      getBeansPropertyValues().addPropertyValue(
        new BeanPropertyValue(propertyDef, new SettableValue(new StringValue(value), true))
      );
    }
  }
}
