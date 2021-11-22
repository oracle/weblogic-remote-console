// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Contains overall information about a Weblogic version, including how to get to its public
 * documentation.
 *
 * Also supports caching objects (by their class) on the version.
 */
public class WebLogicVersion {
  // Caches objects associated with this version
  private ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();

  // Whether this instance is the current wls version,
  // i.e. the one that the hand coded yaml files were
  // written to match.
  private boolean currentVersion;

  public boolean isCurrentVersion() {
    return this.currentVersion;
  }

  // The version returned by DomainMBean.getDomainVersion():
  private String domainVersion;

  public String getDomainVersion() {
    return this.domainVersion;
  }

  // The FMW_VERSION environment variable for the weblogic version's kit.
  // Used for constructing generic documentation urls.
  private String fmwVersion;

  private String getFmwVersion() {
    return this.fmwVersion;
  }

  // The top level url of the website containing this release's public documentation
  private String docsUrl;

  private String getDocsUrl() {
    return this.docsUrl;
  }

  // The directory, relative to docsUrl, of the url containing this release's public mbean javadoc
  private String mbeanJavadocDirectory;

  private String getMBeanJavadocDirectory() {
    return this.mbeanJavadocDirectory;
  }

  // Get the url for the public mbean javadoc for an mbean interface
  // mbeanType is the leaf class name of the mbean type, e.g. ServerMBean or ServerRuntimeMBean
  public String getMBeanTypeJavadocUrl(String mbeanType) {
    return getDocsUrl() + "/" + getMBeanJavadocDirectory() + "/" + mbeanType + ".html";
  }

  // Get the url for the public mbean javadoc for an mbean attribute
  public String getMBeanAttributeJavadocUrl(String mbeanType, String attribute) {
    return getMBeanTypeJavadocUrl(mbeanType) + "#" + attribute;
  }

  // Get the url for an edocs help topic
  public String getEdocsHelpTopicUrl(String relativeHelpTopicUrl) {
    return getDocsUrl() + "/" + relativeHelpTopicUrl;
  }

  // Get the url for a generic help topic, replacing @FMW_VERSION with this verion's fmw version
  public String getGenericHelpTopicUrl(String genericTopicUrl) {
    return genericTopicUrl.replaceAll("@FMW_VERSION@&amp;", getFmwVersion() + "&");
  }

  /**
   * Place an instance of the Class type into the cache.
   *
   * @param key The Class type for cached object
   * @param value The instance to be placed into the ache
   */
  private <T> T putCache(Class<T> clazz, Set<String> roles, T value) {
    // Place the instance object into the cache
    cache.put(computeCacheKey(clazz, roles), value);
    return value;
  }

  /**
   * Obtain the cached Class type associated with this instance.
   *
   * @param key The Class type used to place the object into the cache
   */
  private <T> T getCache(Class<T> clazz, Set<String> roles) {
    T result = null;

    // Look for the cached object and cast to the specified type
    Object object = cache.get(computeCacheKey(clazz, roles));
    if ((object != null) && object.getClass().isAssignableFrom(clazz)) {
      result = clazz.cast(object);
    }

    // Return result or null when not available...
    return result;
  }

  private String computeCacheKey(Class<?> clazz, Set<String> roles) {
    StringBuilder sb = new StringBuilder();
    sb.append(clazz.getName());
    if (roles.contains(WebLogicRoles.ADMIN)) {
      // The user is an Admin and has permission to do anything.
      // The user's other roles don't matter.
      // Cache under just the Admin role so that the entry
      // can be shared by other users that are in the Admin
      // role plus any other roles.
      roles = WebLogicRoles.ADMIN_ROLES;
    }
    for (String role : new TreeSet<String>(roles)) { // sort the roles
      sb.append("_").append(role);
    }
    return sb.toString();
  }

  /**
   * Obtain the cached Class type associated with this instance for a user in the Admin role.
   * If there isn't one already cached, use the factory to create one
   * then store it in the cache.
   *
   * @param clazz The class to be created
   */
  public <T> T findOrCreate(Class<T> clazz) {
    return findOrCreate(clazz, WebLogicRoles.ADMIN_ROLES);
  }

  /**
   * Obtain the cached Class type associated with this instance.
   * If there isn't one already cached, use the factory to create one
   * then store it in the cache.
   *
   * @param clazz The class to be created
   * @param roles The WebLogic roles of the user that will be accessing the instance
   *              (used to trim the pages & beans to what the user is allowed to access)
   */
  public <T> T findOrCreate(Class<T> clazz, Set<String> roles) {
    T instance = getCache(clazz, roles);
    if (instance == null) {
      synchronized (this) {
        instance = getCache(clazz, roles);
        if (instance == null) {
          try {
            instance =
              putCache(
                clazz,
                roles,
                clazz.getDeclaredConstructor(WebLogicVersion.class, Set.class).newInstance(this, roles)
              );
          } catch (Exception e) {
            // These are all exceptions having to do with reflection and should
            // never happen once we're done writing the code
            throw new AssertionError("Error instantiating RepoDef", e);
          }
        }
      }
    }
    return instance;
  }

  /*package*/ WebLogicVersion(
    boolean currentVersion,
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory
  ) {
    this.currentVersion = currentVersion;
    this.domainVersion = domainVersion;
    this.fmwVersion = fmwVersion;
    this.docsUrl = docsUrl;
    this.mbeanJavadocDirectory = mbeanJavadocDirectory;
  }
}
