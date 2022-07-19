import React, { useEffect, useRef, useState } from "react";
import "./masonry.css";

const MasonryContainer = ({ children }) => {
  const renderTimes = useRef(1);

  useEffect(() => {
    console.log("masonry Renders", renderTimes.current);
    renderTimes.current += 1;
  });

  const [columnWidth, setColumnWidth] = useState(200);

  const columns = useRef([]); // [150,300,25,145]
  const [currentNumberOfColumns, setCurrentNumberOfColumns] = useState(0);

  const [itemsMap, setItemsMap] = useState([]);

  // ref to div container
  const containerRef = useRef(null);

  //refs of childs
  const elementsMap = useRef([]);

  // callback when the child react element gets rendered first time
  const notifyContainer = (element, childKey) => {
    // if the element is already registered then skip
    if (!elementsMap.current.find((el) => el.childKey === childKey)) {
      elementsMap.current[elementsMap.current.length] = {
        childKey,
        element,
      };
    }
  };

  /*
    1-
    Columns and change of container width
    should get re-triggered when the container's width changes
   */

  const calcColumns = () => {
    const containerNode = containerRef.current;
    const containerWidth = containerNode.getBoundingClientRect().width;

    // divide parent width by column width
    const numberOfColumns = Math.floor(containerWidth / columnWidth);

    // if the new column lenght is not the same
    if (currentNumberOfColumns !== numberOfColumns) {
      const tempColumnsArray = [];
      //register columns with default height of 0
      for (let i = 0; i < numberOfColumns; i++) tempColumnsArray.push(0);
      // save tempColumnsArray in columns state
      columns.current = tempColumnsArray;
      // remember the current number of columns
      // console.info(
      //   `prevNumberOfColumns ${currentNumberOfColumns}, numberOfColumns ${numberOfColumns}`
      // );
      setCurrentNumberOfColumns(tempColumnsArray.length);
    }
  };

  useEffect(calcColumns, []);

  // listen to window resize event
  const windowResizeEventListener = useRef(
    window.addEventListener("resize", calcColumns)
  );

  const getShortestColumnID = () => {
    return columns.current.reduce(
      (prevKey, currentColumn, currentKey) =>
        columns.current[prevKey] <= currentColumn ? prevKey : currentKey,
      0
    );
  };
  const getLongestColumnID = () => {
    return columns.current.reduce(
      (prevKey, currentColumn, currentKey) =>
        columns.current[prevKey] <= currentColumn ? currentKey : prevKey,
      0
    );
  };
  /*
    2-
    happens when a change of children takes place
    basicly we compare children to itemsMap and detect the new children and register them in itemsMap
    with unique ID and others
    item
    {
       id,
       reactElement,
    }
   */

  const mapChildrenToItems = () => {
    //retrieve all children of type MasonryItem and convert them to an array
    let childrenArray = React.Children.toArray(children);

    // inject ref to particular item
    const itemsMapTemp = childrenArray.map((child) => {
      return {
        id: child.key,
        reactElement: injectRefAsProp(child, child.key), // this will create a new react clone and we expect to recieve dom element later

        // those for overriding column and row when we drag and drop item from a place to another
        // ***** probably no need for this cuz the columns will change sometime and regroups whole items again
        column: null,
        row: null,
      };
    });
    setItemsMap(itemsMapTemp);
  };

  useEffect(mapChildrenToItems, [children]);

  // 3- when childrenRefs array Changes
  const calcHeightsAndPositions = () => {
    // reset heights
    columns.current = columns.current.map((col) => 0);

    // set width, height, x, y
    elementsMap.current.forEach((entity) => {
      // get the height
      const height = entity.element.getBoundingClientRect().height;
      // find the shortest column
      const shortestColumnId = getShortestColumnID();
      // console.log("shortest Column is", shortestColumnId);

      // preparing x and y
      const y = shortestColumnId * columnWidth;
      const x = columns.current[shortestColumnId];

      // assign position to element's style
      entity.element.style.top = x + "px";
      entity.element.style.left = y + "px";

      // add the height of current element to the shortest column
      columns.current[shortestColumnId] += height;

      // set container's height
      containerRef.current.style.height =
        columns.current[getLongestColumnID()] + "px";
    });
  };

  useEffect(calcHeightsAndPositions, [currentNumberOfColumns, itemsMap]);

  // inject props to items
  const injectRefAsProp = (item, childKey) => {
    // if item doesn't have a ref
    if (!item.props.refCallback) {
      const newItem = React.cloneElement(item, {
        childKey,
        notifyContainer,
        width: columnWidth + "px",
      });
      return newItem;
    }
    return item;
  };

  // retrieve React elements to be rendered
  const reactItem = itemsMap.map((item) => item.reactElement);

  return (
    <div ref={containerRef} className="container">
      {reactItem}
    </div>
  );
};

export default MasonryContainer;
