import "../styles/App.css";
import Questions from "./Questions";

// TODO: ADD AUTOSAVE
// TODO: ADD ICON META TAGS
// TODO: ADD HOTKEYS
// TODO: ADD EXPORT/IMPORT QUESTION AND DATA

function App() {
  return (
    <div className="App">
      <div className="heading">
        <h1>Question Paper Editor</h1>
      </div>
      <Questions />
    </div>
  );
}

export default App;
