import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import GalleryImg1 from "../../assets/images/gallery/g1.jpg";
import GalleryImg3 from "../../assets/images/gallery/g3.jpg";
import GalleryImg4 from "../../assets/images/gallery/g4.jpg";
import GalleryImg6 from "../../assets/images/gallery/g6.jpg";
import GalleryImg7 from "../../assets/images/gallery/g7.jpg";

const Gallery = () => {
  const [open, setOpen] = useState(false);

  const images = [
    {
      src: GalleryImg1,
      description: "Person wearing shoes",
      sub: "Gift Habeshaw",
    },
    {
      src: GalleryImg3,
      description:
        "Blonde woman wearing sunglasses smiling at the camera",
      sub: "Dmitriy Frantsev",
    },
    {
      src: GalleryImg6,
      sub: "Harry Cunningham",
    },
    {
      src: GalleryImg4,
      description: "Jaipur , Rajasthan India",
      sub: "Liam Baldock",
    },
    {
      src: GalleryImg7,
      sub: "Verne Ho",
    },
    {
      src: GalleryImg6,
      description: "Rann of kutch , India",
      sub: "Hari Nandakumar",
    },
  ];

  return (
    <>
      {/* Gallery grid */}
      <div className="gallery-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "10px"
      }}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.description || "image"}
            style={{ width: "100%", height: "auto", cursor: "pointer", borderRadius: "6px" }}
            onClick={() => setOpen(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open !== false}
        close={() => setOpen(false)}
        index={typeof open === "number" ? open : 0}
        slides={images.map((img) => ({ src: img.src }))}
        plugins={[Thumbnails]}
      />
    </>
  );
};

export default Gallery;
