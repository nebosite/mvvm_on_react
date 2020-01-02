import { IDataModel } from "./i_dataModel";

// -------------------------------------------------------------------
// Implementation of the data model - notice that the logic is 
// essentially passthrough calls, very simple
// -------------------------------------------------------------------
export class LocalDataModel implements IDataModel {
    private _storageKey: string;
    
    constructor(storageKey: string) {
        this._storageKey = storageKey;
    }

    save(jsonData: string) {
        localStorage.setItem(this._storageKey, jsonData);
    }    

    load() {
        return localStorage.getItem(this._storageKey);
    };
}
