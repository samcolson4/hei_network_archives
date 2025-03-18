import React, { useState, useEffect, useRef } from "react";
import type { MediaItem } from "./types";
import { useSearchParams } from "react-router-dom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography, ToggleButton, Box } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import allMedia from "./data/all_media.json";
import MediaModal from "./MediaModal";
import { renderTimelineImage } from "./timelineDotUtils";
import { TimelineDot } from "@mui/lab";

const CustomTimeline = () => {
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedMedia, setSelectedMedia] = useState<
    (typeof allMedia)[number] | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasOpenedFromURL = useRef(false);
  let currentYear: string | null = null;

  const supportOptions = [
    "a coffee",
    "organic champagne",
    "an RJ's Shake",
    "Germ Shield-X",
  ];
  const [randomSupportOption] = useState(() =>
    supportOptions[Math.floor(Math.random() * supportOptions.length)]
  );

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

  useEffect(() => {
    if (hasOpenedFromURL.current) return;
    const titleFromURL = searchParams.get("modal");
    if (titleFromURL) {
      const foundMedia = sortedMediaItems.find((m) => m.title === titleFromURL);
      if (foundMedia) {
        setSelectedMedia(foundMedia);
        setModalOpen(true);
        hasOpenedFromURL.current = true;
      }
    }
  }, [searchParams, sortedMediaItems]);

  const allYears = Array.from(
    new Set(
      sortedMediaItems.map((m) =>
        new Date(m.date_published).getFullYear().toString(),
      ),
    ),
  );
  allYears.sort((a, b) =>
    sortOrder === "desc" ? Number(b) - Number(a) : Number(a) - Number(b),
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
      },
    );

    const yearHeaders = document.querySelectorAll("[data-year]");
    yearHeaders.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sortedMediaItems]);

  const formatLabel = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          minHeight: "80vh",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          gap: "clamp(1rem, 5vw, 6rem)",
        }}
      >
        <div
          style={{
            width: "60px",
            padding: "0.25rem",
            position: "sticky",
            top: "165px",
            alignSelf: "flex-start",
            height: "fit-content",
            display: isMobile ? "none" : "block",
          }}
        >
          <ToggleButton
            value="sortToggle"
            selected={sortOrder === "desc"}
            onChange={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            style={{
              padding: "0.25rem",
              marginBottom: "0.75rem",
              width: "100%",
            }}
          >
            <SwapVertIcon />
          </ToggleButton>
          {allYears.map((year) => (
            <button
              key={year}
              onClick={() => {
                const el = document.getElementById(`year-${year}`);
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <div
          style={{
            flex: 1,
            padding: isMobile ? "1rem 0.5rem" : "2rem",
            boxSizing: "border-box",
            minHeight: "80vh",
          }}
        >
          <Timeline
            className="timeline"
          sx={{
              [`& .${timelineContentClasses.root}`]: {
                flex: 1,
                marginBottom: "2rem",
              },
            }}
          >
            {sortedMediaItems.map((media, idx) => {
              const mediaYear = new Date(media.date_published)
                .getFullYear()
                .toString();
              const showYearHeader = mediaYear !== currentYear;
              if (showYearHeader) currentYear = mediaYear;

              return (
                <React.Fragment key={idx}>
                  {showYearHeader && (
                    <TimelineItem>
                      <TimelineOppositeContent
                        color="textSecondary"
                        sx={{
                          flex: 0.2,
                          minWidth: "80px",
                          pr: 2,
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
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
                    <TimelineOppositeContent color="textSecondary" sx={{ flex: 0.20, minWidth: "80px", pr: 2, display: "flex", alignItems: "center", height: "100%" }}>
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
                          backgroundColor: "transparent",
                          padding: 0,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {renderTimelineImage(media)}
                      </TimelineDot>
                      {idx < sortedMediaItems.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        onClick={() => {
                          setSelectedMedia(media);
                          setModalOpen(true);
                          setSearchParams({ modal: media.title });
                        }}
                        sx={{
                          cursor: "pointer",
                          border: "2px solid #ccc",
                          borderRadius: "8px",
                          padding: "0.5rem",
                          width: isMobile ? "100%" : "25rem",
                          transition:
                            "box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 0 10px rgba(30, 136, 229, 0.6)",
                            borderColor: "#1e88e5",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 0.0, fontWeight: "bold" }}
                        >
                          {media.title}
                        </Typography>
                        {media.franchise && media.season_name && (
                          <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
                            {formatLabel(media.franchise)}:{" "}
                            {formatLabel(media.season_name)}
                          </Typography>
                        )}
                        {media.media_type === "article" && (
                          <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
                            HEI Network News
                          </Typography>
                        )}
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                </React.Fragment>
              );
            })}
          </Timeline>
        </div>
        <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 1000 }}>
          <a
            href="https://buymeacoffee.com/samcolson4"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFDD00",
              color: "#000",
              borderRadius: "999px",
              padding: "0.5rem 1rem",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <span role="img" aria-label="coffee" style={{ marginRight: "0.5rem" }}>
              ☕
            </span>
            Buy me {isMobile ? "a coffee" : randomSupportOption}
          </a>
        </div>
      </div>
      <MediaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSearchParams({});
        }}
        media={selectedMedia as MediaItem | null}
        onPrev={() => {
          if (!selectedMedia) return;
          const currentIndex = sortedMediaItems.findIndex(
            (m) => m.title === selectedMedia.title,
          );
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            const prevMedia = sortedMediaItems[prevIndex];
            setSelectedMedia(prevMedia);
            setSearchParams({ modal: prevMedia.title });
          }
        }}
        onNext={() => {
          if (!selectedMedia) return;
          const currentIndex = sortedMediaItems.findIndex(
            (m) => m.title === selectedMedia.title,
          );
          const nextIndex = currentIndex + 1;
          if (nextIndex < sortedMediaItems.length) {
            const nextMedia = sortedMediaItems[nextIndex];
            setSelectedMedia(nextMedia);
            setSearchParams({ modal: nextMedia.title });
          }
        }}
        isFirst={
          selectedMedia
            ? sortedMediaItems.findIndex(
                (m) => m.title === selectedMedia.title,
              ) === 0
            : false
        }
        isLast={
          selectedMedia
            ? sortedMediaItems.findIndex(
                (m) => m.title === selectedMedia.title,
              ) ===
              sortedMediaItems.length - 1
            : false
        }
      />
    </>
  );
};

export default CustomTimeline;
