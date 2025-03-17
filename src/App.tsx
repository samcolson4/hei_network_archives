import "./App.css";
import CustomTimeline from "./Timeline";

function App() {
  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ccc",
          padding: "1rem",
          textAlign: "left",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "clamp(1.5rem, 6vw, 3rem)",
          }}
        >
          FiveBagsAndTwoSodas
        </h1>
        <h5
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "clamp(1rem, 4vw, 1.5rem)",
          }}
        >
          An On Cinema Timeline
        </h5>
      </div>
      <CustomTimeline />
    </div>
  );
}

export default App;
