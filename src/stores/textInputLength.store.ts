import { observable, action } from "mobx";

class TextInputLengthStore implements I_TextInputLengthStore {
  @observable
  value = "";

  get length() {
    return this.value.length;
  }

  @action
  setValue = (val: string) => {
    this.value = val;
  };
}

export default new TextInputLengthStore();
