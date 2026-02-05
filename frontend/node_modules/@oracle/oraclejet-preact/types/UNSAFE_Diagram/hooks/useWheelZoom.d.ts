type UseWheelZoomOptions = {
    zooming: 'on' | 'off';
    minZoom: number;
    maxZoom: number;
    zoomValue: number;
    onZoom?: (detail: {
        zoomValue: number;
    }) => void;
};
declare const useWheelZoom: ({ zooming, minZoom, maxZoom, zoomValue, onZoom }: UseWheelZoomOptions) => {
    onWheel?: undefined;
} | {
    onWheel: (e: WheelEvent) => void;
};
export { useWheelZoom };
