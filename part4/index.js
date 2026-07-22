import mongoose from 'mongoose'
import app from './app.js'
import { PORT, MONGODB_URI } from './utils/config.js'

await mongoose.connect(MONGODB_URI, { family: 4 })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
