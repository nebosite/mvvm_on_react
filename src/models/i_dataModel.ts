
export interface IDataModel {
    save: (jsonData: string) => void;
    load: () => string;
};