import { useEffect, useState } from "react";
import Question from "./Question";
import "../styles/Questions.css";
import createDocx from "./generator/createDocx";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import Alert from "@mui/material/Alert";
import { Grow, Box, Modal } from "@mui/material";
import { Textarea, IconButton } from "@mui/joy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/joy";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
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

  const showAlert = (message, type, time) => {
    setAlert({ message, type, show: true });

    setTimeout(() => {
      setAlert({
        message: "",
        type: "",
        show: false,
      });
    }, time);
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
    setQuestions((prev) => {
      let max = -1;

      prev.forEach((question) => {
        if (question.pos > max) max = question.pos;
      });

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

  const handleNewOption = (id) => {
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

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const handleExamDetailsChange = ({ target: { value, name } }) => {
    setExamDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const generateDocs = async () => {
    try {
      showAlert("Generating Document", "info", 2000);
      const doc = createDocx(questions, examDetails);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${examDetails.studyingClass}-${examDetails.subject}.docx`);
    } catch (error) {
      showAlert(error.message, "error", 2000);
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
    showAlert("Cleared", "info", 2000);
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
    showAlert("Copied", "info", 2000);
  };

  const handleUpdate = () => {
    const { questions, examDetails } = JSON.parse(exportJSON);
    setQuestions(questions);
    setExamDetails(examDetails);
    handleModalClose();
    showAlert("Updated", "info", 2000);
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
                handleMainChange={handleMainChange}
                handleOptionChange={handleOptionChange}
                handleNewOption={handleNewOption}
                handleDeleteOption={handleDeleteOption}
                handleDeleteQuestion={handleDeleteQuestion}
                handleHotKey={handleHotKey}
                handleDown={handleDown}
                handleUp={handleUp}
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
      <div className="alert">
        <Box sx={{ display: alert.show ? "flex" : "none" }}>
          <Grow in={alert.show}>
            <Alert severity={alert.type}>{alert.message}</Alert>
          </Grow>
        </Box>
      </div>
    </div>
  );
};

export default Questions;
