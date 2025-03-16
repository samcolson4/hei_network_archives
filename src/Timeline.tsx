import React, { useState, useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography, ToggleButton } from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Colors } from "./styles/colors";
import allMedia from "./data/all_media.json";

const CustomTimeline = () => {
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  let currentYear: string | null = null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedMediaItems = [...allMedia].sort((a, b) => {
    const aTime = new Date(a.date_published).getTime();
    const bTime = new Date(b.date_published).getTime();
    return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
  });

  const allYears = Array.from(
    new Set(sortedMediaItems.map((m) => new Date(m.date_published).getFullYear().toString()))
  );
  allYears.sort((a, b) =>
    sortOrder === "desc" ? Number(b) - Number(a) : Number(a) - Number(b)
  );

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
  }, [sortedMediaItems]);

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
    <>
      <div style={{ display: "flex", width: "100%", minHeight: "80vh", flexWrap: "nowrap", alignItems: "flex-start", gap: "0.5rem" }}>
        <div
          style={{
            width: "60px",
            padding: "0.25rem",
            position: "sticky",
            top: "90px",
            alignSelf: "flex-start",
            height: "fit-content",
            display: isMobile ? "none" : "block",
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
        <div style={{ flex: 1, padding: "0.25rem 0.25rem 0.25rem 0", boxSizing: "border-box", minHeight: "80vh" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <ToggleButton
              value="sortToggle"
              selected={sortOrder === "desc"}
              onChange={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
              style={{ padding: "0.25rem 1rem" }}
            >
              <SwapVertIcon />
            </ToggleButton>
          </div>
          <Timeline
            className="timeline"
            sx={{
              [`& .${timelineContentClasses.root}`]: {
                flex: 1,
              },
            }}
          >
            {sortedMediaItems.map((media, idx) => {
              const mediaYear = new Date(media.date_published).getFullYear().toString();
              const showYearHeader = mediaYear !== currentYear;
              if (showYearHeader) currentYear = mediaYear;

              return (
                <React.Fragment key={idx}>
                  {showYearHeader && (
                    <TimelineItem>
                      <TimelineOppositeContent sx={{ textAlign: "left", paddingTop: "1rem" }}>
                        <Typography
                          id={`year-${mediaYear}`}
                          data-year={mediaYear}
                          variant="h3"
                        >
                          {mediaYear}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator />
                      <TimelineContent />
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
                      {idx < sortedMediaItems.length - 1 && !(showYearHeader && idx === sortedMediaItems.length - 1) && <TimelineConnector />}
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
    </>
  );
};

export default CustomTimeline;
