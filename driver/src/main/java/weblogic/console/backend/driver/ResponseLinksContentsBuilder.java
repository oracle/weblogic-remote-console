// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.pagedesc.LinkSource;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PerspectivePath;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanIdentitySegment;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * Fills in the links contents section of an RDJ based on
 * the path to the RDJ and the corresponding mbean type's
 * links.yaml file.
 * <p>
 * If the list isn't empty, then it adds the following to the RDJ:
 * <pre>
 * "links": [
 * ]
 */
public class ResponseLinksContentsBuilder {
  private JsonObjectBuilder responseBuilder;

  private Localizer localizer;

  private Localizer getLocalizer() {
    return this.localizer;
  }

  private JsonObjectBuilder getResponseBuilder() {
    return this.responseBuilder;
  }

  private WeblogicPageSource pageSource;

  private WeblogicBeanIdentity identity;

  /**
   * Constructor
   *
   * @param responseBuilder - the RDJ that the links contents will be added to
   *
   * @param pageSource - the RDJ's corresponding page definition
   * 
   * @param pageBeanIdentity - the RDJ's corresponding identity,
   *
   * @param localizer - for localizing strings based on the domain's weblogic version and the
   */
  public ResponseLinksContentsBuilder(
    JsonObjectBuilder responseBuilder,
    WeblogicPageSource pageSource,
    WeblogicBeanIdentity identity,
    Localizer localizer
  ) {
    this.responseBuilder = responseBuilder;
    this.pageSource = pageSource;
    this.identity = identity;
    this.localizer = localizer;
  }

  /**
   * Adds the nodes that correspond to this bean's links.yaml to the RDJ.
   */
  public void addContentsToResponse() throws Exception {
    List<LinkSource> links;
    if (identity.isCollection()) {
      links = pageSource.getCollectionLinks();
    } else {
      links = pageSource.getInstanceLinks();
    }
    if (links != null) {
      JsonArray linksJson = createLinksContents(links);
      if (linksJson != null) {
        getResponseBuilder().add("links", linksJson);
      }
    }
  }

  private JsonArray createLinksContents(
    List<LinkSource> links
  ) throws Exception {
    if (links.isEmpty()) {
      return null;
    }
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (LinkSource link : links) {
      JsonObject linkJson = createOneLink(link);
      if (linkJson != null) {
        bldr.add(linkJson);
      } else {
        // this link doesn't match
      }
    }
    JsonArray linksContents = bldr.build();
    return linksContents.isEmpty() ? null : linksContents;
  }

  private void addResourceIdentity(
    JsonObjectBuilder bldr,
    Path url
  ) throws Exception {
    WeblogicBeanTypes types = identity.getRootType().getTypes();
    PerspectivePath perspectivePath =
      PerspectivePath.newPerspectivePath(types, url.getFirstComponent());
    WeblogicBeanType root = perspectivePath.getRootBeanType();
    WeblogicBeanIdentity resourceIdentity = types.getWeblogicBeanIdentityFromFoldedBeanPathWithIdentities(
          root, url.subPath(3, -1));
    ResponseIdentityBuilder identityBuilder = 
      new ResponseIdentityBuilder(perspectivePath, localizer);
    for (WeblogicBeanIdentitySegment segment : resourceIdentity.getSegments()) {
      if (segment.isFoldedSingleton()) {
        continue;
      }
      if (segment.getKey() != null) {
        identityBuilder.addProperty(segment.getProperty(), segment.getKey());
      } else {
        identityBuilder.addProperty(segment.getProperty());
      }
    }
    bldr.add("resourceIdentity", identityBuilder.build());
  }

  /**
   * Creates a link node and its children's nodes (recursively)
   */
  private JsonObject createOneLink(LinkSource link) throws Exception {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    String label = null;
    String notFoundMessage = null;
    label = getLocalizer().localizeString(
      LocalizationUtils.linkLabelKey(
        pageSource,
        link.getLabel(),
        identity.isCollection()
      )
    );
    if (!StringUtils.isEmpty(link.getNotFoundMessage())) {
      notFoundMessage = getLocalizer().localizeString(
        LocalizationUtils.linkNotFoundKey(
          pageSource,
          link.getLabel(),
          identity.isCollection()
        )
      );
    }
    if (!StringUtils.isEmpty(label)) {
      bldr.add("label", label);
    }
    if (!StringUtils.isEmpty(notFoundMessage)) {
      bldr.add("notFoundMessage", link.getNotFoundMessage());
    }
    Path url = new Path();
    Path urlPattern = new Path(link.getResourceData().replaceAll("/","."));
    for (String patternComponent : urlPattern.getComponents()) {
      String urlComponent = patternComponent;
      if (patternComponent.startsWith("<")) {
        if (!patternComponent.endsWith(">")) {
          throw new Exception("Poorly formed link: " + urlComponent);
        }
        String symbol = patternComponent.substring(1, patternComponent.length() - 1);
        String found = null;
        for (WeblogicBeanIdentitySegment segment : identity.getSegments()) {
          if (segment.getBeanType().getSimpleName().equals(symbol)) {
            found = segment.getKey();
            break;
          }
        }
        if (found == null) {
          // This can happen and it is okay.  This means that the pattern
          // doesn't match and we simply don't use it.  A good example of
          // imagine a link for NetworkAccessPointMBean that says:
          // monitoring/data/DomainRuntime/ServerRuntimes/<Server>/ServerChannelRuntimes
          // NetworkAccessPointMBean also appears under ServerTemplateMBean and
          // does not have a "Server" in it anywhere.  We can simply skip it.
          return null;
        }
        urlComponent = found;
      }
      url.addComponent(urlComponent);
    }
    addResourceIdentity(bldr, url);
    bldr.add("resourceData", url.getRelativeUri());
    return bldr.build();
  }
}
