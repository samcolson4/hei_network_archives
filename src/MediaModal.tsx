import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  media: {
    title: string;
    date_published: string;
    url?: string;
    show?: string | null;
    collection?: string;
    poster_url?: string;
  } | null;
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

  const formatLabel = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {media.show && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            {media.show === "on_cinema" && (
              <img
                src="/popcorn.png"
                alt="On Cinema"
                style={{ height: "40px" }}
              />
            )}
            {media.show?.toLowerCase() === "decker" && (
              <img
                src="/decker_logo.jpg"
                alt="Decker"
                style={{ height: "40px" }}
              />
            )}
          </Box>
        )}
        {media.poster_url && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <img
              src={media.poster_url}
              alt={media.title}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
            />
          </Box>
        )}
        <Typography variant="h6" sx={{ flex: 1, textAlign: "left" }}>
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
        {media.show && (
          <Typography variant="subtitle1">{formatLabel(media.show)}</Typography>
        )}
        {media.collection && (
          <Typography variant="subtitle1">
            {formatLabel(media.collection)}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          {new Date(media.date_published).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
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
