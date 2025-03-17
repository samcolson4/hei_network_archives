import "./App.css";
import CustomTimeline from "./Timeline";

function App() {
  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          // backgroundColor: "#f5f0f0", // Left out until we re-introduce dark mode
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ccc",
          padding: "1rem",
          textAlign: "left",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: "0.5rem" }}>FiveBagsAndTwoSodas</h1>
        <h5 style={{ margin: 0, marginBottom: "0.5rem" }}>An On Cinema Timeline</h5>
        <div>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <img
                key={`popcorn-${i}`}
                src="/popcorn.png"
                alt="Popcorn"
                style={{ height: "30px", marginRight: "0.5rem" }}
              />
            ))}
          <img src="/soda.png" alt="Soda" style={{ height: "30px", marginLeft: "0.5rem" }} />
          <img src="/soda.png" alt="Soda" style={{ height: "30px", marginLeft: "0.5rem" }} />
        </div>
      </div>
      <CustomTimeline />
    </>
  );
}

export default App;
