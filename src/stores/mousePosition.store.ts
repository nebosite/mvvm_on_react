import { observable, action } from "mobx";

class MousePositionStore implements I_MousePositionStore {
  @observable
  position = { x: 0, y: 0 };

  @action
  setPosition = (val: MousePosition) => {
    this.position = val;
  };
}

export default new MousePositionStore();
