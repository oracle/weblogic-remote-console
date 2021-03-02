// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.index;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.apache.lucene.analysis.core.StopAnalyzer;
import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.IOUtils;
import org.junit.jupiter.api.Test;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.driver.WeblogicSliceForm;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.search.PageResults;
import weblogic.console.backend.search.Searcher;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.typedesc.WeblogicVersions;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** */
public class PageIndexerTest {

  private WeblogicBeanTypes types =
    new WeblogicBeanTypes(WeblogicVersions.getCurrentVersion().getDomainVersion());

  @Test
  public void testIt() throws Exception {
    WeblogicPage wp = new WeblogicPage();
    wp.setIntroductionHTML("<p>hello</p>");

    wp.setHelpPageTitle("Server: General");
    WeblogicSliceForm f = new WeblogicSliceForm();
    wp.setSliceForm(f);

    String weblogicVersion = "";
    String bundleDir = "";
    PageIndexer c = new PageIndexer(weblogicVersion, bundleDir);

    PagePath pp =
      PagePath.newSlicePagePath(
        PagesPath.newConfigurationPagesPath(this.types, this.types.getType("ServerMBean")),
        new weblogic.console.backend.utils.Path("General")
      );

    Document d = c.convert(pp, wp);

    Path directory = Files.createTempDirectory("index");
    FSDirectory fsDirectory = FSDirectory.open(directory);
    StopAnalyzer analyzer = new StopAnalyzer(EnglishAnalyzer.ENGLISH_STOP_WORDS_SET);
    IndexWriter indexWriter = new IndexWriter(fsDirectory, new IndexWriterConfig(analyzer));

    indexWriter.addDocument(d);

    indexWriter.close();

    Searcher searcher = new Searcher();

    List<PageResults> results = searcher.search(directory.normalize().toString(), "hello");

    assertEquals(1, results.size());

    PageResults pr = results.iterator().next();
    assertEquals("ServerMBean?view=General", pr.getPagePath());
    assertEquals("Server: General", pr.getPageTitle());

    // Cleanup temp area but prevent test failure
    // when test temporary folder cannot be removed!
    try {
      IOUtils.rm(directory);
    } catch (Exception e) {
      /* e.printStackTrace(); */
    }
  }
}
