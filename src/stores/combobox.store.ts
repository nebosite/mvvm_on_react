import { observable, action } from "mobx";

// mocked response
export const responseOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

class ComboboxStore implements I_ComboboxStore {
  @observable
  items = [...responseOptions];

  @observable
  query = "";

  @observable
  selectedItem: ComboboxItem | null = null;

  @action
  addNewItem(val: string) {
    const lowerCasedVal = val.toLowerCase();

    // don't want to add already existed item
    if (this.isItemExisting(lowerCasedVal)) {
      return;
    }

    const newItem = {
      value: lowerCasedVal,
      label: val
    };
    this.items = [...this.items, newItem];
  }

  @action
  setQuery(query: string) {
    this.query = query;
  }

  @action
  resetQuery = () => {
    this.query = "";
  }

  @action
  setSelectedItem(item: ComboboxItem | null) {
    this.selectedItem = item;
  }

  isItemExisting(value: string) {
    return this.items.some((item: ComboboxItem) => item.value === value);
  }
}

export default new ComboboxStore();
