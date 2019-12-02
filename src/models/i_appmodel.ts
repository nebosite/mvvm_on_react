/* TODO: remove it after reading.
 You can write this interface in the src/typings folder and all types will be dynamically fetched from there.
 You won't need anymore to directly import this time into files that uses it.

 The direct import could be useful if you want to quick jump to the source file via ctrl+click on the type
*/
export interface IAppModel {
    mousePosition: { x: number, y: number } ;
    flavors: string[];
    textInput: string;
    textInputLength: number;
    selectedFlavorIndex: number;
     // we could set here a flawors enum or string union type eg. Vanilla | Strawberry 
    selectedItem: string;

    setUppercase: () => void;
    setLowercase: () => void;
};