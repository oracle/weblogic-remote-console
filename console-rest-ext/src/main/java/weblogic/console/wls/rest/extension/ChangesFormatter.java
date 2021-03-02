// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.glassfish.admin.rest.utils.JsonFilter;
import weblogic.descriptor.BeanUpdateEvent;
import weblogic.management.rest.lib.bean.Constants;
import weblogic.management.rest.lib.bean.utils.AttributeType;
import weblogic.management.rest.lib.bean.utils.BeanType;
import weblogic.management.rest.lib.bean.utils.BeanUtils;
import weblogic.management.rest.lib.bean.utils.ContainedBeanType;
import weblogic.management.rest.lib.bean.utils.ContainedBeansType;
import weblogic.management.rest.lib.bean.utils.DescriptorUtils;
import weblogic.management.rest.lib.bean.utils.InvocationContext;
import weblogic.management.rest.lib.bean.utils.PathUtils;
import weblogic.management.rest.lib.bean.utils.PropertyType;
import weblogic.management.rest.lib.bean.utils.ReferencedBeanType;
import weblogic.management.rest.lib.bean.utils.ReferencedBeansType;

/**
 * Utility for formatting weblogic configuration changes.
 *
 * It converts the underlying BeanUpdateEvents from WLS
 * to the JSON form that the corresponding console REST
 * extension returns.
 */
public class ChangesFormatter {

  // We loop over the change events in several passes, each time
  // processing one kind of info.  These constants tell the pass
  // what to do.
  private static final int PROCESS_ADDITIONS = 0;
  private static final int PROCESS_REMOVALS = 1;
  private static final int PROCESS_MODIFICATIONS = 2;
  private static final int PROCESS_RESTARTS = 3;

  public static JSONObject formatChanges(
    InvocationContext ic,
    JsonFilter.Scope filter,
    Iterator<BeanUpdateEvent> iter
  ) throws Exception {
    return (new ChangesFormatter()).format(ic, filter, iter);
  }

  // overall:
  private InvocationContext invocationContext;
  private int process;
  private List<BeanUpdateEvent> events = new ArrayList<>();
  private JSONArray modifications;
  private JSONArray additions;
  private JSONArray removals;
  private JSONArray restarts;

  // per BeanUpdateEvent:
  BeanUpdateEvent event;
  InvocationContext source;
  InvocationContext proposed;
  BeanType type;

  // per PropertyUpdate:
  BeanUpdateEvent.PropertyUpdate update;
  AttributeType attrType;

  private ChangesFormatter() {
  }

  private JSONObject format(
    InvocationContext invocationContext,
    JsonFilter.Scope filter,
    Iterator<BeanUpdateEvent> iter
  ) throws Exception {
    this.invocationContext = invocationContext;
    formatEvents(iter);
    JSONObject changes = new JSONObject();
    if (filter.include("modifications")) {
      changes.put("modifications", this.modifications);
    }
    if (filter.include("additions")) {
      changes.put("additions", this.additions);
    }
    if (filter.include("removals")) {
      changes.put("removals", this.removals);
    }
    if (filter.include("restarts")) {
      changes.put("restarts", this.restarts);
    }
    return changes;
  }

  // Format all of the events
  private void formatEvents(Iterator<BeanUpdateEvent> iter) throws Exception {
    this.events = new ArrayList<>();
    this.modifications = new JSONArray();
    this.additions = new JSONArray();
    this.removals = new JSONArray();
    this.restarts = new JSONArray();
    // Make a list of the events so that we can walk through them more than once:
    while (iter.hasNext()) {
      this.events.add(iter.next());
    }
    // Just handle the additions:
    formatEvents(PROCESS_ADDITIONS);
    // Just handle the removals:
    formatEvents(PROCESS_REMOVALS);
    // Just handle the modifications:
    formatEvents(PROCESS_MODIFICATIONS);
    // Just handle the restarts:
    formatEvents(PROCESS_RESTARTS);
  }

  // Format the events for a processing pass (e.g. additions or removals)
  private void formatEvents(int process) throws Exception {
    this.process = process;
    for (BeanUpdateEvent event : this.events) {
      formatEvent(event);
    }
  }

  private void formatEvent(BeanUpdateEvent event) throws Exception {
    this.event = event;
    this.source = this.invocationContext.clone(this.event.getSourceBean());
    this.proposed = this.invocationContext.clone(this.event.getProposedBean());
    this.type = BeanType.getBeanType(this.proposed.request(), this.proposed.bean());
    for (BeanUpdateEvent.PropertyUpdate update : this.event.getUpdateList()) {
      formatUpdate(update);
    }
  }

  private void formatUpdate(BeanUpdateEvent.PropertyUpdate update) throws Exception {
    this.update = update;
    int updateType = this.update.getUpdateType();
    PropertyDescriptor pd = getPropertyDescriptor(this.update.getPropertyName());
    if (!DescriptorUtils.isPublicAttribute(pd)) {
      // Not supported by any WLS REST version.
      // Skip it for now since we probably can't use the WLS REST
      // utility classes to manage it.
      // Ideally, it would be nice to return something so that the user can see it.
      // Not worth the effort for MVP.
      return; 
    }
    this.attrType = this.type.getAttributeType(DescriptorUtils.getRestName(pd));
    if (!this.attrType.isVisibleToLatestVersion()) {
      // Not supported by the latest WLS REST version.
      // Should we skip it? The CBE won't be able to manage it.
      // Still, the user might want to see it.
      // Decision - return it.
    }
    switch (updateType) {
      case BeanUpdateEvent.PropertyUpdate.CHANGE:
        formatPropertyChange();
        break;
      case BeanUpdateEvent.PropertyUpdate.ADD:
        formatPropertyAdd();
        break;
      case BeanUpdateEvent.PropertyUpdate.REMOVE:
        formatPropertyRemove();
        break;
      default:
        throw new AssertionError("Change type " + updateType + " illegal");
    }
  }

  private void formatPropertyChange() throws Exception {
    recordModification();
  }

  private void formatPropertyAdd() throws Exception {
    if (this.attrType instanceof ReferencedBeansType || isArrayProperty()) {
      // We've added a bean to an array of references, or a scalar to an array of scalars.
      // Treat it as a modification.
      recordModification();
    } else if (this.attrType instanceof ContainedBeansType || this.attrType instanceof ContainedBeanType) {
      recordAddition();
    } else {
      throw
        new AssertionError(
          "ADD can't handle attrType "
          + this.type.getName()
          + " "
          + this.attrType.getName()
          + " "
          + this.attrType
        );
    }
  }

  private void formatPropertyRemove() throws Exception {
    if (this.attrType instanceof ReferencedBeansType || isArrayProperty()) {
      // We've removed a bean from an array of references, or a scalar from an array of scalars.
      // Treat it as a modification.
      recordModification();
    } else if (this.attrType instanceof ContainedBeansType || this.attrType instanceof ContainedBeanType) {
      recordRemoval();
    } else {
      throw
        new AssertionError(
          "REMOVE can't handle attrType "
          + this.type.getName()
          + " "
          + this.attrType.getName()
          + " "
          + this.attrType
        );
    }
  }

  // Returns whether this modified property is an array of scalars
  private boolean isArrayProperty() throws Exception {
    if (this.attrType instanceof PropertyType) {
      return ((PropertyType)attrType).getMarshaller().getValueMarshaller().javaType().isArray();
    }
    return false;
  }

  private void recordModification() throws Exception {
    if (this.process == PROCESS_RESTARTS) {
      recordRestarts();
      return;
    }

    if (this.process != PROCESS_MODIFICATIONS) {
      // We're not handling modifications at this moment.  Skip it.
      return;
    }

    JSONArray identity = getBeanIdentity(this.proposed.bean());
    if (isRemoved(identity)) {
      throw new AssertionError("can't modify removed bean: " + identity);
    }
    if (isAdded(identity)) {
      // Normally, if you create a bean then customize it or customize any of
      // its automatically created child beans, you only get an ADD event for the
      // bean, and don't get MODIFY events for the properties.
      //
      // However, for system resources, where some of the beans live in config.xml
      // and some of the beans live in an other descriptor file, you can get an
      // ADD event for the bean in config.xml and MODIFY events for the beans that
      // live in the descriptor file.
      //
      // In this case, just report that this bean was added
      // (v.s. reporting what properties were set on it).
      //
      // Note: an earlier version of this code tried to process it as a normal
      // MODIFY event, but getPropertyValue for the old value got an NPE
      // from the underlying config subsystem code because the WLS REST code
      // tried to audit reading the value, and the auditing code couldn't
      // compute an object name for the old version of the mbean.
      return;
    }

    String property = this.attrType.getName();
  
    if (isModified(identity, property)) {
      // When array properties are modified, we receive separate updates
      // for each added and removed item.  We report the property once,
      // sending back the previous array and the new.
      return;
    }

    // Record that this property of this bean was modified.
    JSONObject modification = new JSONObject();
    modification.put("identity", identity);
    modification.put("restartRequired", !this.update.isDynamic());
    modification.put("unset", this.update.isUnsetUpdate());
    modification.put("property", property);
    modification.put("oldValue", getPropertyValue(this.source));
    modification.put("newValue", getPropertyValue(this.proposed));
    this.modifications.put(modification);
  }

  private void recordAddition() throws Exception {
    if (this.process == PROCESS_RESTARTS) {
      recordRestarts();
      return;
    }

    if (this.process != PROCESS_ADDITIONS) {
      // We're not handling additions at this moment.  Skip it.
      return;
    }

    JSONArray identity =
      getBeanIdentity(this.update.getAddedObject());
    if (isAdded(identity)) {
      // We've already seen and recorded this addition.  Skip it.
      // Note: if you add a server failure trigger to a cluster,
      // then we get events saying that it's been added to every server
      // in the cluster.
      return;
    }

    // Don't need to check whether it has been removed since
    // all the additions are processed before any of the removals.

    // Record that this bean was added.
    JSONObject addition = new JSONObject();
    addition.put("identity", identity);
    addition.put("restartRequired", !this.update.isDynamic());
    this.additions.put(addition);
  }

  private void recordRemoval() throws Exception {
    if (this.process == PROCESS_RESTARTS) {
      recordRestarts();
      return;
    }

    if (this.process != PROCESS_REMOVALS) {
      // We're not handling removals at this moment.  Skip it.
      return;
    }

    JSONArray identity =
      getBeanIdentity(this.update.getRemovedObject());
    if (isAdded(identity)) {
      throw new AssertionError("can't remove added bean: " + identity);
    }
    if (isRemoved(identity)) {
      // We've already seen and recorded this remioval.  Skip it.
      // Note: if you remove a server failure trigger from a cluster,
      // then we get events saying that it's been removed from every server
      // in the cluster.
      return;
    }

    // Record that this bean was removed.
    JSONObject removal = new JSONObject();
    removal.put("identity", identity);
    removal.put("restartRequired", !this.update.isDynamic());
    this.removals.put(removal);
  }

  private void recordRestarts() throws Exception {
    // Note: I never seen this return a list of elements to restart.
    // I even went into the old console and made non-dynamic changes
    // and the restart checklist table was empty.
    for (Object beanToRestart : this.update.getRestartElements()) {
      JSONArray identity = getBeanIdentity(beanToRestart);
      if (isRestart(identity)) {
        // We've already recorded that this bean needs to be restarted.
      } else {
        // Record that this bean needs to be restarted.
        JSONObject restart = new JSONObject();
        restart.put("identity", identity);
        this.restarts.put(restart);
      }
    }
  }

  private Object getPropertyValue(InvocationContext ic) throws Exception {
    Object value = BeanUtils.getBeanProperty(ic, this.attrType, true);
    if (this.attrType instanceof PropertyType) {
      // The marshaller handles expanded values
      return ((PropertyType)attrType).getMarshaller().marshal(ic, null, attrType, true);
    }
    if (this.attrType instanceof ReferencedBeanType) {
      return wrapIfExpandedValues(ic, getIdentity(value));
    }
    if (this.attrType instanceof ReferencedBeansType) {
      JSONArray refs = new JSONArray();
      for (Object ref : (Object[])value) {
        JSONObject identity = new JSONObject();
        identity.put("identity", getIdentity(ref));
        refs.put(identity);
      }
      return wrapIfExpandedValues(ic, refs);
    }
    throw
      new AssertionError(
        "getPropertyValue can't handle attrType "
        + this.type.getName()
        + " "
        + this.attrType.getName()
        + " "
        + this.attrType
      );
  }

  // Returns true if this bean or one of its parent beans has already been added.
  private boolean isAdded(JSONArray identity) throws Exception {
    return isSameOrParentedByBeans(identity, this.additions);
  }

  // Returns true if this bean or one of its parent beans has already been removed.
  private boolean isRemoved(JSONArray identity) throws Exception {
    return isSameOrParentedByBeans(identity, this.removals);
  }

  // Returns true if this bean has already been flagged for restart.
  private boolean isRestart(JSONArray identity) throws Exception {
    for (int i = 0; i < this.restarts.length(); i++) {
      JSONObject restart = this.restarts.getJSONObject(i);
      if (isSameBean(identity, restart)) {
        return true;
      }
    }
    return false;
  }

  // Returns true if this bean/property pair has already been modified.
  private boolean isModified(JSONArray identity, String property) throws Exception {
    for (int i = 0; i < this.modifications.length(); i++) {
      JSONObject modification = this.modifications.getJSONObject(i);
      if (modification.getString("property").equals(property) && isSameBean(identity, modification)) {
        return true;
      }
    }
    return false;
  }

  // Returns true if this bean or one its parent beans is in the list of beans.
  private boolean isSameOrParentedByBeans(JSONArray identity, JSONArray beans) throws Exception {
    for (int i = 0; i < beans.length(); i++) {
      JSONObject bean = beans.getJSONObject(i);
      if (isSameOrParentedByBean(identity, bean)) {
        return true;
      }
    }
    return false;
  }

  // Returns true if this bean (identity) or one its parent beans is the same as the other identity (bean)
  private boolean isSameOrParentedByBean(JSONArray identity, JSONObject bean) throws Exception {
    JSONArray otherIdentity = bean.getJSONArray("identity");
    if (identity.length() < otherIdentity.length()) {
      return false; // This bean has a shorter path so it can't possibly be the same bean or a child.
    }
    for (int i = 0; i < otherIdentity.length(); i++) {
      if (!identity.getString(i).equals(otherIdentity.getString(i))) {
        return false;
      }
    }
    return true;
  }

  // Returns true if this bean (identity) is the same as the other identity (bean)
  private boolean isSameBean(JSONArray identity, JSONObject bean) throws Exception {
    JSONArray otherIdentity = bean.getJSONArray("identity");
    if (identity.length() != otherIdentity.length()) {
      return false;
    }
    for (int i = 0; i < otherIdentity.length(); i++) {
      if (!identity.getString(i).equals(otherIdentity.getString(i))) {
        return false;
      }
    }
    return true;
  }

  // Get the property descriptor given the property's name.
  // If the property is an encrypted byte[], e.g. NodeManagerPasswordEncrypted,
  // return the corresponding string property, e.g. NodeManagerPassword.
  private PropertyDescriptor getPropertyDescriptor(String propertyName) throws Exception {
    PropertyDescriptor pd = findPropertyDescriptor(propertyName);
    String encryptedSuffix = "Encrypted";
    if (propertyName.endsWith(encryptedSuffix)) {
      if (DescriptorUtils.getBooleanField(pd, "encrypted")) {
        // This should be a byte[] encrypted property, e.g. NodeManagerPasswordEncrypted
        // Return its String twin, e.g. NodeManagerPassword
        String stringPropertyName =
          propertyName.substring(0, propertyName.length() - encryptedSuffix.length());
        return findPropertyDescriptor(stringPropertyName);
      }
    }
    return pd;
  }

  // Find the property descriptor given the property's name
  private PropertyDescriptor findPropertyDescriptor(String propertyName) throws Exception {
    for (PropertyDescriptor pd : this.type.getBeanInfo().getPropertyDescriptors()) {
      if (propertyName.equals(pd.getName())) {
        return pd;
      }
    }
    throw new AssertionError("Could not find property " + propertyName + " for " + this.type);
  }

  // Converts an unexpanded property value into an expanded value
  // if the client asked for expanded values (including finding
  // out whether the property is set).  Otherwise returns the unexpanded value.
  private Object wrapIfExpandedValues(InvocationContext ic, Object unwrappedValue) throws Exception {
    if (ic.expandedValues()) {
      JSONObject wrappedValue = new JSONObject();
      wrappedValue.put(Constants.PROP_VALUE, unwrappedValue);
      wrappedValue.put(Constants.PROP_SET, BeanUtils.isBeanPropertySet(ic, this.attrType, true));
      return wrappedValue;
    } else {
      return unwrappedValue;
    }
  }

  // Returns the bean's identity as a JSONArray of string path segments.
  // bean must not be null.
  private JSONArray getBeanIdentity(Object bean) throws Exception {
    Object identity = getIdentity(bean);
    if (identity == JSONObject.NULL) {
      throw new AssertionError("null identity");
    }
    return (JSONArray)identity;
  }

  // Returns JSONObject.NULL if the bean is null,
  // otherwise returns the bean's identity as a JSONArray of string path segments.
  private Object getIdentity(Object bean) throws Exception {
    return PathUtils.getJsonBeanPath(this.invocationContext.clone(bean));
  }
}
