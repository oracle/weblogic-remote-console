/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import "preact";

import 'oj-c/tab-bar';
import 'oj-c/conveyor-belt';

import { CTabBarElement, TabData } from 'oj-c/tab-bar';
import { ComponentChildren, h } from 'preact';
import { Dispatch, StateUpdater } from 'preact/hooks';
import { FormContentModel } from '../../shared/model/formcontentmodel';
import { Slice } from '../../shared/typedefs/pdj';
import { ContentModelFactory } from "../../shared/model/contentmodelfactory";
import { TableContentModel } from "wrc/shared/model/tablecontentmodel";
import { ListContentModel } from "wrc/shared/model/listcontentmodel";

type ModelWithSlices = FormContentModel | TableContentModel;

type Props = {
  children: ComponentChildren;
  model: ModelWithSlices;
  setModel: Dispatch<StateUpdater<FormContentModel | TableContentModel | ListContentModel>>;
  setLoading: Dispatch<boolean>;
  pageContext?: string;
};

/**
 * Create the form tabstrip container
 * 
 * @param Props.children - children of this component, typically the nested Form or SliceTable component
 * @param Props.formModel - the shared form model that is being rendered
 * @param Props.refresh - dummy prop used to toggle to refresh Form components, see setRefresh
 * @param Props.setRefresh - to refresh Form components, setRefresh(!refresh)
 */
const Tabs = ({ children, model, setModel, setLoading, pageContext }: Props) => {
    const slices = model.getSlices();

    // derive currently selected slice path from model's rdjUrl
    const getActiveSlicePath = (): string => {
      try {
        const u = new URL(model.rdjUrl, 'http://localhost');
        return u.searchParams.get('slice') || '';
      } catch {
        return '';
      }
    };
    const activeSlicePath = getActiveSlicePath();

    /**
     * Use tail recursion to build stacked oj-c-tab-bars since a slice may have children,
     * e.g. the Protocol tab bar has an Http child tab bar.
     * 
     * @param slices - array of slices for this layer of tabs
     * @param navigationPath - dot-separated list of user selected slices (e.g. Protocols.Http)
     * @returns jsx component representing a single oj-c-tab-bar)
     */
    const getTabBar = (slices: Slice[], navigationPath = ''): ComponentChildren => {
        // map the slice representation to what oj-c-tab-bar needs
        const data: TabData<string>[] = slices.map(slice => { return { label: slice.label, itemKey: slice.name } });

        // when user clicks on a tab, update the model with a new one to refresh form
        const handleSelectionAction = (event: CTabBarElement.selectionChanged) => {
          setLoading(true);
          const newItemKey = `${event.detail.value}`; // coerce to a string as that's what it is

          // path to + the name of the new tab e.g. Protocols.Http
          const fullyQualifiedNewSlice = navigationPath + newItemKey;

          // Create a new content model based on the existing rdj url and newly selected slice
          const modelFactory = new ContentModelFactory(model.rdjUrl);
          modelFactory.build(fullyQualifiedNewSlice, pageContext).then((contentModel) => {
            if (contentModel) {
              setModel(contentModel);
              setLoading(false);
            }
          });
        };

        const getSelectedSegmentForLevel = (navPath: string, allSlices: Slice[]) => {
          if (activeSlicePath && activeSlicePath.startsWith(navPath)) {
            const remaining = activeSlicePath.substring(navPath.length);
            const segment = remaining.split('.')[0];
            if (segment && allSlices.some((s) => s.name === segment)) return segment;
          }
          return allSlices[0]?.name;
        };

        const currentlySelectedTab = getSelectedSegmentForLevel(navigationPath, slices);
        const selectedSlice = slices.find((s) => s.name === currentlySelectedTab);

        return (
            <>
                <oj-c-conveyor-belt arrowVisibility="auto" class="oj-sm-12">
                  <oj-c-tab-bar selection={currentlySelectedTab}
                      onselectionChanged={handleSelectionAction}
                      accesskey="]" edge="top" layout="condense" data={data}>
                  </oj-c-tab-bar>
                </oj-c-conveyor-belt>
                {selectedSlice?.slices ? getTabBar(selectedSlice.slices, `${navigationPath}${currentlySelectedTab}.`) : <></>}
            </>
        );
    }

    return (
      <>
        <div id="form-tabstrip-container" class="oj-flex">
          {/* <div id="cfe-form-tabstrip-container" class="cfe-form-tabstrip"> */}
            <div
              class="oj-flex-item oj-sm-12 tabbar-container oj-sm-padding-2x-horizontal"
              role="application"
            >
              {slices ? getTabBar(slices) : <></>}
            </div>
          </div>
        {/* </div> */}
        {children}
      </>
    );
}

//@ts-ignore
const UNUSED = h;

export default Tabs;
