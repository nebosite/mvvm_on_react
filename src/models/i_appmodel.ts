
export interface IAppModel {
    someLocation: { x: number, y: number } ;
    flavors: string[];
    flavorInput: string;
    selectedFlavor: string;

    setUppercase: () => void;
    setLowercase: () => void;
    addFlavor: () => void;
};