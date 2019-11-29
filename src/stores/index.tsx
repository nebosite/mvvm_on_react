import comboboxStore from "./combobox.store";
import mousePositionStore from "./mousePosition.store";
import textInputLengthStore from "./textInputLength.store";

import { RootStore } from "./types";

export * from "./types";

const rootStore: RootStore = {
  comboboxStore,
  mousePositionStore,
  textInputLengthStore
};

export default rootStore;