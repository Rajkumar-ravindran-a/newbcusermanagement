import {Modal, Box } from "@mui/material";



const CommonPopup = ({ open, handleClose, children }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          overflowY: "auto",
          height: 600,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CommonPopup;
