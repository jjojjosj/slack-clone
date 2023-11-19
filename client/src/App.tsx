import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexContainer from "./containers/indexContainer/IndexContainer";
import MainContainer from "./containers/mainContainer/MainContainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexContainer />} />
        <Route path="/main" element={<MainContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
