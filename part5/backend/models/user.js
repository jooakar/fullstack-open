import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
})

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  },
})

/** @typedef {mongoose.InferSchemaType<typeof userSchema> & { id: string }} User */
export const User = mongoose.model('User', userSchema)
