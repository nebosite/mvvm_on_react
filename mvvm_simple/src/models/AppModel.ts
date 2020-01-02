import { observable, action, toJS } from "mobx";
import { IAppModel } from "./i_appmodel";
import { IDataModel } from "./i_dataModel";

// -------------------------------------------------------------------
// This is the implementation of IAppModel.  All of the business logic
// should go here, or be reachable from here in containers or children.
// The app model should never "know" about the UI.  It's job is to think
// abstractly about the business part of the application.
//
// MOBX - this is how we modify the class to generate events when the 
// data changes.  
//
//      @observable - add to fields that we want to observe.  
//      @action     - add to functions that change observable values
//      
//                  Note: The getters and setters that reference 
//                        observable fields are automatically marked 
//                        as @observable or @action
// -------------------------------------------------------------------
export class AppModel implements IAppModel {
    // someLocation - an exnample of a bindable custom object
    @observable private _someLocation = { x: -1, y: -1 };
    get someLocation(): { x: number, y: number } { return this._someLocation; }
    set someLocation(value: { x: number, y: number } ) { this._someLocation = value; }

    // flavors - Since we want lists and dropdowns that depend on this to 
    //      auto-update, it the array must be converted to an observable version
    //      any change to the array will update the UI
    public readonly flavors = observable([ "Vanilla", "Strawberry", "Chocolate" ]);

    // selectedFlavor - note the logic in the setting to update the saved state.
    @observable private _selectedFlavor = "";
    get selectedFlavor(): string { return this._selectedFlavor; }
    set selectedFlavor(item: string) { 
        this._selectedFlavor = item; 
        this.saveState();
    }

    // flavorInput - an example of a bindable text field
    @observable private _flavorInput = "";
    get flavorInput(): string { return this._flavorInput; }
    set flavorInput(value: string) { this._flavorInput = value; }

    // flavorTextIsValid - example of a derived property that will
    //     automatically trigger an update when the dependent
    //     property changes
    get flavorTextIsValid() { return Boolean(this.flavorInput); }

    // Our handle to the data model.  This can be replaced easily with 
    // a mock version
    private _dataModel: IDataModel;

    // -------------------------------------------------------------------
    // ctor - initialize from the data model here.  In a production app,
    //      this kind of work would happen asynchronously, but I wanted
    //      to keep the code simple for this example.
    // -------------------------------------------------------------------
    constructor(dataModel: IDataModel)
    {
        this.selectedFlavor = this.flavors[0];
        const data = dataModel.load();
        if(data !== null && data !== "")
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

    // -------------------------------------------------------------------
    // setUppercase - convert flavorInput to uppercase
    // -------------------------------------------------------------------
    @action setUppercase = () => {
        this.flavorInput = this.flavorInput.toUpperCase();
    };
    
    // -------------------------------------------------------------------
    // setLowercase - convert flavorInput to lowercase
    // -------------------------------------------------------------------
    @action setLowercase = () => {
        this.flavorInput = this.flavorInput.toLowerCase();
    };
    
    // -------------------------------------------------------------------
    // addFlavor - add a new flavor and select it.  Note that the ui
    //     will respond automatically to the change in selection because
    //     mobx will trigger an event
    // -------------------------------------------------------------------
    @action addFlavor = () => {
        this.flavors.push(this.flavorInput);
        this.selectedFlavor = this.flavorInput;
        this.flavorInput = "";
        this.saveState();
    };

    // -------------------------------------------------------------------
    // chooseStrawberry - force selected flavor to be strawberry
    // -------------------------------------------------------------------
    @action chooseStrawberry = () => {
        this.selectedFlavor = "Strawberry";
    }

    // -------------------------------------------------------------------
    // saveSate - store the current state to our back end
    // -------------------------------------------------------------------
    saveState() {
        if(!this._dataModel) return;
        const output = { 
            "flavors": toJS(this.flavors), 
            "selected": this.selectedFlavor
        };
        this._dataModel.save(JSON.stringify(output));
    }
}
