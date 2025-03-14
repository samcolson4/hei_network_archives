import React, { useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography } from "@mui/material";
import { Episode } from "./types";
import { Colors } from "./styles/colors";

const CustomTimeline = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/episodes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch episodes");
        return res.json();
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const getDotColor = (show: string, collection: string): string => {
    switch (collection) {
      case "Bonus Content":
        return Colors.green;
      case "Oscar Specials":
        return Colors.yellow;
    }

    switch (show) {
      case "on_cinema":
        return Colors.red;
      case "heilot":
        return Colors.blue;
      case "Decker":
        return Colors.purple;
      default:
        return Colors.default;
    }
  };

  return (
    <div className="timeline-wrapper">
      <Timeline
        className="timeline"
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            flex: 1,
          },
        }}
      >
        {episodes.map((ep, idx) => (
          <TimelineItem key={ep.id}>
            <TimelineOppositeContent color="textSecondary">
              <Typography variant="body2">
                {new Date(ep.attributes.aired_at).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: getDotColor(
                    ep.attributes.show,
                    ep.attributes.collection,
                  ),
                }}
              />
              {idx < episodes.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6">
                {ep.attributes.episode_url ? (
                  <a
                    href={ep.attributes.episode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#1e88e5" }}
                  >
                    {ep.attributes.episode_title}
                  </a>
                ) : (
                  ep.attributes.episode_title
                )}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default CustomTimeline;
