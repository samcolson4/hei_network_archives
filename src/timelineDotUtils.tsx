import React from "react";
import TimelineDot from "@mui/lab/TimelineDot";
import { Colors } from "./styles/colors";
import PopcornIcon from "../public/popcorn.png";
import SodaIcon from "../public/soda.png";
import DeckerIcon from "../public/decker_phone.png";
import HeiLogo from "../public/hei_logo.png";
import OscarIcon from "../public/oscar.png";
import PodcastIcon from "../public/podcast_logo.png";

interface MediaItem {
  franchise: string | null;
  media_type: string;
  season_name: string | null;
  is_bonus?: boolean;
}

export const formatLabel = (str: string) =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const getDotColor = (
  franchise: string | null,
  mediaType: string,
  seasonName: string | null,
  isBonus?: boolean,
): string => {
  if (mediaType === "article") return Colors.blue;
  if (isBonus) return Colors.green;
  if (seasonName?.toLowerCase().includes("oscar special")) return Colors.yellow;

  switch (franchise) {
    case "on_cinema":
      return Colors.red;
    case "heilot":
      return Colors.purple;
    case "decker":
      return Colors.blue;
    case "on_cinema_podcast":
      return Colors.purple;
    default:
      return Colors.default;
  }
};

export const renderTimelineDot = (
  media: MediaItem,
  getDotColor: (
    franchise: string | null,
    mediaType: string,
    seasonName: string | null,
    isBonus?: boolean,
  ) => string,
) => {
  const isOscar = media.season_name?.toLowerCase().includes("oscar");

  if (media.is_bonus) {
    return (
      <TimelineDot sx={{ backgroundColor: "transparent", padding: 0, width: 32, height: 32 }}>
        <img src={SodaIcon} alt="Soda" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  if (media.franchise === "on_cinema" && isOscar) {
    return (
      <TimelineDot sx={{ backgroundColor: "transparent", padding: 0, width: 32, height: 32 }}>
        <img src={OscarIcon} alt="Oscar" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  if (media.media_type === "podcast") {
    return (
      <TimelineDot
        sx={{
          backgroundColor: "transparent",
          padding: 0,
          width: 32,
          height: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={PodcastIcon} alt="Podcast icon" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  if (media.franchise === "on_cinema") {
    return (
      <TimelineDot sx={{ backgroundColor: "transparent", padding: 0, width: 32, height: 32 }}>
        <img src={PopcornIcon} alt="Popcorn" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  if (media.franchise === "decker") {
    return (
      <TimelineDot sx={{ backgroundColor: "transparent", padding: 0, width: 32, height: 32 }}>
        <img src={DeckerIcon} alt="Decker" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  if (media.media_type === "article") {
    return (
      <TimelineDot sx={{ backgroundColor: "transparent", padding: 0, width: 32, height: 32 }}>
        <img src={HeiLogo} alt="Hei logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TimelineDot>
    );
  }

  return (
    <TimelineDot
      sx={{
        backgroundColor: getDotColor(
          media.franchise,
          media.media_type,
          media.season_name,
          Boolean(media.is_bonus),
        ),
      }}
    />
  );
};
