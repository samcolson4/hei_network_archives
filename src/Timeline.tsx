import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography, ToggleButton, Box } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Colors } from "./styles/colors";
import allMedia from "./data/all_media.json";
import MediaModal from "./MediaModal";

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
        new Date(m.date_published).getFullYear().toString()
      )
    )
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

  const getDotColor = (
    franchise: string | null,
    mediaType: string,
    seasonName: string | null,
  isBonus?: boolean
  ): string => {
    if (isBonus) {
      return Colors.green;
    }

    if (seasonName && seasonName.toLowerCase().includes("oscar special")) {
      return Colors.yellow;
    }

    if (franchise) {
      switch (franchise) {
        case "on_cinema":
          return Colors.red;
        case "heilot":
          return Colors.purple;
        case "Decker":
          return Colors.blue;
        case "on_cinema_podcast":
          return Colors.purple;
        default:
          break;
      }
    }

    if (mediaType === "article") {
      return Colors.green;
    }

    return Colors.default;
  };

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
          width: "100%",
          minHeight: "80vh",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: "60px",
            padding: "0.25rem",
            position: "sticky",
            top: "115px",
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
            padding: "0.25rem 0.25rem 0.25rem 0",
            boxSizing: "border-box",
            minHeight: "80vh",
          }}
        >
          <Timeline
            className="timeline"
            sx={{
              [`& .${timelineContentClasses.root}`]: {
                flex: 1,
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
                        sx={{ textAlign: "left", paddingTop: "1rem" }}
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
                    <TimelineOppositeContent color="textSecondary">
                      <Typography variant="body2">
                        {new Date(media.date_published).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          backgroundColor: getDotColor(media.franchise, media.media_type, media.season_name, Boolean(media.is_bonus)),
                        }}
                      />
                      {idx < sortedMediaItems.length - 1 &&
                        !(
                          showYearHeader && idx === sortedMediaItems.length - 1
                        ) && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
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
                          transition:
                            "box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 0 10px rgba(30, 136, 229, 0.6)",
                            borderColor: "#1e88e5",
                          },
                        }}
                      >
                        <Typography variant="h6">{media.title}</Typography>
                        {media.franchise && (
                          <Typography
                            variant="subtitle1"
                            sx={{ mb: 0.0, fontStyle: "italic" }}
                          >
                            {formatLabel(media.franchise)}
                          </Typography>
                        )}
                        {media.season_name && (
                          <Typography
                            variant="subtitle1"
                            sx={{ mb: 0.0, fontStyle: "italic" }}
                          >
                            {formatLabel(media.season_name)}
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
      </div>
      <MediaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSearchParams({});
        }}
        media={
          selectedMedia
            ? {
                ...selectedMedia,
                poster_url: selectedMedia.poster_url ?? undefined,
              }
            : null
        }
        onPrev={() => {
          if (!selectedMedia) return;
          const currentIndex = sortedMediaItems.findIndex(
            (m) => m.title === selectedMedia.title
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
            (m) => m.title === selectedMedia.title
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
            ? sortedMediaItems.findIndex((m) => m.title === selectedMedia.title) === 0
            : false
        }
        isLast={
          selectedMedia
            ? sortedMediaItems.findIndex((m) => m.title === selectedMedia.title) === sortedMediaItems.length - 1
            : false
        }
      />
    </>
  );
};

export default CustomTimeline;
