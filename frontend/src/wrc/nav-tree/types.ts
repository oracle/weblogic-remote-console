export interface Navtree {
    name:         string;
    label:        string;
    expanded:     boolean;
    selectable:   boolean;
    resourceData: ResourceData;
    contents:     NavtreeContent[];
}

export interface NavtreeContent {
    resourceData?: ResourceData;
    name?:         string;
    label?:        string;
    expanded?:     boolean;
    expandable?:   boolean;
    selectable?:   boolean;
    type?:         string;
    contents?:     NavtreeContent[];
}

export interface ResourceData {
    label:        string;
    resourceData: string;
}
