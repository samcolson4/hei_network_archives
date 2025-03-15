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
import { useState, useEffect } from "react";
import { Colors } from "./styles/colors";
import allMedia from "./data/all_media.json";
import React from "react";

const CustomTimeline = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  let currentYear: string | null = null;

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

  const allYears = Array.from(
    new Set(media_items.map((m) => new Date(m.date_published).getFullYear().toString()))
  );
  allYears.sort((a, b) => Number(b) - Number(a));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const firstVisible = visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })[0];
          const year = firstVisible.target.getAttribute("data-year");
          if (year && year !== activeYear) {
            setActiveYear(year);
          }
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );

    const yearHeaders = document.querySelectorAll("[data-year]");
    yearHeaders.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [media_items]);

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

  const formatLabel = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "80vh", minWidth: "1000px" }}>
      <div
        style={{
          width: "100px",
          padding: "1rem",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "fit-content",
        }}
      >
        {allYears.map((year) => (
          <button
            key={year}
            onClick={() => {
              const el = document.getElementById(`year-${year}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              display: "block",
              marginBottom: "0.5rem",
              cursor: "pointer",
              width: "100%",
              padding: "0.5rem",
              fontWeight: activeYear === year ? "bold" : "normal",
              backgroundColor: activeYear === year ? "#ddd" : "transparent",
              border: activeYear === year ? "2px solid #aaa" : "none",
            }}
          >
            {year}
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
          {media_items.map((media, idx) => {
            const mediaYear = new Date(media.date_published).getFullYear().toString();
            const showYearHeader = mediaYear !== currentYear;
            if (showYearHeader) currentYear = mediaYear;

            return (
              <React.Fragment key={idx}>
                {showYearHeader && (
                  <TimelineItem>
                    <TimelineContent>
                      <Typography
                        id={`year-${mediaYear}`}
                        data-year={mediaYear}
                        variant="h1"
                      >
                        {mediaYear}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
                <TimelineItem>
                  <TimelineOppositeContent color="textSecondary">
                    <Typography variant="body2">
                      {new Date(media.date_published).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor: getDotColor(media.show, media.collection),
                      }}
                    />
                    {idx < media_items.length - 1 && !(showYearHeader && idx === media_items.length - 1) && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    {/* title */}
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
                    {/* show */}
                    {media.show && (
                      <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
                        {formatLabel(media.show)}
                      </Typography>
                    )}
                    {/* collection */}
                    {media.collection && (
                      <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
                        {formatLabel(media.collection)}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              </React.Fragment>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

export default CustomTimeline;
