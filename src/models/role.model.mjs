import mongoose from 'mongoose'
import { permissionArray } from '../config/permissions.mjs'

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên vai trò không được bỏ trống'],
    trim: true,
    index: {
      unique: true,
    },
  },
  permission: {
    type: [String],
    enum: permissionArray,
    default: [],
  },
}, {
  timestamps: true,
})

export const Role = mongoose.model('Role', roleSchema)
