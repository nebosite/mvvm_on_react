import * as React from "react";

import { observer, inject } from "mobx-react";

import { StoresEnum } from "stores";

type Props = {
  comboboxStore?: I_ComboboxStore;
};

function About(props: Props) {
  const { comboboxStore } = props;

  if (!comboboxStore) {
    return null;
  }

  const msg = comboboxStore.selectedItem 
    ? comboboxStore.selectedItem.label
    : "You have no selected item";

  return (
    <div className="about">
      <h2 className="page-title">About</h2>
      <div className="alert alert-primary query-row">
        <span>Combobox selected Item: </span>
        <b className="attention-msg">{ msg }</b>
      </div>
    </div>
  );
}

export default inject(StoresEnum.comboboxStore)(observer(About));
