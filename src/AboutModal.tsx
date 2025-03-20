import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

const AboutModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <Typography>
          This is an unofficial timeline for the whole <i>On Cinema</i> universe, unaffiliated with the HEI Network.
        </Typography>
        <br></br>
        <Typography>
          This project was born out of a desire to experience all the <i>On Cinema</i> content in the order it was intended to be consumed. This means not just the core <i>On Cinema</i> episodes, but Decker, Deck of Cards, the HEI Network News posts, etc etc. The whole lot.
        </Typography>
        <br></br>
        <Typography>
          If you have any feedback/questions etc get in touch on <a target="_blank" href="https://bsky.app/profile/samcolson.bsky.social">Bluesky</a>.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
