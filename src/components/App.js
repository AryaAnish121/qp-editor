import "../styles/App.css";
import Questions from "./Questions";

// TODO: ADD HOTKEYS
// TODO: MAKE MARKS AND QUESTION INLINE IF POSSIBLE
// TODO: REPLACE ALERT WITH SNACKBAR
// TODO: MAKE APP RESPONSIVE

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
