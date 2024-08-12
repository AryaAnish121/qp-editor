import "../styles/App.css";
import Questions from "./Questions";

// TODO: ADD HOTKEYS
// TODO: ADD EXPORT/IMPORT QUESTION AND DATA
// TODO: MAKE MARKS AND QUESTION INLINE IF POSSIBLE

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
