import mongoose from 'mongoose'

export const PORT = process.env.PORT || 3000
export const MONGODB_URI = process.env.MONGODB_URI || ''
export const connection = await mongoose.connect(MONGODB_URI, { family: 4 })
