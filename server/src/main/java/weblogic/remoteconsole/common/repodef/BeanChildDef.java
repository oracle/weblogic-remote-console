// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.Set;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a collection or singleton bean that is parented by another bean.
 *
 * It contains all of the information about the collection/singleton that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 *
 * Note: the WLS MBeans have two kinds of attributes - ones that hold
 * values (e.g. string, long, reference to another bean), and ones that
 * parent children (e.g. collections and singletons).
 * The remote console does not follow this convention.  Instead, it
 * has separate interfaces for the values (BeanPropertyDef) and the
 * contained beans (BeanChildDef).
 */
public interface BeanChildDef {

  // The page-relative bean type containing this singleton/collection.
  public BeanTypeDef getTypeDef();

  // The name of the singleton/collection on its leaf type.
  public String getChildName();

  // The online WLS REST name of the child (e.g. libraries instead of Libraries)
  public String getOnlineChildName();

  // The offline WLST name of the child (e.g. JdbcResource instead of JDBCResource)
  public String getOfflineChildName();

  // The child bean's type (e.g. ClusterMBean for the DomainMBean's Clusters collection)
  public BeanTypeDef getChildTypeDef();

  // The path from the page-relative bean type to the leaf bean that contains the child bean,
  // e.g. if the top level bean is Server, and this child is on the SSL mbean, then
  // parentPath is "SSL"
  public Path getParentPath();

  // The page from the page-relative bean type to this child.
  public default Path getChildPath() {
    return getParentPath().childPath(getChildName());
  }

  // Whether this is a collection of beans or one bean (i.e. a singleton)
  public boolean isCollection();

  // If this is a collection, specifies whether you can create children in the collection.
  // If this is an optional singleton, specifies whether you can create the singleton
  // if it doesn't currently exist.
  // It implies that the beans are deletable.
  // It also implies that the beans are editable.
  // And, if it's an ordered collection, it implies you can reorder the collection's children.
  public boolean isCreatable();

  // If this is a collection, specifies whether you can delete children in the collection.
  // If this is an optional singletoon, specifies whether you can delete the singleton
  // if it currently exists.
  public boolean isDeletable();

  // Whether create is asynchronous (e.g. creating a library is asynchronous)
  public boolean isAsyncCreate();

  // Whether delete is asynchronous (e.g. deleting a library is asynchronout)
  public boolean isAsyncDelete();

  // Whether this singleton is optional.
  // Returns false if isCollection returns false.
  public boolean isOptional();

  // Whether its is an optional singleton (e.g. a Realm's Adjudicator).
  public default boolean isOptionalSingleton() {
    return !isCollection() && isOptional();
  }

  // Whether this is a mandator singleton (i.e. a child that always exists
  // and cannot be removed, like an ServerMBean's SSLMBean).
  public default boolean isMandatorySingleton() {
    return !isCollection() && !isOptional();
  }

  // Whether this singleton is really a 'root' (e.g. Domain or DomainRuntime)
  public boolean isRoot();

  // Whether this collection is editable (i.e you can reorder an ordered collection)
  // or this singleton is editable (i.e. you can change its properties).
  // Returns true if isCreatable returns true.
  public boolean isEditable();

  // Whether this is an ordered collection.
  // Returns false is isCollection returns false.
  public default boolean isOrdered() {
    return isCollection() ? getChildTypeDef().isOrdered() : false;
  }

  // The child's label (e.g. the localizable name of the collection or optional singleton)
  public LocalizableString getLabel();

  // The child's singular label
  // It's the singular of the label for collections (e.g Server / Servers)
  // It's the same as getLabel for singletons (e.g. Adjudicator / Adjudicator)
  public LocalizableString getSingularLabel();

  // Whether the WLS server needs to be restarted to see changes to this child
  // (e.g. creating/deleting a collection child or optional singleton).
  public boolean isRestartNeeded();

  // Whether this singleton child is collapsed / ommited in WDT model files
  // e.g. CoherenceClusterResource.CoherenceAddressProviders.CoherenceAddressProviders
  // collapses to CoherenceClusterResource.CoherenceAddressProviders
  public boolean isCollapsedInWDT();

  // The roles that are allowed to get (read) this child.
  public Set<String> getGetRoles();

  // The roles that are allowed to set this child (i.e. to re-order an ordered collection)
  public Set<String> getSetRoles();

  // The roles that are allowed to create this child (or a child in this collection)
  public Set<String> getCreateRoles();

  // The roles that are allowed to delete this child (or a child in this collection)
  public Set<String> getDeleteRoles();
}
