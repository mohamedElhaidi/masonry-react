import React, { useEffect, useRef, useState } from "react";
import "./masonry.css";

const Item = ({
  children,
  childKey,
  width,
  notifyContainerCallback,
  recalcHeightsCallback,
}) => {
  const itemRef = useRef(null);

  const style = {
    position: "absolute",
    overflow: "hidden",
    width,
    height: "fit-content",
  };

  const notifyContainerHandler = () => {
    if (!notifyContainerCallback) return;
    notifyContainerCallback(itemRef.current, childKey);
  };
  const recalcHeightsHandler = () => {
    if (!recalcHeightsCallback) return;
    recalcHeightsCallback(itemRef.current, childKey);
  };
  // send element div ref to the container
  useEffect(() => {
    notifyContainerHandler();
  }, [notifyContainerCallback]);

  // fixing image loading after heights been calculated
  useEffect(() => {
    if (!itemRef.current) return;
    let imgMap = [];
    imgMap = [...itemRef.current.getElementsByTagName("img")].map((img) => ({
      imgElement: img,
      loadEventRef: null,
    }));
    imgMap.forEach((i) => {
      const loadEventRef = i.imgElement.addEventListener("load", (event) =>
        recalcHeightsHandler()
      );
      i.loadEventRef = loadEventRef;
    });

    // unlisten
    return () => {
      imgMap.forEach((i) => {
        i.imgElement.removeEventListener("load", i.loadEventRef);
      });
    };
  }, [itemRef]);

  // render
  return (
    <div ref={itemRef} className="item" style={style}>
      {children}
    </div>
  );
};

export default Item;
