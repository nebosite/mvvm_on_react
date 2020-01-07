import * as React from "react";
import { ActionMeta, ValueType } from "react-select";
import CreatableSelect from "react-select/creatable";

// -------------------------------------------------------------------
// Combobox- An example of a custom bindable MVVM component
//
// Notice that this control never needs to know any of the particulars
// of the items it is selecting, so long as the items provide a useful
// label via .toString()
// -------------------------------------------------------------------

// internal type for thinking about items in the combox
export type ComboboxItem = {
  // The actual item
  value: any;
  
  // a label to identify the item
	label: string;
};

// values for working with the Creatable Select control
enum OnChangeEnum {
  selectOption = "select-option",
  deselectOption = "deselect-option",
  removeValue = "remove-value",
  popValue = "pop-value",
  setValue = "set-value",
  clear = "clear",
  createOption = "create-option"
}

// Input bindings for the combobox
type ComboboxProps = {
  // The input items can be of any type.  In this case, the items
  // need to implement toString() in order to allow discover
  // of the lables.
  itemsSource: any[];
  selectedItem: any;

  // This is how we communicate back selection changes
  onSelectValue: (selectedItem: any) => void;
};

// Provide conversion from an array of input items and
// the array of comboboxItems used internally
const itemMapper = {
  mapSourceItemToComboboxItem(sourceItem: string): ComboboxItem { 
    return { value: sourceItem, label: sourceItem.toString() } 
  },
  mapComboboxItemToSourceItem(comboboxItem: ComboboxItem): any { 
    return comboboxItem.value; 
  }
}

// -------------------------------------------------------------------
//  Here is the actual combobox component
// -------------------------------------------------------------------
export default function Combobox(props: ComboboxProps) {
  const {
    itemsSource,
    selectedItem,
    onSelectValue,
  } = props;

  // Setting up automatic state for items we don't expect to bind
  // to external data.
  const [open, setOpen] = React.useState(false);

  const show = () => { setOpen(true); };
  const hide = () => { setOpen(false); };

  const options = itemsSource.map(itemMapper.mapSourceItemToComboboxItem);

  // -------------------------------------------------------------------
  // Process changes to the CreatableSelect control and communicate
  // those out as necessary.  
  // -------------------------------------------------------------------
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

  // -------------------------------------------------------------------
  // Visuals and bindings for the combobox control
  // -------------------------------------------------------------------
  return (
    <CreatableSelect
      menuIsOpen={open}
      onMenuOpen={show}
      value={itemMapper.mapSourceItemToComboboxItem(selectedItem)}
      onBlur={hide}
      options={options}
      onChange={handleChange}
    />
  );
}
