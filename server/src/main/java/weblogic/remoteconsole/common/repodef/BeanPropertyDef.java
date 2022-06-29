// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.Set;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.UnknownValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * This interface describes a bean property (i.e. something that has a value).
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 *
 * Note: the WLS MBeans have two kinds of attributes - ones that hold
 * values (e.g. string, long, reference to another bean), and ones that
 * parent children (e.g. collections and singletons).
 *
 * The remote console does not follow this convention.  Instead, it
 * has separate interfaces for the values (BeanPropertyDef) and the
 * contained beans (BeanChildDef).
 */
public interface BeanPropertyDef extends BeanValueDef {

  // The page-relative bean type containing this property, e.g. Server
  public BeanTypeDef getTypeDef();

  // The name of the property in the leaf bean that contains the property,
  // e.g. SSL's "ListenPort"
  public String getPropertyName();

  // The name that is used to identify this property in forms in the HTTP api.
  // Typically it's the same as getPropertyPath().getUnderscoreSeparatedPath()
  // However, sometimes the form name of the property needs to
  // be different (especially for wizards).
  public String getFormPropertyName();

  // The online WLS REST name of the property (e.g. listenPort instead of ListenPort)
  public String getOnlinePropertyName();

  // The offline WLST name of the property (e.g. CredentialEncrypted instead of Credential)
  public String getOfflinePropertyName();

  // The path from the page-relative bean type to the leaf bean that contains the property,
  // e.g. if the top level bean is a ServerMBean, and this property is on the SSL mbean, then
  // parentPath is "SSL"
  public Path getParentPath();

  // The path from the page-relative bean type to this property,
  // e.g. if the top level bean is a ServerMBean and this is the ListenPort property on
  // the SSL mbean, then the propertyPath is "SSL.ListenPort".
  public default Path getPropertyPath() {
    return getParentPath().childPath(getPropertyName());
  }

  // Whether this is an ordered array.
  public boolean isOrdered();

  // Whether this is the key property for this type (used as the identity for collection children).
  // For example, if this is the Name property on the Server type, then isKey returns true.
  public boolean isKey();

  // Whether this is the identity property (i.e. its value this bean instance's bean tree path)
  public default boolean isIdentity() {
    return "identity".equals(getPropertyName());
  }

  // Whether this property can be specified when creating a bean of this type.
  // For example, the Name property can be specified when creating a Server
  // but cannot be modified after the Server has been created.
  public boolean isCreateWritable();

  // Whether this property can be specified when updating a bean of this type.
  // For example, the Name and ListenPort properties can be specified when
  // creating a Server but only the ListenPort can be modified after the Server
  // has been created.
  public boolean isUpdateWritable();

  // Whether this property's value must be specified.
  public boolean isRequired();

  // If this property has special java code for getting its value,
  // this method returns how to invoke that code.
  // Returns null if there is no custom code to call to get this property's value
  public GetPropertyValueCustomizerDef getGetValueCustomizerDef();

  // If this property has special java code for computing its options,
  // this method returns how to invoke that code.
  // Returns null if there is no custom code to call to get this property's options
  public GetPropertyOptionsCustomizerDef getGetOptionsCustomizerDef();

  // Whether the WebLogic servers need to be restarted after this property has
  // been specified (otherwise they won't see the change).
  public boolean isRestartNeeded();

  // Can this property's value be a WDT model token?
  // Currently only supported by WDT.
  public boolean isSupportsModelTokens();

  // If this property is a reference (or an array of references), can the
  // references be unresolved strings containing mbean names?
  // Currently only supported by WDT.
  // For example, in a WDT scenario where multiple models are used to describe
  // the domain, one model file can set a deployment's Target to 'Server1' even
  // though Server1 isn't defined in that model (since it should be specified
  // in one the other model files).
  public boolean isSupportsUnresolvedReferences();

  // If there is a specific default value for this property when the domain is in
  // secure mode, it returns that value. Otherwise, returns UnknownValue
  // (i.e. there isn't one or the repo isn't for a domain).
  public Value getSecureDefaultValue();

  // If there is a specific default value for this property when the domain is in
  // production mode, it returns that value. Otherwise, returns UnknownValue
  // (i.e. there isn't one or the repo isn't for a domain).
  public Value getProductionDefaultValue();

  // If the repo isn't for a domain, returns the default value for this property.
  // Otherwise, returns the normal default value for the property,
  // e.g. when what to use if the domain isn't in production or secure mode,
  // or if there isn't a specific default value to use for production or secure mode.
  public Value getStandardDefaultValue();

  // The default value to use considering whether the WLS domain
  // is running in secure mode or production mode.
  // Returns UnknownValue if we don't know that default value to use
  // (e.g. for derived defaults).
  // Returns getStandardDefaultValue() if the repo isn't for a domain.
  public default Value getDefaultValue(boolean isSecureMode, boolean isProductionMode) {
    Value value = UnknownValue.INSTANCE;
    if (isSecureMode) {
      value = getSecureDefaultValue();
    }
    if (value.isUnknown() && isProductionMode) {
      value = getProductionDefaultValue();
    }
    if (value.isUnknown()) {
      value = getStandardDefaultValue();
    }
    return value;
  }

  // The default value to use when you don't know whether the
  // server is in secure and/or production mode.
  // Returns UnknownValue if we don't know what the value is.
  // Returns getStandardDefaultValue() if the repo isn't for a domain.
  public default Value getDefaultValue() {
    Value value = UnknownValue.INSTANCE;
    if (getSecureDefaultValue().isUnknown() && getProductionDefaultValue().isUnknown()) {
      return getStandardDefaultValue();
    }
    return value;
  }

  // Returns whether this a page property def.
  public default boolean isPagePropertyDef() {
    return (this instanceof PagePropertyDef);
  }

  // Converts this bean property def to a page property def.
  // Throws a ClassCastException if this bean property def isn't a page property def.
  public default PagePropertyDef asPagePropertyDef() {
    return (PagePropertyDef)this;
  }

  // The roles that are allowed to get (read) this property
  public Set<String> getGetRoles();

  // The roles that are allowed to set this property
  public Set<String> getSetRoles();
}
