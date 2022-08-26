import React, { useEffect, useRef, useState } from "react";
import MasonryContainer from "./MasonryFix";
import Item from "./MasonryItem";
import "./masonry.css";

const imagesDB = [
  {
    id: 0,
    src: "https://picsum.photos/200/300",
    width: 200,
    height: 300,
  },
  {
    id: 1,
    src: "https://picsum.photos/200/150",
    width: 200,
    height: 200,
  },
  {
    id: 2,
    src: "https://picsum.photos/200/50",
    width: 200,
    height: 250,
  },
  {
    id: 3,
    src: "https://picsum.photos/200/320",
    width: 200,
    height: 320,
  },
  {
    id: 4,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 400,
  },
  {
    id: 5,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 400,
  },
  {
    id: 6,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 200,
  },
  {
    id: 7,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 290,
  },
  {
    id: 8,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 350,
  },
];

function App() {
  const renderTimes = useRef(1);
  const [imgs, setImgs] = useState(imagesDB);
  useEffect(() => {
    renderTimes.current += 1;
  });

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const addRandomImage = () => {
    const height = randomIntFromInterval(200, 450);
    const newImg = {
      id: imgs.length,
      src: `https://picsum.photos/200/${height}`,
      width: 200,
      height,
    };

    setImgs((imgs) => [...imgs, newImg]);
  };

  return (
    <main>
      <button onClick={addRandomImage}>Add Image</button>
      <div>{`number of images ${imgs.length}`}</div>
      <MasonryContainer
        centerItems={true}
        maxColumns={10}
        minColumns={1}
        verticalGap={15} // could be a string to specify the unit
        horizontalGap={15} // could be a string to specify the unit
      >
        {imgs.map((img, index) => (
          <Item key={index}>
            <div className="pintrestCard">
              <img src={img.src} alt="" />
              <div className="info">
                <div className="titleWrap">
                  <div className="title">
                    Map of the Entire Universe Superclusters
                  </div>
                </div>
                <div className="profile">
                  <img
                    className="pfp"
                    src="https://picsum.photos/50"
                    alt="pfp"
                  />
                  <span className="username">
                    <a href="#">Username</a>
                  </span>
                </div>
              </div>
            </div>
          </Item>
        ))}
      </MasonryContainer>
    </main>
  );
}

export default App;
