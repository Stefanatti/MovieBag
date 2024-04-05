import { Slider, Box, IconButton } from "@mui/material";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ShowSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  //   const [value, setValue] = useState(0);

  //   const handleChange = (event, newValue) => {
  //     setValue(newValue);
  //   };

  //   const handleNext = () => {
  //     setValue((prevValue) =>
  //       prevValue === images.length - 1 ? 0 : prevValue + 1
  //     );
  //   };

  //   const handlePrev = () => {
  //     setValue((prevValue) =>
  //       prevValue === 0 ? images.length - 1 : prevValue - 1
  //     );
  //   };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="previous image"
        onClick={handlePrev}
        sx={{ position: "absolute", left: 0 }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        aria-label="next image"
        onClick={handleNext}
        sx={{ position: "absolute", right: 0 }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex}`}
          style={{ width: "40%", height: "auto" }}
        />
      </Box>
    </Box>

    // <Box
    //   sx={{
    //     width: "100%",
    //     display: "flex",
    //     justifyContent: "center",
    //     position: "relative",
    //   }}
    // >
    //   <IconButton
    //     aria-label="previous image"
    //     onClick={handlePrev}
    //     sx={{ position: "absolute", left: 0 }}
    //   >
    //     <ArrowBackIosIcon />
    //   </IconButton>
    //   <IconButton
    //     aria-label="next image"
    //     onClick={handleNext}
    //     sx={{ position: "absolute", right: 0 }}
    //   >
    //     <ArrowForwardIosIcon />
    //   </IconButton>
    //   <Slider
    //     value={value}
    //     onChange={handleChange}
    //     aria-label="Image carousel"
    //     valueLabelDisplay="off"
    //     min={0}
    //     max={images.length - 1}
    //     step={1}
    //     sx={{ width: "80%", mx: "auto" }}
    //   />
    //   <Box sx={{ textAlign: "center", mt: 2 }}>
    //     <img
    //       src={images[value]}
    //       alt={`Slide ${value}`}
    //       style={{ width: "80%", height: "auto" }}
    //     />
    //   </Box>
    // </Box>
  );
};

export default ShowSlider;
