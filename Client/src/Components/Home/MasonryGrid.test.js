import { layoutMasonry } from "./MasonryGrid";
import { isWideTile, titlePath } from "./DiscoverWall";

const columnsOf = ({ placements, columnCount }) => {
  const columns = Array.from({ length: columnCount }, () => []);
  placements.forEach(({ index, column }) => columns[column].push(index));
  return columns;
};

test("fills columns left to right while heights are equal", () => {
  expect(columnsOf(layoutMasonry([1, 2, 3], 3, () => 1.5))).toEqual([[0], [1], [2]]);
});

test("places each item in the currently shortest column", () => {
  // Item 1 is short (wide tile), so column 1 receives the next item; ties go left.
  const ratios = [1.5, 0.75, 1.5, 1.5, 1.5];
  const layout = layoutMasonry(ratios, 3, (ratio) => ratio);
  expect(columnsOf(layout)).toEqual([[0, 4], [1, 3], [2]]);
  expect(layout.placements[3]).toMatchObject({ column: 1, ratioAbove: 0.75, itemsAbove: 1 });
  expect(layout.placements[4]).toMatchObject({ column: 0, ratioAbove: 1.5, itemsAbove: 1 });
  expect(layout.ratioSums).toEqual([3, 2.25, 1.5]);
  expect(layout.rowCounts).toEqual([2, 2, 1]);
});

test("keeps placements in item order with every item placed once", () => {
  const items = Array.from({ length: 23 }, (_, i) => i);
  const layout = layoutMasonry(items, 4, (i) => (i % 3 === 1 ? 0.75 : 1.5));
  expect(layout.placements.map(({ index }) => index)).toEqual(items);
  expect(columnsOf(layout).flat().sort((a, b) => a - b)).toEqual(items);
});

test("falls back to a single column for invalid column counts", () => {
  expect(columnsOf(layoutMasonry([1, 2], 0, () => 1))).toEqual([[0, 1]]);
});

test("only uses wide tiles when a backdrop exists", () => {
  expect(isWideTile({ backdrop_path: "/b.jpg" }, 1)).toBe(true);
  expect(isWideTile({ backdrop_path: "/b.jpg" }, 2)).toBe(false);
  expect(isWideTile({ backdrop_path: null }, 1)).toBe(false);
});

test("builds detail links for movies and TV shows", () => {
  expect(titlePath({ id: 5, mediaType: "movie" })).toBe("/movie?id=5");
  expect(titlePath({ id: 7, mediaType: "tv" })).toBe("/tvShow?id=7");
});
