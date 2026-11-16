import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Places each item in the currently shortest column. Heights are known from
// aspect ratios, so the layout is stable before any image has loaded.
// `gap` approximates the spacing (as a fraction of column width) when comparing columns.
export const layoutMasonry = (items, columnCount, getRatio, gap = 0.08) => {
  const count = Math.max(1, columnCount);
  const heights = new Array(count).fill(0);
  const ratioSums = new Array(count).fill(0);
  const rowCounts = new Array(count).fill(0);
  const placements = items.map((item, index) => {
    let column = 0;
    for (let candidate = 1; candidate < count; candidate += 1) {
      if (heights[candidate] < heights[column] - 1e-6) column = candidate;
    }
    const ratio = getRatio(item, index);
    const placement = {
      item,
      index,
      column,
      ratioAbove: ratioSums[column],
      itemsAbove: rowCounts[column],
    };
    heights[column] += ratio + gap;
    ratioSums[column] += ratio;
    rowCounts[column] += 1;
    return placement;
  });
  return { placements, columnCount: count, ratioSums, rowCounts };
};

export const useMasonryColumns = () => {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up("xl"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  if (xl) return 6;
  if (lg) return 5;
  if (md) return 4;
  if (sm) return 3;
  return 2;
};

const MasonryGrid = ({ items, columns, getRatio, getKey, renderItem, spacing = 2 }) => {
  const theme = useTheme();
  const { placements, columnCount, ratioSums, rowCounts } = layoutMasonry(items, columns, getRatio);
  // Tiles stay in reading order in the DOM (for keyboard and screen readers) and are
  // positioned with container-relative units, so no measuring or resize listeners are needed.
  const gap = theme.spacing(spacing);
  const columnWidth = `((100cqw - ${columnCount - 1} * ${gap}) / ${columnCount})`;
  const columnHeights = ratioSums
    .map((sum, column) =>
      rowCounts[column] ? `${sum} * ${columnWidth} + ${rowCounts[column] - 1} * ${gap}` : "0px",
    )
    .map((height) => `calc(${height})`);

  return (
    <Box sx={{ containerType: "inline-size" }}>
      <Box sx={{ position: "relative", height: `max(${columnHeights.join(", ")})` }}>
        {placements.map(({ item, index, column, ratioAbove, itemsAbove }) => (
          <Box
            key={getKey(item, index)}
            sx={{
              position: "absolute",
              width: `calc(${columnWidth})`,
              left: `calc(${column} * (${columnWidth} + ${gap}))`,
              top: `calc(${ratioAbove} * ${columnWidth} + ${itemsAbove} * ${gap})`,
            }}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MasonryGrid;
