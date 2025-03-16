import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
}

const MediaModal: React.FC<MediaModalProps> = ({ open, onClose, media, onPrev, onNext }) => {
  if (!media) return null;

  const formatLabel = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <button onClick={onPrev} style={{ fontSize: "1.5rem", cursor: "pointer", border: "none", background: "none" }}>
            ◀
          </button>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
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
          <button onClick={onNext} style={{ fontSize: "1.5rem", cursor: "pointer", border: "none", background: "none" }}>
            ▶
          </button>
        </Box>
        {media.poster_url && (
          <Box sx={{ mb: 2 }}>
            <img
              src={media.poster_url}
              alt={media.title}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
            />
          </Box>
        )}
        <Typography variant="body2" gutterBottom>
          {new Date(media.date_published).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
        {media.show && (
          <Typography variant="subtitle1">{formatLabel(media.show)}</Typography>
        )}
        {media.collection && (
          <Typography variant="subtitle1">{formatLabel(media.collection)}</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default MediaModal;
