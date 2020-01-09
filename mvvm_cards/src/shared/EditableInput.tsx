import * as React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onWrapperDoubleClick: (e: React.SyntheticEvent) => void;
}

export default function EditableInput(props: Props) {
  
  const { 
    value,
    onChange,
    disabled,
    onWrapperDoubleClick,
    onKeyPress,
    ...otherProps
  } = props;

  return (
    <div onDoubleClick={onWrapperDoubleClick}>
      <input 
        className="editable-input" 
        type="text" 
        value={value}
        onKeyPress={e => onKeyPress(e)}
        onClick={e => e.stopPropagation()}
        onChange={e =>  onChange(e.target.value) }
        disabled={disabled}
        { ...otherProps }
      />
    </div>
  )
}