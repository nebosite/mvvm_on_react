import { observable, action, toJS } from "mobx";
import { IAppModel } from "./i_appmodel";
import { IDataModel } from "./i_dataModel";
import { mobxDidRunLazyInitializersSymbol } from "mobx/lib/internal";


export class AppModel implements IAppModel {
    @observable private _someLocation = { x: -1, y: -1 };
    get someLocation(): { x: number, y: number } { return this._someLocation; }
    set someLocation(value: { x: number, y: number } ) { this._someLocation = value; }

    public readonly flavors = observable([ "Vanilla", "Strawberry", "Chocolate" ]);

    @observable private _selectedFlavor = "";
    get selectedFlavor(): string { return this._selectedFlavor; }
    set selectedFlavor(item: string) { 
        this._selectedFlavor = item; 
        this.saveState();
    }

    @observable private _textInput = "";
    get flavorInput(): string { return this._textInput; }
    set flavorInput(value: string) { this._textInput = value; }

    get flavorTextIsValid() { return Boolean(this.flavorInput); }

    private _dataModel: IDataModel;

    constructor(dataModel: IDataModel)
    {
        this.selectedFlavor = this.flavors[0];
        const data = dataModel.load();
        if(data != null && data != "")
        {
            this.flavors.clear();
            const jsonData = JSON.parse(data);
            this.selectedFlavor = jsonData.selected;
            jsonData.flavors.forEach((f: any) => {
                this.flavors.push(f);
            });
            if(!this.selectedFlavor) {
                this.selectedFlavor = jsonData.flavors[0];
            }

        }
        this._dataModel = dataModel;
    }

    @action setUppercase = () => {
        this.flavorInput = this.flavorInput.toUpperCase();
    };
    
    @action setLowercase = () => {
        this.flavorInput = this.flavorInput.toLowerCase();
    };
    
    @action addFlavor = () => {
        this.flavors.push(this.flavorInput);
        this.selectedFlavor = this.flavorInput;
        this.flavorInput = "";
        this.saveState();
    };

    @action chooseStrawberry = () => {
        this.selectedFlavor = "Strawberry";
    }

    saveState() {
        if(!this._dataModel) return;
        const output = { 
            "flavors": toJS(this.flavors), 
            "selected": this.selectedFlavor
        };
        this._dataModel.save(JSON.stringify(output));
    }
}
