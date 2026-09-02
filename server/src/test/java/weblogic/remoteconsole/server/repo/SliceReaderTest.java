// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import org.junit.jupiter.api.Test;
import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SliceReaderTest {

  @Test
  void checksExistenceOnlyForMissingMandatoryStandardEditCollectionChild() {
    assertTrue(SliceReader.shouldCheckBeanExists(false, false, "", true));
    assertFalse(SliceReader.shouldCheckBeanExists(true, false, "", true));
    assertFalse(SliceReader.shouldCheckBeanExists(false, true, "", true));
    assertFalse(SliceReader.shouldCheckBeanExists(false, false, "customizePage", true));
    assertFalse(SliceReader.shouldCheckBeanExists(false, false, "", false));
  }

  @Test
  void classifiesExistingInaccessibleEditBeanAsForbidden() {
    Response<Page> response =
      SliceReader.classifyMissingEditBean(
        new Response<Boolean>().setSuccess(true),
        "Access to 'AdminServer' is forbidden."
      );

    assertTrue(response.isForbidden());
    assertEquals(1, response.getMessages().size());
    assertEquals("Access to 'AdminServer' is forbidden.", response.getMessages().get(0).getText());
  }

  @Test
  void keepsMissingEditBeanAsNotFound() {
    Response<Page> response =
      SliceReader.classifyMissingEditBean(
        new Response<Boolean>().setSuccess(false),
        "Access to 'AdminServer' is forbidden."
      );

    assertTrue(response.isNotFound());
    assertTrue(response.getMessages().isEmpty());
  }

  @Test
  void propagatesExistenceCheckFailure() {
    Response<Boolean> existsResponse =
      new Response<Boolean>().setTimeout().addFailureMessage("Existence check timed out");

    Response<Page> response =
      SliceReader.classifyMissingEditBean(
        existsResponse,
        "Access to 'AdminServer' is forbidden."
      );

    assertTrue(response.isTimeout());
    assertEquals("Existence check timed out", response.getMessages().get(0).getText());
  }

  @Test
  void replacesGenericForbiddenMessageWithSliceContext() {
    Response<Page> response =
      SliceReader.addSliceContextToForbidden(
        new Response<Page>().setForbidden().addFailureMessage("Forbidden"),
        "Access to 'Messages' is forbidden."
      );

    assertTrue(response.isForbidden());
    assertEquals(1, response.getMessages().size());
    assertEquals("Access to 'Messages' is forbidden.", response.getMessages().get(0).getText());
  }

  @Test
  void doesNotReplaceNonForbiddenFailure() {
    Response<Page> notFound = new Response<Page>().setNotFound();

    Response<Page> response =
      SliceReader.addSliceContextToForbidden(notFound, "Access to 'Messages' is forbidden.");

    assertSame(notFound, response);
  }

  @Test
  void preservesAlreadyContextualForbiddenMessage() {
    Response<Page> contextual =
      new Response<Page>().setForbidden().addFailureMessage("Access to 'AdminServer' is forbidden.");

    Response<Page> response =
      SliceReader.addSliceContextToForbidden(contextual, "Access to 'General' is forbidden.");

    assertSame(contextual, response);
  }

  @Test
  void findsRequestedParentAndNestedSliceDefinitions() {
    SliceDef view = createSliceDef("View", List.of());
    SliceDef messages = createSliceDef("Messages", List.of(view));
    List<SliceDef> slices = List.of(messages);

    assertSame(messages, SliceReader.findRequestedSliceDef(slices, new Path("Messages")));
    assertSame(view, SliceReader.findRequestedSliceDef(slices, new Path("Messages.View")));
  }

  private SliceDef createSliceDef(String name, List<SliceDef> contentDefs) {
    return new SliceDef() {
      @Override
      public SlicesDef getSlicesDef() {
        return null;
      }

      @Override
      public SliceDef getSliceDef() {
        return null;
      }

      @Override
      public List<SliceDef> getContentDefs() {
        return contentDefs;
      }

      @Override
      public LocalizableString getLabel() {
        return new LocalizableString(name);
      }

      @Override
      public String getName() {
        return name;
      }
    };
  }
}