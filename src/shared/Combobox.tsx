import * as React from "react";
import { ActionMeta, ValueType } from "react-select";
import CreatableSelect from "react-select/creatable";

export type ComboboxItem = {
	value: any;
	label: string;
};

enum OnChangeEnum {
  selectOption = "select-option",
  deselectOption = "deselect-option",
  removeValue = "remove-value",
  popValue = "pop-value",
  setValue = "set-value",
  clear = "clear",
  createOption = "create-option"
}

type ComboboxProps = {
  itemsSource: any[]; 
  selectedItem: any;
  onSelectValue: (selectedItem: any) => void;
};

const itemMapper = {
  mapSourceItemToComboboxItem(sourceItem: string): ComboboxItem { 
    return { value: sourceItem, label: sourceItem.toString() } 
  },
  mapComboboxItemToSourceItem(comboboxItem: ComboboxItem): any { 
    return comboboxItem.value; 
  }
}

export default function Combobox(props: ComboboxProps) {
  const {
    itemsSource,
    selectedItem,
    onSelectValue,
  } = props;

  const [open, setOpen] = React.useState(false);

  const show = () => { setOpen(true); };
  const hide = () => { setOpen(false); };

  const options = itemsSource.map(itemMapper.mapSourceItemToComboboxItem);

  const handleChange = (
    newValue: ValueType<ComboboxItem>,
    actionMeta: ActionMeta
  ) => {
    switch (actionMeta.action) {
      case OnChangeEnum.selectOption:
        onSelectValue(itemMapper.mapComboboxItemToSourceItem(newValue as ComboboxItem));
        hide(); // manually hiding the combobox as we control it by ourself
        break;
      case OnChangeEnum.clear:
        onSelectValue(null);
        break;
    }
  };

  return (
    <CreatableSelect
      menuIsOpen={open}
      onMenuOpen={show}
      defaultValue={itemMapper.mapSourceItemToComboboxItem(selectedItem)}
      onBlur={hide}
      options={options}
      onChange={handleChange}
    />
  );
}
