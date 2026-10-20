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
import { Dispatch, StateUpdater, useContext, useEffect, useRef, useState } from 'preact/hooks';
import { FormContentModel } from '../../shared/model/formcontentmodel';
import { Slice } from '../../shared/typedefs/pdj';
import { ContentModelFactory } from "../../shared/model/contentmodelfactory";
import { TableContentModel } from "wrc/shared/model/tablecontentmodel";
import { ListContentModel } from "wrc/shared/model/listcontentmodel";
import { broadcastErrorMessage } from "wrc/shared/controller/notification-utils";
import { UserContext } from "../resource";

type ModelWithSlices = FormContentModel | TableContentModel;

type Props = {
  children: ComponentChildren;
  model: ModelWithSlices;
  setModel: Dispatch<StateUpdater<FormContentModel | TableContentModel | ListContentModel>>;
  setLoading: Dispatch<boolean>;
  pageContext?: string;
};

type LoadSliceOptions = {
  modelFactory: Pick<ContentModelFactory, "build">;
  pageContext?: string;
  setLoading: Dispatch<boolean>;
  setModel: Dispatch<StateUpdater<FormContentModel | TableContentModel | ListContentModel>>;
  slice: string;
  onError: (error: Error) => void;
};

export const loadSlice = async ({
  modelFactory,
  pageContext,
  setLoading,
  setModel,
  slice,
  onError,
}: LoadSliceOptions): Promise<boolean> => {
  setLoading(true);
  try {
    const contentModel = await modelFactory.build(slice, pageContext);
    if (contentModel) {
      setModel(contentModel);
      return true;
    }
    return false;
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
    return false;
  } finally {
    setLoading(false);
  }
};

export const getSlicePath = (rdjUrl: string): string => {
  try {
    const url = new URL(rdjUrl, 'http://localhost');
    return url.searchParams.get('slice') || '';
  } catch {
    return '';
  }
};

export const getSelectedSegmentForLevel = (
  selectedSlicePath: string,
  navigationPath: string,
  slices: Slice[],
): string | undefined => {
  if (selectedSlicePath && selectedSlicePath.startsWith(navigationPath)) {
    const remaining = selectedSlicePath.substring(navigationPath.length);
    const segment = remaining.split('.')[0];
    if (segment && slices.some((slice) => slice.name === segment)) {
      return segment;
    }
  }
  return slices[0]?.name;
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
    const ctx = useContext(UserContext);
    const slices = model.getSlices();
    const successfulSlicePath = getSlicePath(model.rdjUrl);
    const [selectedSlicePath, setSelectedSlicePath] = useState(successfulSlicePath);
    const selectionRequestRef = useRef(0);
    const successfulSlicePathRef = useRef(successfulSlicePath);
    const renderedSlicePath =
      successfulSlicePathRef.current === successfulSlicePath
        ? selectedSlicePath
        : successfulSlicePath;

    useEffect(() => {
      if (successfulSlicePathRef.current !== successfulSlicePath) {
        successfulSlicePathRef.current = successfulSlicePath;
        selectionRequestRef.current += 1;
        setSelectedSlicePath(successfulSlicePath);
        setLoading(false);
      }
    }, [setLoading, successfulSlicePath]);

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
        const handleSelectionAction = (event: CTabBarElement.ojSelectionAction) => {
          const newItemKey = `${event.detail.value}`; // coerce to a string as that's what it is
          if (`${event.detail.previousValue}` === newItemKey) {
            return;
          }

          // path to + the name of the new tab e.g. Protocols.Http
          const fullyQualifiedNewSlice = navigationPath + newItemKey;
          const requestId = ++selectionRequestRef.current;
          setSelectedSlicePath(fullyQualifiedNewSlice);

          // Create a new content model based on the existing rdj url and newly selected slice
          const modelFactory = new ContentModelFactory(model.rdjUrl);
          void loadSlice({
            modelFactory,
            pageContext,
            setLoading: (loading) => {
              if (loading || selectionRequestRef.current === requestId) {
                setLoading(loading);
              }
            },
            setModel: (contentModel) => {
              if (selectionRequestRef.current === requestId) {
                setModel(contentModel);
              }
            },
            slice: fullyQualifiedNewSlice,
            onError: (error) => {
              if (selectionRequestRef.current === requestId) {
                broadcastErrorMessage(ctx, error);
              }
            },
          }).then((loaded) => {
            if (!loaded && selectionRequestRef.current === requestId) {
              setSelectedSlicePath(successfulSlicePathRef.current);
            }
          });
        };

        const currentlySelectedTab =
          getSelectedSegmentForLevel(renderedSlicePath, navigationPath, slices);
        const selectedSlice = slices.find((s) => s.name === currentlySelectedTab);

        return (
            <>
                <oj-c-conveyor-belt arrowVisibility="auto" class="oj-sm-12">
                  <oj-c-tab-bar selection={currentlySelectedTab}
                      onojSelectionAction={handleSelectionAction}
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
