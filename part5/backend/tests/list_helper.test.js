import { describe, test } from "node:test";
import assert from "node:assert";

import * as listHelper from "../utils/list_helper.js";

let idCounter = 0;
const makeBlog = (overrides = {}) => ({
  _id: `${++idCounter}`,
  title: "Test title",
  author: "Test author",
  url: "https://example.com",
  likes: 0,
  __v: 0,
  ...overrides,
});
const makeBlogs = (specs) => specs.map(makeBlog);

test("dummy returns one", () => {
  assert.strictEqual(listHelper.dummy([]), 1);
});

describe("totalLikes", () => {
  test("of an empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("of list with only one blog equals the likes of that", () => {
    assert.strictEqual(listHelper.totalLikes([makeBlog({ likes: 7 })]), 7);
  });

  test("of many blogs is their sum", () => {
    const blogs = makeBlogs([{ likes: 7 }, { likes: 5 }, { likes: 12 }]);
    assert.strictEqual(listHelper.totalLikes(blogs), 24);
  });
});

describe("favoriteBlog", () => {
  test("returns the blog with most likes", () => {
    const blogs = makeBlogs([
      { title: "A", likes: 3 },
      { title: "B", likes: 12 },
      { title: "C", likes: 7 },
    ]);
    const bestBlog = makeBlog({ title: "D", likes: 15 });
    assert.deepStrictEqual(listHelper.favoriteBlog([bestBlog, ...blogs]), bestBlog);
  });

  test("returns the only blog when list has one entry", () => {
    const only = makeBlog({ title: "Only", likes: 1 });
    assert.deepStrictEqual(listHelper.favoriteBlog([only]), only);
  });
});

describe("mostBlogs", () => {
  test("returns author with the most blog posts", () => {
    const blogs = makeBlogs([
      { author: "Maija" },
      { author: "Maija" },
      { author: "Maija" },
      { author: "Matti" },
      { author: "Matti" },
    ]);
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: "Maija", blogs: 3 });
  });
});

describe("mostLikes", () => {
  test("returns author with the highest total likes", () => {
    const blogs = makeBlogs([
      { author: "Maija", likes: 2 },
      { author: "Matti", likes: 10 },
      { author: "Maija", likes: 5 },
      { author: "Matti", likes: 1 },
      { author: "Maija", likes: 4 },
    ]);
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Maija", likes: 11 });
  });
});
