import { groupBy, sum } from "ramda";

/** @typedef {import('../models/blog.js').Blog} Blog */

/** @param {Blog[]} blogs */
export const dummy = (blogs) => {
  return 1;
}

/** @param {Blog[]} blogs */
export const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
}

/** @param {Blog[]} blogs */
export const favoriteBlog = (blogs) => {
  return blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best);
}

/** @param {Blog[]} blogs */
export const mostBlogs = (blogs) => {
  const counts = Object.entries(groupBy((blog) => blog.author, blogs))
    .map(([author, items]) => ({ author, blogs: items.length }));
  return counts.reduce((best, entry) => entry.blogs > best.blogs ? entry : best);
}

/** @param {Blog[]} blogs */
export const mostLikes = (blogs) => {
  const likes = Object.entries(groupBy((blog) => blog.author, blogs))
    .map(([author, items]) => ({ author, likes: sum(items.map((i) => i.likes))}));
  return likes.reduce((best, entry) => entry.likes > best.likes ? entry : best);
}