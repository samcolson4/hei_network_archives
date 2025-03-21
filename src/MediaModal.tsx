import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { renderTimelineImage } from "./timelineDotUtils";
import type { MediaItem } from "./types";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  media: MediaItem | null;
  onPrev: () => void;
  onNext: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const MediaModal: React.FC<MediaModalProps> = ({
  open,
  onClose,
  media,
  onPrev,
  onNext,
  isFirst,
  isLast,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "ArrowLeft" && !isFirst) {
        onPrev();
      } else if (event.key === "ArrowRight" && !isLast) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onPrev, onNext, isFirst, isLast]);

  if (!media) return null;

  const customPosterUrl =
    media.season_name === "On Cinema On Demand Encore"
      ? "/ocod_encore_poster.png"
      : media.season_name === "The Podcast"
      ? "/podcast.jpg"
      : media.poster_url;

  const formatLabel = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            width: 32,
            height: 32,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {renderTimelineImage(media)}
          </div>
        </Box>
        {customPosterUrl && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <img
              src={customPosterUrl}
              alt={media.title}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
            />
          </Box>
        )}
        <Typography variant="h6" sx={{ flex: 1, textAlign: "left" }}>
          {media.title}
        </Typography>
        {media.franchise && media.season_name && (
          <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
            {formatLabel(media.franchise)}: {formatLabel(media.season_name)}
          </Typography>
        )}
        {media.media_type === "article" && (
          <Typography variant="subtitle1" sx={{ mb: 0.0 }}>
            HEI Network News
          </Typography>
        )}
        {media.date_published && (
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {new Date(media.date_published).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        )}
        {media.url && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#1e88e5", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              {media.media_type === "article"
                ? "Read on"
                : media.media_type === "movie"
                ? "Find a place to watch on"
                : media.media_type === "podcast"
                ? "Listen on"
                : "Watch on"} {new URL(media.url).hostname} <ArrowOutwardIcon fontSize="small" />
            </a>
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
        >
          {!isFirst && (
            <button
              onClick={onPrev}
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
            >
              <ArrowBackIosIcon />
            </button>
          )}
          {!isLast && (
            <button
              onClick={onNext}
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
            >
              <ArrowForwardIosIcon />
            </button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default MediaModal;
