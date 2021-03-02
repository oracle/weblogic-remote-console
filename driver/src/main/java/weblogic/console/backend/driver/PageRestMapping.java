// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.utils.Path;

/**
 * Repackages static information about a page and its type so that the RDS can efficiently
 * convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a page:
 * <ul>
 *   <li>
 *     pageSource -
 *     the page's WeblogicPageSource
 *     (i.e the contents of the PDY and the page's WeblogicBeanType)
 *   </li>
 *   <li>
 *     foldedBeanPath -
 *     the folded bean path to the page, in RDJ terms, minus identities e.g.
 *     <pre>[ Servers, NetworkAccessPoints ]</pre>
 *   </li>
 *   <li>
 *     rootPathSegment -
 *     the tree of bean path segments (i.e. mbeans) that are needed to populate
 *     the RDJ for this page, starting at the domain mbean.
 *     <p>
 *     the tree includes all the mbeans whose properties appear on the page
 *     as well as reference properties from other mbeans that are used to compute
 *     lists of available references for a property.
 *     <p>
 *     for example, the Server General page needs:
 *     <ul>
 *       <li>root path segment - i.e. DomainMBean, no properties</li>
 *       <li>Servers path segment - i.e. ServerMBean, Name & ListenPort properties</li>
 *       <li>SSL path segment - i.e. SSLMBean. ListenPort property</li>
 *       <li>Machines path segment - i.e. MachineMBean, for the list of available machines</li>
 *       <li>Clusters path segment - i.e. ClusterMBean, for the list of available clusers</li>
 *     </ul>
 *   </li>
 *   <li>
 *     pagePathSegment -
 *     the tree of bean path segments for the properties that are displayed on the page,
 *     starting at its top level folded bean.
 *     <p>
 *     for example, the Server General page needs:
 *     <ul>
 *       <li>Servers path segment - (i.e. ServerMBean), Name & ListenPort properties</li>
 *       <li>SSL path segment - (i.e. SSLMBean) ListenPort property</li>
 *     </ul>
 *   </li>
 *   <li>
 *     subTypeDiscriminatorProperty -
 *     <p>
 *     if the page's type is heterogeneous, this value contains the PropertyRestMapping
 *     that gets to the instance's sub type discriminator
 *     <p>
 *     if the page's type is heterogeneous, this value is null
 *   </li>
 * </ul>
 */
public class PageRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PageRestMapping.class.getName());

  private WeblogicPageSource pageSource;

  public WeblogicPageSource getPageSource() {
    return this.pageSource;
  }

  private Path foldedBeanPath;

  public Path getFoldedBeanPath() {
    return this.foldedBeanPath;
  }

  private PathSegmentRestMapping rootPathSegment;

  public PathSegmentRestMapping getRootPathSegment() {
    return this.rootPathSegment;
  }

  private PathSegmentRestMapping pagePathSegment;

  public PathSegmentRestMapping getPagePathSegment() {
    return this.pagePathSegment;
  }

  /*package*/ void setPagePathSegment(PathSegmentRestMapping pagePathSegment) {
    this.pagePathSegment = pagePathSegment;
  }

  private PropertyRestMapping subTypeDiscriminatorProperty;

  public PropertyRestMapping getSubTypeDiscriminatorProperty() {
    return this.subTypeDiscriminatorProperty;
  }

  /*package*/ void setSubTypeDiscriminatorProperty(
      PropertyRestMapping subTypeDiscriminatorProperty) {
    this.subTypeDiscriminatorProperty = subTypeDiscriminatorProperty;
  }

  public PageRestMapping(WeblogicPageSource pageSource, Path foldedBeanPath) throws Exception {
    this.pageSource = pageSource;
    this.foldedBeanPath = foldedBeanPath;
    this.rootPathSegment = new PathSegmentRestMapping(this);
  }

  // Optional custom plugin code to handle delete for this page
  private TypePluginRestMapping deletePlugin;

  /*package*/ void setDeletePlugin(TypePluginRestMapping deletePlugin) {
    this.deletePlugin = deletePlugin;
  }

  public TypePluginRestMapping getDeletePlugin() {
    return this.deletePlugin;
  }

  @Override
  public String toString() {
    try {
      StringBuilder sb = new StringBuilder();
      sb
        .append("PageRestMapping(")
        .append("pageSource=")
        .append(getPageSource().getPagePath())
        .append(", foldedBeanPath=")
        .append(getFoldedBeanPath())
        .append(")");
      return sb.toString();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
