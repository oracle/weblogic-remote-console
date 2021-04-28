// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.index;

import java.net.URI;
import java.net.URL;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.logging.Logger;

import org.apache.lucene.analysis.core.StopAnalyzer;
import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;
import org.jsoup.Jsoup;
import weblogic.console.backend.driver.FormSection;
import weblogic.console.backend.driver.VersionedWeblogicPagesFactory;
import weblogic.console.backend.driver.WeblogicCreateForm;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.driver.WeblogicProperty;
import weblogic.console.backend.driver.WeblogicSliceForm;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PageSourceWalker;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.search.Searcher;
import weblogic.console.backend.typedesc.WeblogicVersions;

/** */
public class PageIndexer extends PageSourceWalker {

  private static final Logger LOGGER = Logger.getLogger(PageIndexer.class.getName());

  private List<WeblogicPageSource> pageSources = new ArrayList<>();

  private String bundleDir;

  private String getBundleDir() {
    return this.bundleDir;
  }

  public static void main(String[] args) {
    LOGGER.info("PageIndexer.main");
    try {
      String bundleDir = args[0];
      /*
      for (String weblogicVersion : WeblogicVersions.getSupportedVersions()) {
        (new PageIndexer(weblogicVersion, bundleDir)).buildPageHelpIndex();
      }
      */
      // We're not exposing search in MVP and it takes about 5 seconds per wls version
      // to build the indexes.  So, for now, only build one version.
      (new PageIndexer(WeblogicVersions.getCurrentVersion().getDomainVersion(), bundleDir))
        .buildPageHelpIndex();
    } catch (Exception e) {
      e.printStackTrace();
      // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
      // Exit is fine because this is a standalone utility
      System.exit(1);
    }
  }

  public PageIndexer(String weblogicVersion, String bundleDir) {
    super(
      weblogicVersion,
      true // only visit each type once
    );
    this.bundleDir = bundleDir;
  }

  public List<String> findLocales() throws Exception {

    String resourceBundleName =
      LocalizationUtils.getResourceBundleName(getTypes().getWeblogicVersion());
    URL defaultBundle = getClass().getResource("/" + resourceBundleName + ".properties");
    Path path = null;
    FileSystem fs = null;
    try {
      if ("jar".equals(defaultBundle.getProtocol())) {
        String[] array = defaultBundle.toString().split("!");
        fs = FileSystems.newFileSystem(URI.create(array[0]), new HashMap<>());
        path = fs.getPath(array[1]);
      } else {
        path = Paths.get(defaultBundle.toURI());
      }
      return findLocales(path, resourceBundleName);
    } finally {
      if (fs != null) {
        fs.close();
      }
    }
  }

  private List<String> findLocales(Path path, String resourceBundleName) throws Exception {
    List<String> locales = new ArrayList<>();

    path = path.getParent();

    DirectoryStream<Path> stream =
      Files.newDirectoryStream(path, entry -> entry.toString().contains(resourceBundleName));

    for (Path entry : stream) {
      String language = entry.getFileName().toString();

      // bundle.properties -> ""
      // bundle_fr.properties -> "fr"
      language = language.replaceAll(resourceBundleName, "");
      language = language.replaceAll(".properties", "");
      language = language.replaceAll("_", "");
      locales.add(language);
    }

    locales.add("en"); // for the default locale
    return locales;
  }

  public void buildPageHelpIndex() throws Exception {
    List<String> locales = findLocales();

    for (String locale : locales) {
      Locale localeObj = new Locale.Builder().setLanguage(locale).build();

      Localizer localizer = new Localizer(getTypes().getWeblogicVersion(), localeObj);
      walk();

      Path directory =
        // FortifyIssueSuppression Path Manipulation
        // This is a build tool, so this is not a concern
        Paths.get(getBundleDir() + "/" + getTypes().getWeblogicVersion() + "/" + locale);
      FSDirectory fsDirectory = FSDirectory.open(directory);
      StopAnalyzer analyzer = new StopAnalyzer(EnglishAnalyzer.ENGLISH_STOP_WORDS_SET);
      IndexWriter indexWriter = new IndexWriter(fsDirectory, new IndexWriterConfig(analyzer));

      for (WeblogicPageSource pageSource : pageSources) {

        PagePath pagePath = pageSource.getPagePath();

        WeblogicPage page =
          VersionedWeblogicPagesFactory.INSTANCE
            .getVersionedWeblogicPages(getTypes().getWeblogicVersion())
            .getLocalizedWeblogicPages()
            .getPage(pagePath, localizer);

        Document d = convert(pagePath, page);
        indexWriter.addDocument(d);
      }
      indexWriter.close();
    }
  }

  public Document convert(PagePath pagePath, WeblogicPage page) {

    Document document = new Document();

    document.add(new TextField(Searcher.PAGE_PATH, pagePath.getURI(), Field.Store.YES));
    document.add(new TextField(Searcher.TITLE, page.getHelpPageTitle(), Field.Store.YES));
    String intro = textify(page.getIntroductionHTML());
    document.add(new TextField(Searcher.INTRODUCTION, intro, Field.Store.NO));

    WeblogicSliceForm sf = page.getSliceForm();
    if (sf != null) {
      for (FormSection section : sf.getSections()) {
        addPropertyHelpFields(document, section.getProperties());
      }
    }

    WeblogicCreateForm cf = page.getCreateForm();
    if (cf != null) {
      addPropertyHelpFields(document, cf.getProperties());
    }

    return document;
  }

  protected void addPropertyHelpFields(Document document, List<WeblogicProperty> properties) {
    for (WeblogicProperty property : properties) {
      addPropertyHelpFields(document, property);
    }
  }

  protected void addPropertyHelpFields(Document document, WeblogicProperty property) {
    document.add(
      new TextField(
        Searcher.PROPERTY_HELP_FIELD,
        property.getLabel() + " " + textify(property.getDetailedHelpHTML()),
        Field.Store.NO));
  }

  protected String textify(String introHTML) {
    return Jsoup.parse(introHTML).text();
  }

  @Override
  protected void processPage(
      WeblogicPageSource pageSource, weblogic.console.backend.utils.Path foldedBeanPath) {
    if (pageSource != null) {
      pageSources.add(pageSource);
    }
  }
}
