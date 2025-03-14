import { useEffect, useState } from "react";
import type { Episode } from "./types";
import "./App.css";

function App() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/episodes")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setEpisodes(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>HEI Network Official* Archives</h1>
      <p>* completely unofficial</p>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {episodes.map((ep) => (
        <div key={ep.id}>
          <span>
            {new Date(ep.attributes.aired_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            —{" "}
          </span>
          <a
            href={ep.attributes.episode_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ep.attributes.episode_title}
          </a>
        </div>
      ))}
    </>
  );
}

export default App;
