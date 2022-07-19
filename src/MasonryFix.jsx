import React, { useEffect, useRef, useState } from "react";
import * as MasonryHelpers from "./MasonryHelpers";
import "./masonry.css";

const MasonryContainer = ({
  children,
  centerItems = false,
  maxColumns,
  minColumns,
  verticalGap,
  horizontalGap,
}) => {
  const renderTimes = useRef(1);

  useEffect(() => {
    console.log("masonry Renders", renderTimes.current);
    renderTimes.current += 1;
  });

  const [columnWidth, setColumnWidth] = useState(200);

  const columnsRef = useRef([]); // [150,300,25,145]
  const [currentNumberOfColumns, setCurrentNumberOfColumns] = useState(0);
  const [itemsMap, setItemsMap] = useState([]);

  // ref to div container
  const containerRef = useRef(null);

  //refs of childs
  const elementsMap = useRef([]);

  // paddings
  const margin = useRef(0);

  // callback when the child react element gets rendered first time
  const notifyContainerCallback = (element, childKey) => {
    // if the element is already registered then skip
    if (!elementsMap.current.find((el) => el.childKey === childKey)) {
      elementsMap.current[elementsMap.current.length] = {
        childKey,
        element,
        column: 0,
      };
    }
  };

  const recalcHeightsCallback = (itemRef, key) => {
    calcHeightsAndPositions();
  };
  /*
    1-
    Columns and change of container width
    should get re-triggered when the container's width changes
   */

  const ColumnsResizeHandler = () => {
    const numberOfColumns = MasonryHelpers.calcNumberOfColumns(
      containerRef,
      columnsRef,
      columnWidth,
      maxColumns,
      minColumns,
      currentNumberOfColumns,
      verticalGap
    );

    // calc margin
    margin.current = MasonryHelpers.calcMargin(
      containerRef,
      numberOfColumns,
      columnWidth,
      centerItems,
      verticalGap
    );
    elementsMap.current.forEach((entity) => {
      applyMarginToItem(entity);
    });
    // if the new column lenght is not the same
    if (currentNumberOfColumns !== numberOfColumns) {
      const tempColumnsArray = [];
      //register columns with default height of 0
      for (let i = 0; i < numberOfColumns; i++) tempColumnsArray.push(0);
      // save tempColumnsArray in columns state
      columnsRef.current = tempColumnsArray;
      // remember the current number of columns
      setCurrentNumberOfColumns(tempColumnsArray.length);
    }
  };
  // const ColumnsResizeHandler = () => {
  //   const containerNode = containerRef.current;
  //   const containerWidth = containerNode.getBoundingClientRect().width;

  //   // divide parent width by column width
  //   const ratio = containerWidth / (columnWidth + verticalGap);
  //   let numberOfColumns = Math.floor(ratio);

  //   // check max min
  //   if (numberOfColumns > maxColumns) numberOfColumns = maxColumns;
  //   else if (numberOfColumns < minColumns) numberOfColumns = minColumns;

  //   // Margin
  //   margin.current = centerItems
  //     ? Math.abs(((numberOfColumns - ratio) * columnWidth) / 2).toFixed(2)
  //     : 0;

  //   elementsMap.current.forEach((entity) => {
  //     calcMargin(entity);
  //   });
  //   // if the new column lenght is not the same
  //   if (currentNumberOfColumns !== numberOfColumns) {
  //     const tempColumnsArray = [];
  //     //register columns with default height of 0
  //     for (let i = 0; i < numberOfColumns; i++) tempColumnsArray.push(0);
  //     // save tempColumnsArray in columns state
  //     columns.current = tempColumnsArray;
  //     // remember the current number of columns
  //     setCurrentNumberOfColumns(tempColumnsArray.length);
  //   }
  // };

  useEffect(() => {
    ColumnsResizeHandler();
    // listen to window resize event
    const windowResizeEventListener = window.addEventListener(
      "resize",
      ColumnsResizeHandler
    );
    // remove event listener
    return () => {
      window.removeEventListener("resize", windowResizeEventListener);
    };
  }, []);

  const applyMarginToItem = (entity) => {
    const hGap = horizontalGap * entity.column;
    const marginLeft = +margin.current + +hGap + "px";
    entity.element.style.marginLeft = marginLeft;
  };

  const getShortestColumnID = () => {
    return columnsRef.current.reduce(
      (prevKey, currentColumn, currentKey) =>
        columnsRef.current[prevKey] <= currentColumn ? prevKey : currentKey,
      0
    );
  };
  const getLongestColumnID = () => {
    return columnsRef.current.reduce(
      (prevKey, currentColumn, currentKey) =>
        columnsRef.current[prevKey] <= currentColumn ? currentKey : prevKey,
      0
    );
  };
  /*
    2-
    happens when a change of children takes place
    basicly we compare children to itemsMap and detect the new children and register them in itemsMap
    with unique ID and others
   */

  // inject props to items
  const injectRefAsProp = (item, childKey) => {
    // if item doesn't have a ref
    if (!item.props.refCallback) {
      const newItem = React.cloneElement(item, {
        childKey,
        width: columnWidth + "px",
        notifyContainerCallback,
        recalcHeightsCallback,
      });
      return newItem;
    }
    return item;
  };

  const mapChildrenToItems = () => {
    //retrieve all children of type MasonryItem and convert them to an array
    let childrenArray = React.Children.toArray(children);

    // inject ref to particular item
    const itemsMapTemp = childrenArray.map((child) => {
      return injectRefAsProp(child, child.key); // this will create a new react clone and we expect to recieve dom element later
    });
    setItemsMap(itemsMapTemp);
  };

  useEffect(mapChildrenToItems, [children]);

  // 3- when childrenRefs array Changes

  const calcHeightsAndPositions = () => {
    // reset heights
    columnsRef.current = columnsRef.current.map(() => 0);

    // set width, height, x, y

    elementsMap.current.forEach((entity) => {
      // get the height
      const height = entity.element.getBoundingClientRect().height;
      // find the shortest column
      const shortestColumnId = getShortestColumnID();

      // assign column to entity
      entity.column = shortestColumnId;

      // preparing x and y
      const y = shortestColumnId * columnWidth;
      const x = columnsRef.current[shortestColumnId];

      // assign position to element's style
      entity.element.style.top = x + "px";
      entity.element.style.left = y + "px";
      applyMarginToItem(entity);

      // add the height of current element to the shortest column
      columnsRef.current[shortestColumnId] += height + verticalGap;

      // set container's height
      containerRef.current.style.height =
        columnsRef.current[getLongestColumnID()] + "px";
    });
  };

  useEffect(calcHeightsAndPositions, [currentNumberOfColumns, itemsMap]);

  return (
    <div ref={containerRef} className="container">
      {itemsMap}
    </div>
  );
};

export default MasonryContainer;
