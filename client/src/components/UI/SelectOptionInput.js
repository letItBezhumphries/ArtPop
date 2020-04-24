import React from "react";

const SelectOptionInput = ({
  options,
  selectClass,
  label,
  onSelectChange,
  optionClass,
}) => {
  const selectOptions = options.map((state, i) => (
    <option key={i} value={state.value}>
      {state.label}
    </option>
  ));

  return (
    <div>
      <select
        className={selectClass}
        onChange={(e) => {
          onSelectChange(e.target.value);
        }}
      >
        <option className={optionClass}>
          {label ? "Select Collection" : "Select State"}
        </option>
        {selectOptions}
      </select>
    </div>
  );
};

export default SelectOptionInput;
