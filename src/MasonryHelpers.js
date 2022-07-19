export const calcNumberOfColumns = (
  containerRef,
  columnsRef,
  columnWidth,
  maxColumns,
  minColumns,
  currentNumberOfColumns,
  verticalGap
) => {
  // container width
  const containerWidth = getContainerWidth(containerRef);
  // divide parent width by column width
  const ratio = containerWidth / (columnWidth + verticalGap);
  let numberOfColumns = Math.floor(ratio);

  // check max min
  if (numberOfColumns > maxColumns) numberOfColumns = maxColumns;
  else if (numberOfColumns < minColumns) numberOfColumns = minColumns;

  // if the new column lenght is not the same
  if (currentNumberOfColumns !== numberOfColumns) {
    const tempColumnsArray = [];
    //register columns with default height of 0
    for (let i = 0; i < numberOfColumns; i++) tempColumnsArray.push(0);
    // save tempColumnsArray in columns ref state
    columnsRef.current = tempColumnsArray;
    // remember the current number of columns
    return tempColumnsArray.length;
  }
};
export const calcMargin = (
  containerRef,
  numberOfColumns,
  columnWidth,
  centerItems = false,
  verticalGap
) => {
  const containerWidth = getContainerWidth(containerRef);
  return centerItems
    ? Math.abs(
        ((numberOfColumns - containerWidth / (columnWidth + verticalGap)) *
          columnWidth) /
          2
      ).toFixed(2)
    : 0;
};

export const getContainerWidth = (containerRef) => {
  const containerNode = containerRef.current;
  return containerNode.getBoundingClientRect().width;
};
