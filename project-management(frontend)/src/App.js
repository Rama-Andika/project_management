import { Toaster } from "react-hot-toast";
import Router from "./routes/routes";
import "./assets/css/styles.css";


function App() {
  return (
    <div className="App">
      <Toaster />
      <Router />
    </div>
  );
}

export default App;
