import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import CardList from "./components/custom/CardList";
import "./App.css";
import CardForm from "./components/custom/CardForm";

function App() {
  return (
    <div className="flex gap-4 ">
      <CardList />
      <CardForm />
    </div>
  );
}

export default App;
