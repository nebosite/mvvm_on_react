
// -------------------------------------------------------------------
// The data model should be very simple - just enough to load and
// store data.  
// -------------------------------------------------------------------
export interface IDataModel {
    save: (jsonData: string) => void;
    load: () => string;
};