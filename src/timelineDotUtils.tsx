import { Colors } from "./styles/colors";
import PopcornIcon from "../public/popcorn.png";
import SodaIcon from "../public/soda.png";
import DeckerIcon from "../public/decker_phone.png";
import HeiLogo from "../public/hei_logo.png";
import OscarIcon from "../public/oscar.png";
import PodcastIcon from "../public/podcast_logo.png";
import MovieStarIcon from "../public/movie_star.png";

interface MediaItem {
  franchise: string | null;
  media_type: string;
  season_name: string | null;
  is_bonus?: boolean;
  title?: string;
  date_published?: string;
  url?: string;
  collection?: string;
  show?: string | null;
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

export const renderTimelineImage = (
  media: MediaItem,

) => {
  const isOscar = media.season_name?.toLowerCase().includes("oscar");

  if (media.media_type === 'movie') {
    return (
        <img
          src={MovieStarIcon}
          alt="Movie star icon"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }

  if (media.is_bonus) {
    return (
        <img
          src={SodaIcon}
          alt="Soda"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }

  if (media.franchise === "on_cinema" && isOscar) {
    return (
        <img
          src={OscarIcon}
          alt="Oscar"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }

  if (
    media.media_type === "podcast" ||
    media.franchise === "on_cinema_podcast"
  ) {
    return (
        <img
          src={PodcastIcon}
          alt="Podcast icon"
          style={{ width: "90%", height: "90%", objectFit: "contain" }}
        />
    );
  }

  if (media.franchise === "on_cinema") {
    return (
        <img
          src={PopcornIcon}
          alt="Popcorn"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }

  if (media.franchise === "decker") {
    return (
        <img
          src={DeckerIcon}
          alt="Decker"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }

  if (media.media_type === "article") {
    return (
        <img
          src={HeiLogo}
          alt="Hei logo"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
    );
  }
};
