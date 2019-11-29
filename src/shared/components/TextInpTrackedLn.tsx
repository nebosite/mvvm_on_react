import * as React from "react";
import { observer, inject } from "mobx-react";

import { StoresEnum } from "stores";

type Props = {
  textInputLengthStore?: I_TextInputLengthStore;
};

function TextInpTrackedLn(props: Props) {
  const { value, setValue, length } = props.textInputLengthStore;

  return (
    <div className="text-input-tracked">
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
      />
      <br />
      <br />
      The text length is: <b className="attention-msg">{length}</b>
    </div>
  );
}

export default inject(StoresEnum.textInputLengthStore)(
  observer(TextInpTrackedLn)
);
