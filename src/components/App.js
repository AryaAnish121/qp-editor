import "../styles/App.css";
import Questions from "./Questions";

function App() {
  return (
    <div className="App">
      <div className="heading">
        <h1>Question Paper Editor 🪶</h1>
      </div>
      <Questions />
      <div className="footer">
        <p>
          Made with ❤️ by{" "}
          <a href="https://github.com/AryaAnish121">Arya Anish</a>. Code is
          available{" "}
          <a href="https://github.com/AryaAnish121/qp-editor">here.</a>
        </p>
      </div>
    </div>
  );
}

export default App;
