import "./App.css";
import CustomTimeline from "./Timeline";

function App() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "#f5f0f0", borderBottom: "1px solid #ccc" }}>
        <h1>5 Bags, 2 Sodas</h1>
      </div>
      <CustomTimeline />
    </>
  );
}

export default App;
