import { observable, action } from "mobx";
import { IAppModel } from "./i_appmodel";

export class AppModel implements IAppModel {
    @observable private _someLocation = { x: -1, y: -1 };
    get someLocation(): { x: number, y: number } { return this._someLocation; }
    set someLocation(value: { x: number, y: number } ) { this._someLocation = value; }

    public readonly flavors = observable(["Vanilla", "Strawberry", "Chocolate"]);

    @observable private _selectedItem = "";
    get selectedItem(): string { return this._selectedItem; }
    set selectedItem(item: string) { this._selectedItem = item; }

    @observable private _textInput = "";
    get flavorInput(): string { return this._textInput; }
    set flavorInput(value: string) { this._textInput = value; }

    @action setUppercase = () => {
        this.flavorInput = this.flavorInput.toUpperCase();
    };
    
    @action setLowercase = () => {
        this.flavorInput = this.flavorInput.toLowerCase();
    };
    
    @action addFlavor = () => {
        this.flavors.push(this.flavorInput);
        this.flavorInput = "";
    };
}
