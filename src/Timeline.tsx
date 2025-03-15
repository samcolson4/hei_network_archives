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
import { useState } from "react";
import { Colors } from "./styles/colors";
import allMedia from "./data/all_media.json";

const CustomTimeline = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const uniqueCollections = Array.from(
    new Set(allMedia.map((media) => media.collection))
  );

  const media_items = [...allMedia]
    .filter((media) =>
      selectedCollection ? media.collection === selectedCollection : true
    )
    .sort(
    (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
  );

  const getDotColor = (show: string | null, collection: string): string => {
    switch (collection) {
      case "Bonus Content":
        return Colors.green;
      case "Oscar Specials":
        return Colors.yellow;
      case "news":
        return Colors.green;
    }

    switch (show) {
      case "on_cinema":
        return Colors.red;
      case "heilot":
        return Colors.green;
      case "Decker":
        return Colors.blue;
      case "on_cinema_podcast":
        return Colors.purple;
      default:
        return Colors.default;
    }
  };

  return (
  <div style={{ display: "flex", width: "100%", minHeight: "80vh", minWidth: "1000px" }}>
      <div
        style={{
          width: "240px",
          padding: "1rem",
          boxSizing: "border-box",
          borderRight: "1px solid #ccc",
          backgroundColor: "#f8f8f8",
        }}
      >
        <button
          onClick={() => setSelectedCollection(null)}
          style={{
            padding: "0.5rem",
            width: "100%",
            textAlign: "left",
            border: "none",
            backgroundColor: selectedCollection === null ? "#1976d2" : "#e0e0e0",
            color: selectedCollection === null ? "#fff" : "#000",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          All Collections
        </button>
        {uniqueCollections.map((collection) => (
          <button
            key={collection}
            onClick={() => setSelectedCollection(collection)}
            style={{
              padding: "0.5rem",
              width: "100%",
              textAlign: "left",
              border: "none",
              backgroundColor: selectedCollection === collection ? "#1976d2" : "#e0e0e0",
              color: selectedCollection === collection ? "#fff" : "#000",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {collection}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, padding: "1rem", boxSizing: "border-box", minHeight: "80vh" }}>
        <Timeline
          className="timeline"
          sx={{
            [`& .${timelineContentClasses.root}`]: {
              flex: 1,
            },
          }}
        >
          {media_items.map((media, idx) => (
            <TimelineItem key={idx}>
              <TimelineOppositeContent color="textSecondary">
                <Typography variant="body2">
                  {new Date(media.date_published).toLocaleDateString(
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
                    backgroundColor: getDotColor(media.show, media.collection),
                  }}
                />
                {idx < media_items.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">
                  {media.url ? (
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "#1e88e5" }}
                    >
                      {media.title}
                    </a>
                  ) : (
                    media.title
                  )}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default CustomTimeline;
