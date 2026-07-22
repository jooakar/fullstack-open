export const PORT = process.env.PORT || 3000

export const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

export const SECRET = process.env.SECRET
