export enum StoresEnum {
  comboboxStore = "comboboxStore",
  mousePositionStore = "mousePositionStore",
  textInputLengthStore = "textInputLengthStore"
}

export type RootStore = {
  [StoresEnum.comboboxStore]: I_ComboboxStore;
  [StoresEnum.mousePositionStore]: I_MousePositionStore;
  [StoresEnum.textInputLengthStore]: I_TextInputLengthStore;
};
