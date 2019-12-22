import { IDataModel } from "./i_dataModel";

export class LocalDataModel implements IDataModel {
    save(jsonData: string) {
        localStorage.setItem("AppData", jsonData);
    }    

    load() {
        return localStorage.getItem("AppData");
    };
}
