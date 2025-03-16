import "./App.css";
import CustomTimeline from "./Timeline";

function App() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white", borderBottom: "1px solid #ccc" }}>
        <h1>HEI Network Archives</h1>
      </div>
      <CustomTimeline />
    </>
  );
}

export default App;
