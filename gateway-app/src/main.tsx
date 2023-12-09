
import ReactDOM from 'react-dom';
import App from './App.tsx'
import './styles/home.css'
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);



