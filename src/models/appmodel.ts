import { observable, action } from "mobx";
import { IAppModel } from "./i_appmodel";

export class AppModel implements IAppModel {
    @observable private _someLocation = { x: -1, y: -1 };
    get someLocation(): { x: number, y: number } { return this._someLocation; }
    set someLocation(value: { x: number, y: number } ) { this._someLocation = value; }

    public readonly flavors = observable(["Vanilla", "Strawberry", "Chocolate"]);

    @observable private _selectedFlavor = "";
    get selectedFlavor(): string { return this._selectedFlavor; }
    set selectedFlavor(item: string) { this._selectedFlavor = item; }

    @observable private _textInput = "";
    get flavorInput(): string { return this._textInput; }
    set flavorInput(value: string) { this._textInput = value; }

    get flavorTextIsValid() { return Boolean(this.flavorInput); }

    constructor()
    {
        this.selectedFlavor = this.flavors[0];
    }

    @action setUppercase = () => {
        this.flavorInput = this.flavorInput.toUpperCase();
    };
    
    @action setLowercase = () => {
        this.flavorInput = this.flavorInput.toLowerCase();
    };
    
    @action addFlavor = () => {
        // PROBLEM: These actions should cause the combobox to rerender
        // automatically, but that does not happen
        this.flavors.push(this.flavorInput);
        this.selectedFlavor = this.flavorInput;
        this.flavorInput = "";
    };
}
