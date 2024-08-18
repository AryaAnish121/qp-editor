import { useEffect, useRef, useState } from "react";
import Question from "./Question";
import "../styles/Questions.css";
import createDocx from "./generator/createDocx";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import Alert from "@mui/material/Alert";
import { Box, Modal } from "@mui/material";
import { Textarea, IconButton } from "@mui/joy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/joy";
import Snackbar from "@mui/material/Snackbar";
import { useHotkeys } from "react-hotkeys-hook";
import shortcuts from "./shortcuts";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const qref = useRef([]);
  const oref = useRef([]);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [examDetails, setExamDetails] = useState({
    term: "",
    studyingClass: "",
    subject: "",
  });
  const [exportJSON, setExportJSON] = useState("");
  const [focusedQuestion, setFocusedQuestion] = useState(null);
  const [focusedOption, setFocusedOption] = useState(null);

  const load = () => {
    const qstorage = localStorage.getItem("questions");
    const esstorage = localStorage.getItem("examDetails");

    if (qstorage) setQuestions(JSON.parse(qstorage));
    if (esstorage) setExamDetails(JSON.parse(esstorage));
  };

  useEffect(load, []);

  useEffect(() => {
    let rotationInterval = setInterval(() => {
      localStorage.setItem("questions", JSON.stringify(questions));
      localStorage.setItem("examDetails", JSON.stringify(examDetails));
    }, 1000);

    return () => {
      clearInterval(rotationInterval);
    };
  }, [questions, examDetails]);

  const handleMainChange = (ind, newValue) => {
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === ind) {
          return { ...question, ...newValue };
        }
        return question;
      });
    });
  };

  const addQuestion = () => {
    let max = -1;
    questions.forEach((question) => {
      if (question.pos > max) max = question.pos;
    });
    setQuestions((prev) => {
      return [
        ...prev,
        {
          type: "ans",
          title: "",
          marks: "",
          options: [],
          pos: max + 1,
        },
      ];
    });
    setTimeout(() => {
      qref.current.forEach(({ el, pos }) => {
        if (pos === max + 1) {
          if (el) el.focus();
        }
      });
    }, 1);
  };

  const handleNewOption = (id) => {
    const newInd = questions[id].options.length;
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === id) {
          return {
            ...question,
            options: [...question.options, "new option"],
          };
        }
        return question;
      });
    });
    if (newInd != null) {
      setTimeout(() => {
        oref.current[id][newInd].focus();
        oref.current[id][newInd].select();
      }, 1);
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const handleDeleteOption = (qid, oid) => {
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === qid) {
          return {
            ...question,
            options: question.options.filter((option, index) => index !== oid),
          };
        }
        return question;
      });
    });
  };

  useHotkeys(
    shortcuts.newQuestion,
    () => {
      addQuestion();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    shortcuts.deleteQuestion,
    (e) => {
      if (focusedQuestion !== null || focusedQuestion !== undefined)
        handleDeleteQuestion(focusedQuestion);
      e.preventDefault();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    shortcuts.newOption,
    () => {
      if (focusedQuestion !== null || focusedQuestion !== undefined) {
        if (questions[focusedQuestion]) {
          handleNewOption(focusedQuestion);
          handleMainChange(focusedQuestion, { type: "mcq/fitb/mqna/mtf" });
        }
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    shortcuts.deleteOption,
    (e) => {
      if (focusedOption !== null || focusedOption !== undefined)
        handleDeleteOption(focusedOption[0], focusedOption[1]);
      e.preventDefault();
    },
    { enableOnFormTags: true }
  );

  const handleQuestionFocus = (ind) => {
    setFocusedQuestion(ind);
  };

  const showSnackbar = (message, type, time) => {
    setAlert({ message, type, show: true });
  };

  const closeSnackbar = () => {
    setAlert({
      show: false,
      message: "",
      type: "",
    });
  };

  const handleUp = (qid) => {
    if (questions[qid].pos === 0) return;
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === qid) {
          return {
            ...question,
            pos: question.pos - 1,
          };
        } else if (question.pos === prev[qid].pos - 1) {
          return {
            ...question,
            pos: question.pos + 1,
          };
        }
        return question;
      });
    });
  };

  const handleDown = (qid) => {
    if (questions[qid].pos === questions.length - 1) return;
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === qid) {
          return {
            ...question,
            pos: question.pos + 1,
          };
        } else if (question.pos === prev[qid].pos + 1) {
          return {
            ...question,
            pos: question.pos - 1,
          };
        }
        return question;
      });
    });
  };

  const handleOptionChange = (qid, oid, newValue) => {
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === qid) {
          return {
            ...question,
            options: question.options.map((option, index) => {
              if (index === oid) {
                return newValue;
              }
              return option;
            }),
          };
        }
        return question;
      });
    });
  };

  const handleHotKey = (qid, oid, hotKey) => {
    setQuestions((prev) => {
      return prev.map((question, index) => {
        if (index === qid) {
          return {
            ...question,
            options: question.options.map((option, index) => {
              if (index === oid) {
                if (hotKey === "ctrlSpace") return `${option}_______`;
                else if (hotKey === "ctrlL") return `${option}<MTFSpace>`;
              }
              return option;
            }),
          };
        }
        return question;
      });
    });
  };

  const handleExamDetailsChange = ({ target: { value, name } }) => {
    setExamDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const generateDocs = async () => {
    try {
      showSnackbar("Generating Document", "info", 2000);
      const doc = createDocx(questions, examDetails);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${examDetails.studyingClass}-${examDetails.subject}.docx`);
    } catch (error) {
      showSnackbar(error.message, "error", 2000);
    }
  };

  const clear = () => {
    if (window.confirm("Are you sure?") === false) return;
    localStorage.clear();
    setQuestions([]);
    setExamDetails({
      term: "",
      studyingClass: "",
      subject: "",
    });
    showSnackbar("Cleared", "info", 2000);
  };

  const handleModalOpen = () => {
    setExportJSON(JSON.stringify({ questions, examDetails }, null, 4));
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setExportJSON("");
    setOpenModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJSON);
    showSnackbar("Copied", "info", 2000);
  };

  const handleUpdate = () => {
    const { questions, examDetails } = JSON.parse(exportJSON);
    setQuestions(questions);
    setExamDetails(examDetails);
    handleModalClose();
    showSnackbar("Updated", "info", 2000);
  };

  const handleOptionFocus = (qid, oid) => {
    setFocusedOption([qid, oid]);
  };

  return (
    <div className="outer">
      <div className="main">
        <div className="question-details">
          <input
            type="text"
            placeholder="Term"
            className="question-option"
            onChange={handleExamDetailsChange}
            value={examDetails.term}
            name="term"
          />
          <input
            type="text"
            placeholder="Class"
            className="question-option"
            onChange={handleExamDetailsChange}
            value={examDetails.studyingClass}
            name="studyingClass"
          />
          <input
            type="text"
            placeholder="Subject"
            className="question-option"
            onChange={handleExamDetailsChange}
            value={examDetails.subject}
            name="subject"
          />
        </div>
        <div className="questions">
          {questions
            .sort((a, b) => (a.pos > b.pos ? 1 : -1))
            .map((question, index) => (
              <Question
                {...question}
                key={index}
                ind={index}
                innerRef={(el) => {
                  qref.current[index] = { el, pos: question.pos };
                }}
                innerRefOpt={(el, oid) => {
                  if (oref.current[index]) oref.current[index][oid] = el;
                  else oref.current[index] = [el];
                }}
                handleMainChange={handleMainChange}
                handleOptionChange={handleOptionChange}
                handleNewOption={handleNewOption}
                handleDeleteOption={handleDeleteOption}
                handleDeleteQuestion={handleDeleteQuestion}
                handleHotKey={handleHotKey}
                handleDown={handleDown}
                handleUp={handleUp}
                handleQuestionFocus={handleQuestionFocus}
                handleOptionFocus={handleOptionFocus}
              />
            ))}
        </div>
        <div className="add-question">
          <button className="question-option" onClick={handleModalOpen}>
            Import/Export Data
          </button>
          <button className="question-option" onClick={clear}>
            Clear
          </button>
          <button className="question-option" onClick={addQuestion}>
            Add Question
          </button>
          <button className="question-option" onClick={generateDocs}>
            Generate Docs
          </button>
        </div>
        <Modal
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal-outer"
        >
          <Box className="box-modal">
            <Textarea
              name="Plain"
              value={exportJSON}
              onChange={(e) => setExportJSON(e.target.value)}
              variant="plain"
              minRows={5}
              maxRows={20}
              startDecorator={
                <Box
                  sx={{
                    position: "absolute",
                    right: "35px",
                    top: "35px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <IconButton
                    variant="outlined"
                    color="neutral"
                    onClick={handleCopy}
                  >
                    <ContentCopyIcon sx={{ fontSize: "15px" }} />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Box>
              }
            />
          </Box>
        </Modal>
      </div>
      <Snackbar
        open={alert.show}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={alert.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Questions;
