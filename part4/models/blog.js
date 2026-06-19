import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

/** @typedef {mongoose.InferSchemaType<typeof blogSchema>} Blog */
export const Blog = mongoose.model('Blog', blogSchema)
