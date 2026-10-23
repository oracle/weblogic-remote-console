// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import org.junit.jupiter.api.Test;
import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeansPropertyValues;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestEditPageRepo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class NoSQLSystemResourceMBeanCreatableCollectionResourceTest {

  @Test
  void mapsDefaultResourceFormsToWritableDescriptorBoolean() {
    WebLogicVersion version = WebLogicVersions.getVersion("26.1.0.0.0");
    WebLogicMBeansVersion mbeansVersion =
      WebLogicMBeansVersions.getVersion(version, WebLogicVersions.getVersionCapabilities(version));
    WebLogicRestEditPageRepo pageRepo = new WebLogicRestEditPageRepo(mbeansVersion);
    BeanTreePath collectionPath =
      BeanTreePath.create(pageRepo.getBeanRepo(), new Path("Domain.NoSQLSystemResources"));
    PagesPath pagesPath = new PagesPath(pageRepo.getPageRepoDef(), collectionPath.getTypeDef());
    for (PagePath pagePath : List.of(
      PagePath.newCreateFormPagePath(pagesPath),
      PagePath.newSlicePagePath(pagesPath, new Path("General"))
    )) {
      PagePropertyDef defaultResource =
        pageRepo.getPageRepoDef().getPageDef(pagePath).getAllPropertyDefs().stream()
          .filter(property -> "NoSQLResource.DefaultResource".equals(property.getPropertyPath().getDotSeparatedPath()))
          .findFirst()
          .orElseThrow();
      assertTrue(defaultResource.isBoolean());
      assertTrue(defaultResource.isCreateWritable());
      assertTrue(defaultResource.isUpdateWritable());
      assertFalse(defaultResource.isPageLevelField());
      assertEquals("NoSQLResource_DefaultResource", defaultResource.getFormFieldName());
      assertEquals("defaultResource", defaultResource.getOnlinePropertyName());

      for (boolean selected : List.of(true, false)) {
        BeansPropertyValues beanValues = new BeansPropertyValues(collectionPath);
        beanValues.addPropertyValue(
          new BeanPropertyValue(defaultResource, new SettableValue(new BooleanValue(selected), true))
        );
        List<BeanPropertyValues> sortedValues = beanValues.getSortedBeansPropertyValues();
        assertEquals(1, sortedValues.size());
        assertEquals("Domain.NoSQLSystemResources.*.NoSQLResource",
          sortedValues.get(0).getBeanTreePath().getPath().getDotSeparatedPath());
        BeanPropertyValue propertyValue = sortedValues.get(0).getPropertyValues().get(0);
        assertEquals("DefaultResource", propertyValue.getPropertyDef().getPropertyName());
        assertEquals(selected, propertyValue.getValue().getValue().asBoolean().getValue());
        assertFalse(propertyValue.getValue().isUnset());
      }
    }
  }

  @Test
  void mapsCreateFormProviderDefaultToNoSQLResourceBean() {
    WebLogicVersion version = WebLogicVersions.getVersion("26.1.0.0.0");
    WebLogicMBeansVersion mbeansVersion =
      WebLogicMBeansVersions.getVersion(version, WebLogicVersions.getVersionCapabilities(version));
    WebLogicRestEditPageRepo pageRepo = new WebLogicRestEditPageRepo(mbeansVersion);
    BeanTreePath collectionPath =
      BeanTreePath.create(pageRepo.getBeanRepo(), new Path("Domain.NoSQLSystemResources"));
    PageDef createForm =
      pageRepo.getPageRepoDef().getPageDef(
        PagePath.newCreateFormPagePath(new PagesPath(pageRepo.getPageRepoDef(), collectionPath.getTypeDef()))
      );
    PagePropertyDef formProviderName =
      createForm.getAllPropertyDefs().stream()
        .filter(property -> "NoSQLResource.ProviderName".equals(property.getPropertyPath().getDotSeparatedPath()))
        .findFirst()
        .orElseThrow();
    assertTrue(formProviderName.isPageLevelField());

    SettableValue selectedProvider = new SettableValue(new StringValue("oracle-nosql"), true);
    FormProperty formProperty = new FormProperty(formProviderName, selectedProvider);
    BeansPropertyValues beanValues = new BeansPropertyValues(collectionPath);
    beanValues.addPropertyValue(new BeanPropertyValue(formProviderName, selectedProvider));

    NoSQLSystemResourceMBeanCreatableCollectionResource.addNoSQLResourceProviderName(
      collectionPath, beanValues, List.of(formProperty)
    );

    List<BeanPropertyValues> sortedValues = beanValues.getSortedBeansPropertyValues();
    assertEquals(2, sortedValues.size());
    assertTrue(sortedValues.get(0).getPropertyValues().isEmpty());
    assertEquals("Domain.NoSQLSystemResources.*.NoSQLResource",
      sortedValues.get(1).getBeanTreePath().getPath().getDotSeparatedPath());
    BeanPropertyValue providerName = sortedValues.get(1).getPropertyValues().get(0);
    assertEquals("ProviderName", providerName.getPropertyDef().getPropertyName());
    assertEquals("providerName", providerName.getPropertyDef().getOnlinePropertyName());
    assertEquals("oracle-nosql", providerName.getValue().getValue().asString().getValue());
    assertFalse(providerName.getValue().isUnset());
  }
}
