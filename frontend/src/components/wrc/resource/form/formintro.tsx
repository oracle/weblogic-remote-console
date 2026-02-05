/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { ojCheckboxset } from "ojs/ojcheckboxset";
import "ojs/ojcollapsible";
import { Dispatch, useContext, useEffect, useState } from "preact/hooks";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { UserContext } from "../resource";

const CHECKBOX_KEY = "showAdvanced";

type Props = {
  formModel: FormContentModel;
  setModel?: Dispatch<FormContentModel>;
};

/**
 * FormIntro component includes the introduction html from the model if 
 * showInstructions has been enabled. Also includes the 'Show Advanced'
 * toggle, which this component will update in the model..
 * 
 * @param Props.formModel - model to render
 * @param Props.setModel - update model state
 * @returns 
 */
export const FormIntro = ({ formModel, setModel }: Props) => {
  const ctx = useContext(UserContext);

  const handleShowAdvanced = (
    event: ojCheckboxset.valueChanged<string, Array<string>, Array<string>>,
  ) => {
    formModel.showAdvanced = event.detail.value!.length > 0;

    if (setModel) {
      setModel(formModel.clone());
    }
  };

  const checkboxValue = formModel.showAdvanced ? [CHECKBOX_KEY] : [];


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

  return (
    <>
      {formModel.showInstructions ? (
        <div
          id="intro"
          class={`cfe-table-form-instructions wrc-form-intro ${isDark ? "oj-bg-neutral-180" : "oj-bg-info-20"}`}
          dangerouslySetInnerHTML={{ __html: formModel.getIntroductionHTML() }}
        />
      ) : (
        <></>
      )}
      <div
        aria-labelledby="intro-collapsible"
        class="cfe-table-form-content-header oj-flex oj-sm-flex-direction-column oj-sm-flex-wrap-nowrap"
      >
        <div
          id="show-advanced-fields-container"
          class="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end oj-flex-items-pad"
        >
          <div id="show-advanced-fields-checkboxset" class="oj-flex-item">
            <oj-checkboxset
              id="show-advanced-fields"
              style={
                formModel.hasAdvancedProperties() === false
                  ? { visibility: "hidden" }
                  : {}
              }
              value={checkboxValue}
              onvalueChanged={handleShowAdvanced}
            >
              <oj-option accesskey="[" value={CHECKBOX_KEY}>
                {t["wrc-form"].checkboxes.showAdvancedFields.label}
              </oj-option>
            </oj-checkboxset>
          </div>
        </div>
      </div>
    </>
  );
};
