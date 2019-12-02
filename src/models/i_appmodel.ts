
export interface IAppModel {
    mousePosition: { x: number, y: number } ;
    flavors: string[];
    textInput: string;
    selectedItem: string;

    setUppercase: () => void;
    setLowercase: () => void;
};