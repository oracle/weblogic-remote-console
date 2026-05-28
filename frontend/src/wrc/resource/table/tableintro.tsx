/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { TableContentModel } from "../../shared/model/tablecontentmodel";
import "ojs/ojcollapsible";
import { useEffect, useState } from "preact/hooks";

/**
 * TableIntro component includes the introduction html from the model 
 */
export const TableIntro = ({ tableContent }: { tableContent: TableContentModel }) => {

  // Track dark mode so we can swap background utility classes
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const target = document.getElementById("globalBody");
    const compute = () =>
      setIsDark(!!target && target.classList.contains("oj-color-invert"));
    compute();
    const observer = new MutationObserver(compute);
    if (target) {
      observer.observe(target, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer.disconnect();
  }, []);

  const introHTML = tableContent?.getIntroductionHTML() || "";

  return (
    <>
      {introHTML ? (
        <div
          id="intro"
          class={`cfe-table-form-instructions ${isDark ? "oj-bg-neutral-180" : "oj-bg-info-20"} wrc-table-intro`}
          dangerouslySetInnerHTML={{ __html: introHTML }}
        />
      ) : null}
    </>
  );
};
