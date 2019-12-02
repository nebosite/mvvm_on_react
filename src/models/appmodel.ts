import { observable, action } from "mobx";
import { IAppModel } from "./i_appmodel";

export class AppModel implements IAppModel {
    @observable private _mousePosition = { x: -1, y: -1 };
    get mousePosition(): { x: number, y: number } { return this._mousePosition; }
    set mousePosition(value: { x: number, y: number } ) { this._mousePosition = value; }

    public readonly flavors = observable(["Vanilla", "Strawberry", "Chocolate"]);

    @observable private _selectedFlavorIndex = 0;
    get selectedFlavorIndex(): number { return this._selectedFlavorIndex; }
    set selectedFlavorIndex(value: number) { this._selectedFlavorIndex = value; }

    // we can create a dedicated Class for SelectedItem like: class SelectedItem etc. but it will be too complicated
    @observable private _selectedItem = "";
    get selectedItem(): string { return this._selectedItem; }
    set selectedItem(item: string) { this._selectedItem = item; }

    @observable private _textInput = "";
    get textInput(): string { return this._textInput; }
    set textInput(value: string) { this._textInput = value; }
    get textInputLength(): number { return this._textInput.length; }

    @action setUppercase = () => {
        this.textInput = this.textInput.toUpperCase();
    };
    @action setLowercase = () => {
        this.textInput = this.textInput.toLowerCase();
    };
}
