// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a bean type.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanTypeDef {

  // Returns the bean repo that contains this type.
  public BeanRepoDef getBeanRepoDef();

  // Returns the type's leaf name,  e.g. NetworkAccessPointMBean
  // (v.s. weblogic.management.configuration.NetworkAccessPointMBean)
  // used for PDJ urls and for finding yaml files
  public String getTypeName();

  // Returns the name of instances of this type.
  // e.g. NetworkAccessPoint
  // e.g. used for link definitions, name of root bean in RDJ urls
  public String getInstanceName();
  
  public LocalizableString getInstanceNameLabel();

  public BeanPropertyDef getKeyPropertyDef(); // returns null if this type doesn't have a key property

  public BeanPropertyDef getIdentityPropertyDef(); // returns null if this type doesn't have an identity property

  public boolean isHomogeneous();

  public default boolean isHeterogeneous() {
    return !isHomogeneous();
  }

  public BeanPropertyDef getSubTypeDiscriminatorPropertyDef();

  public List<String> getSubTypeDiscriminatorLegalValues();

  public BeanTypeDef getSubTypeDef(String subTypeDiscriminator);

  public default List<BeanTypeDef> getSubTypeDefs() {
    List<BeanTypeDef> rtn = new ArrayList<>();
    if (isHeterogeneous()) {
      for (String  subTypeDiscriminator : getSubTypeDiscriminatorLegalValues()) {
        rtn.add(getSubTypeDef(subTypeDiscriminator));
      }
    } else {
      rtn.add(this);
    }
    return rtn;
  }

  // need to support this bean's & contained beans' properties,
  // including folding, since our type.yamls let an outer
  // bean customize an inner bean's properties

  // Determines whether this type, or one of its mandatory singletons, has a property.
  // For example, for the ServerMBean, if the property path is ListenPort,
  // it returns whether ServerMBean has a ListenPort property.  And, if
  // the property path is SSL.ListenPort, it returns whether the ServerMBean's
  // SSL child bean has a ListenPort property.
  //
  // 'searchSubTypes' indicates whether just to just look in this type
  // or whether to look in types that extend it too.
  public boolean hasPropertyDef(Path propertyPath, boolean searchSubTypes);

  // The same as hasPropertyDef(propertyPath, false)
  public default boolean hasPropertyDef(Path propertyPath) {
    return hasPropertyDef(propertyPath, false);
  }

  // Returns the definition fo a property on this type or one of its mandatory singletons.
  // For example, for the ServerMBean, if the property path is ListenPort,
  // it returns the ServerMBean's ListenPort property.  And, if the property path
  // is SSL.ListenPort, it returns whether the ServerMBean's SSL child bean's
  // ListenPort property.
  //
  // 'searchSubTypes' indicates whether just to just look in this type
  // or whether to look in types that extend it too.
  //
  // If it can't find the property, it returns null if it's OK for
  // this type to not have the property (e.g. a property that's available
  // in the most current WLS version but not in older versions), or throws
  // an AssertionError if it's not OK for this type to not have the property
  // (e.g. we're using the most current WLS version).
  //
  // This is because we have one set of PDYs that are used for all WLS
  // releases, and for older releases, we just skip properties that are
  // not present, but for the current release, all properties in the PDY must
  // be present.
  public BeanPropertyDef getPropertyDef(Path propertyPath, boolean searchSubTypes);

  // The same as getPropertyDef(propertyPath, false)
  public default BeanPropertyDef getPropertyDef(Path propertyPath) {
    return getPropertyDef(propertyPath, false);
  }

  // Find all of the properties defined on this type and its mandatory singleton children.
  // It does not return properties from the derived types too.
  public List<BeanPropertyDef> getPropertyDefs();

  // Find a property given its offline WLST name (i.e. its name in a WDT model).
  // Doesn't search sub types.
  // Doesn't search properties of mandatory singleton children like SSL.Enabled.
  // Returns null if it can't find the property.
  public BeanPropertyDef getPropertyDefFromOfflineName(String offlinePropertyName);

  // Similar to hasPropertyDef(propertyPath, searchSubTypes) but looks for:
  // - contained colllections (e.g. DomainMBean's Servers collection)
  // - mandatory singletons (e.g. DomainMBean's SecurityConfiguration mandatory singleton)
  // - optional singletons (e.g. RealmMBean's Adjudicator.)
  public boolean hasChildDef(Path childPath, boolean searchSubTypes);

  // Same as hasChildDef(childPathm, false)
  public default boolean hasChildDef(Path childPath) {
    return hasChildDef(childPath, false);
  }

  // Similar to getPropertyDef(propertyPath, searchSubTypes) but
  // returns contained collections, mandatory singletons and optional singletons.
  public BeanChildDef getChildDef(Path childPath, boolean searchSubTypes);

  // Same as getChildDef(childPath, false)
  public default BeanChildDef getChildDef(Path childPath) {
    return getChildDef(childPath, false);
  }

  // Similar to getPropertDefs but returns contained collections,
  // mandatory singletons and optional singletons.
  // Doesn't return children defined in derived types.
  public List<BeanChildDef> getChildDefs();

  // Similar to getPropertyDefFromOfflineName(offlinePropertyName).
  // Doesn't search sub types.
  // Doesn't search singleton children like SecurityConfiguration.Realms
  // Returns null if it can't find the child.
  public BeanChildDef getChildDefFromOfflineName(String offlineChildName);

  // Similar to hasPropertyDef(propertyPath, searchSubTypes)
  // but returns whether actions exist (e.g. the ServerLifeCycleMBean's start action).
  public boolean hasActionDef(Path actionPath, boolean searchSubTypes);

  // The same as hasAction(actionPath, false)
  public default boolean hasActionDef(Path actionPath) {
    return hasActionDef(actionPath, false);
  }

  // Similar to getPropertyDef(propertyPath, searchSubTypes)
  //but returns actions (e.g. the ServerLifeCycleMBean's start action).
  public BeanActionDef getActionDef(Path actionPath, boolean searchSubTypes);

  // The same as getActionDef(actionPath, false)
  public default BeanActionDef getActionDef(Path actionPath) {
    return getActionDef(actionPath, false);
  }

  // Similar to getPropertyDefs but returns actions.
  // Doesn't include actions defined in derived types.
  public List<BeanActionDef> getActionDefs();

  // Determines whether this type supports asking whether its properties are set.
  // For example, WebLogic config mbeans are settable but WebLogic runtime mbeans are not.
  public boolean isSettable();

  // Detetrmine if otherTypeDef is this type or a base of this type
  public boolean isTypeDef(BeanTypeDef otherTypeDef);

  // The name of the custom static method that deletes instances of this type.
  // If null, then use the standard mechanisms are used.
  public DeleteBeanCustomizerDef getDeleteCustomizerDef();

  // The name of the custom static method that creates instances of this type.
  // If null, then the standard mechanisms are used.
  public String getCreateResourceMethod();

  // The name of the custom static method that gets collections of this type.
  // If null, then the standard mechanisms are used.
  public String getGetCollectionMethod();

  // Whether beans of this type can be referenced by other beans
  public boolean isReferenceable();

  // Whether collections of this type are ordered
  public boolean isOrdered();

  // Whether custom dashboards can be created that return beans of this type
  public boolean isSupportsCustomFilteringDashboards();
}
