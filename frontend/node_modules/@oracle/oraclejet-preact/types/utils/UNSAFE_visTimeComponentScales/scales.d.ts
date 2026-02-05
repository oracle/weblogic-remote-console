type ScaleOptions = {
    target?: 'majorAxis' | 'minorAxis';
    formatter?: (date: string) => string;
    labelPosition?: 'start' | 'center';
};
type TimeComponentScale = {
    labelPosition?: 'start' | 'center';
    formatter: (date: string) => string;
    getNextDate: (date: string) => string;
    getPreviousDate: (date: string) => string;
};
declare const getSecondsScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getMinutesScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getHoursScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getDaysScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getWeeksScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getMonthsScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getQuartersScale: (options?: ScaleOptions) => TimeComponentScale;
declare const getYearsScale: (options?: ScaleOptions) => TimeComponentScale;
export { getSecondsScale, getMinutesScale, getHoursScale, getDaysScale, getWeeksScale, getMonthsScale, getQuartersScale, getYearsScale };
