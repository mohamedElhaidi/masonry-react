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
    id: 4,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 400,
  },
  {
    id: 4,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 200,
  },
  {
    id: 4,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 290,
  },
  {
    id: 4,
    src: "https://picsum.photos/200/400",
    width: 200,
    height: 350,
  },
];

function App() {
  const renderTimes = useRef(1);
  const [imgs, setImgs] = useState(imagesDB);
  const [dummyBoxes, setDummyBoxes] = useState([]);
  useEffect(() => {
    // console.log("container Renders", renderTimes.current);
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

  const addDummyBox = () => {
    setDummyBoxes((dummyBoxes) => [...dummyBoxes, "yaay"]);
  };

  return (
    <main>
      <button onClick={addRandomImage}>Click me</button>
      <div>{`number of images ${imgs.length}`}</div>
      <MasonryContainer
        centerItems={true}
        maxColumns={10}
        minColumns={1}
        verticalGap={15} // could be a string to specify the unit
        horizontalGap={15} // could be a string to specify the unit
      >
        <Item>
          <button onClick={addDummyBox}>CLick me</button>
          {dummyBoxes.map((box) => (
            <div className="dummybox">{box}</div>
          ))}
        </Item>

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
                    src="https://i.pinimg.com/75x75_RS/8b/a3/07/8ba307ed5894660deb3e6c58458eab2f.jpg"
                    alt=""
                  />
                  <span className="username">
                    <a href="#">Anee ane</a>
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
