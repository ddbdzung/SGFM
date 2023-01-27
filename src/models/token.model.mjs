import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Chuỗi token không được bỏ trống'],
    index: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'user id không được bỏ trống'],
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export const Token = mongoose.model('Token', tokenSchema)
