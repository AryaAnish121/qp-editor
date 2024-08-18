import "../styles/Question.css";
import Option from "./Option";
import Cross from "../icons/Cross";
import { useState } from "react";
import Down from "../icons/Down";
import Up from "../icons/Up";

const Question = ({
  type,
  title,
  marks,
  options,
  ind,
  handleMainChange,
  handleOptionChange,
  handleNewOption,
  handleDeleteOption,
  handleDeleteQuestion,
  handleHotKey,
  handleUp,
  handleDown,
  innerRef,
  innerRefOpt,
  handleQuestionFocus,
  handleOptionFocus,
}) => {
  const [disabled, setDisabled] = useState(true);

  const handleChange = ({ target: { value, name } }) => {
    handleMainChange(ind, { [name]: value });
  };

  const handleHoverChange = () => {
    setDisabled((prev) => !prev);
  };

  return (
    <div
      onFocus={() => {
        handleQuestionFocus(ind);
      }}
      className="question"
      onMouseEnter={handleHoverChange}
      onMouseLeave={handleHoverChange}
    >
      <div className="head">
        <input
          placeholder="Question Title"
          type="text"
          className="question-title"
          name="title"
          value={title}
          onChange={handleChange}
          ref={innerRef}
        />
        <div className="question-options">
          <button
            disabled={disabled}
            className="delete-button question-option re-arrange-options"
            onClick={() => handleUp(ind)}
            tabIndex={-1}
          >
            <Up />
          </button>
          <button
            disabled={disabled}
            className="delete-button question-option re-arrange-options"
            onClick={() => handleDown(ind)}
            tabIndex={-1}
          >
            <Down />
          </button>
          <button
            className="delete-button question-option"
            onClick={() => handleDeleteQuestion(ind)}
            tabIndex={-1}
          >
            <Cross />
          </button>
          <select
            tabIndex={-1}
            name="type"
            className="question-option"
            value={type}
            onChange={handleChange}
          >
            <option value="ans">Long/Short Answer</option>
            <option value="adash">Long/Short Answer Dashed</option>
            <option value="mcq/fitb/mqna/mtf">
              MCQ/Fill in the blanks/Multiple QNA/Match the following
            </option>
          </select>
          <input
            type="number"
            name="marks"
            onChange={handleChange}
            value={marks}
            className="question-option"
            placeholder="Marks"
          />
        </div>
      </div>
      {type === "mcq/fitb/mqna/mtf" && (
        <ul className="mcq-questions">
          {options.map((option, index) => (
            <li key={index} className="mcq-choice">
              <Option
                value={option}
                ind={index}
                handleOptionChange={(oid, newValue) => {
                  handleOptionChange(ind, oid, newValue);
                }}
                handleOptionFocus={(oid) => {
                  handleOptionFocus(ind, oid);
                }}
                handleHotKey={(oid, hotKey) => {
                  handleHotKey(ind, oid, hotKey);
                }}
                optRef={(el) => {
                  innerRefOpt(el, index);
                }}
              />
              <button
                className="delete-button"
                onClick={() => handleDeleteOption(ind, index)}
                tabIndex={-1}
              >
                <Cross />
              </button>
            </li>
          ))}
          <li>
            <button
              tabIndex={-1}
              onClick={() => {
                handleNewOption(ind);
              }}
              className="question-option"
            >
              Add option
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Question;
