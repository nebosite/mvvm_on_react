
export interface IAppModel {
    mousePosition: { x: number, y: number } ;
    flavors: string[];
    flavorInput: string;
    selectedItem: string;

    setUppercase: () => void;
    setLowercase: () => void;
    addFlavor: () => void;
};