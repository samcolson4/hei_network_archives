import PopcornIcon from "/popcorn.png";
import SodaIcon from "/soda.png";
import DeckerIcon from "/decker_phone.png";
import HeiLogo from "/hei_logo.png";
import OscarIcon from "/oscar.png";
import PodcastIcon from "/podcast_logo.png";
import MovieStarIcon from "/movie_star.png";

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
