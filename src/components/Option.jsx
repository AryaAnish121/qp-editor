import { useState } from "react";

const MCQOption = ({ value, ind, handleOptionChange, handleHotKey }) => {
  const [editable, setEditable] = useState(false);

  const handleClick = () => {
    setEditable(true);
  };

  const handleBlur = () => {
    setEditable(false);
  };

  const handleChange = ({ target: { value: newValue } }) => {
    handleOptionChange(ind, newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && e.ctrlKey === true) {
      handleHotKey(ind, "ctrlSpace");
      e.preventDefault();
    } else if ((e.key === "l") & (e.ctrlKey === true)) {
      handleHotKey(ind, "ctrlL");
      e.preventDefault();
    }
  };

  return (
    <p onClick={handleClick}>
      {editable ? (
        <input
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          onKeyDown={handleKeyDown}
        />
      ) : (
        value
      )}
    </p>
  );
};

export default MCQOption;
