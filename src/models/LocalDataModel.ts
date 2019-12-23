import { IDataModel } from "./i_dataModel";

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
