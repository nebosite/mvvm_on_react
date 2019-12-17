
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