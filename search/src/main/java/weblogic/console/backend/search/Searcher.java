// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.search;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.lucene.analysis.core.StopAnalyzer;
import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.store.FSDirectory;

public class Searcher {

  public static final String INTRODUCTION = "introduction";
  public static final String PAGE_PATH = "pagePath";
  public static final String PROPERTY_HELP_FIELD = "propertyHelpField";
  public static final String SLICE = "slice";
  public static final String TITLE = "title";

  public static final String[] MULTI_FIELD_QUERY_FIELDS =
    new String[] {INTRODUCTION, PROPERTY_HELP_FIELD};

  public static final int DEFAULT_COUNT_LIMIT = 25;

  private static Map<String, IndexSearcher> indexSearchers = new HashMap<>();
  private final StopAnalyzer analyzer = new StopAnalyzer(EnglishAnalyzer.ENGLISH_STOP_WORDS_SET);

  public List<PageResults> search(String index, String queryString) throws Exception {
    List<PageResults> results = new ArrayList<>();

    IndexSearcher indexSearcher = getIndexSearcher(index);

    // QueryParser isn't threadsafe...
    QueryParser parser = new MultiFieldQueryParser(MULTI_FIELD_QUERY_FIELDS, analyzer);
    Query query = parser.parse(queryString.toLowerCase());

    ScoreDoc[] hits = indexSearcher.search(query, DEFAULT_COUNT_LIMIT).scoreDocs;

    for (ScoreDoc scoreDoc : hits) {
      Document hitDoc = indexSearcher.doc(scoreDoc.doc);

      PageResults pr = new PageResults();
      pr.setPagePath(hitDoc.get(PAGE_PATH));
      pr.setPageTitle(hitDoc.get(TITLE));
      results.add(pr);
    }

    return results;
  }

  protected IndexSearcher getIndexSearcher(String index) throws IOException {

    IndexSearcher searcher = indexSearchers.get(index);

    if (searcher != null) {
      return searcher;
    }

    Path indexPath = Paths.get(index);

    FSDirectory fsDirectory = FSDirectory.open(indexPath);

    DirectoryReader ireader = DirectoryReader.open(fsDirectory);
    searcher = new IndexSearcher(ireader);

    indexSearchers.put(index, searcher);

    return searcher;
  }
}
