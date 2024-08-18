const MCQOption = ({
  value,
  ind,
  handleOptionChange,
  handleHotKey,
  handleOptionFocus,
  optRef,
}) => {
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
    <input
      onChange={handleChange}
      value={value}
      onKeyDown={handleKeyDown}
      ref={optRef}
      onFocus={() => {
        handleOptionFocus(ind);
      }}
    />
  );
};

export default MCQOption;
