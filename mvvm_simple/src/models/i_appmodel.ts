
// -------------------------------------------------------------------
// This is everything that the UI is allowed to "know" about the 
// application model.  The UI can bind to the properties to learn 
// when the underlying data has changed.   It can call the functions
// or even set properties when certain UI actions should do so.  
// -------------------------------------------------------------------
export interface IAppModel {
    someLocation: { x: number, y: number } ;
    flavors: string[];
    flavorInput: string;
    selectedFlavor: string;
    flavorTextIsValid: boolean;

    setUppercase: () => void;
    setLowercase: () => void;
    addFlavor: () => void;
    chooseStrawberry: () => void;
};