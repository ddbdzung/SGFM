import mongoose from 'mongoose'
import validator from 'validator'

import { role, gender, status } from '../constants/index.mjs'

const viNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ,.'-\s|_]+$/

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Tên không được bỏ trống'],
    trim: true,
    maxLength: [35, 'Tên không được có độ dài quá 35 kí tự'],
    validate: {
      validator: value => viNameRegex.test(value),
      message: () => 'Tên chỉ được chứa kí tự chữ cái thường, hoa và các kí tự ,.\'-_',
    },
  },
  email: {
    type: String,
    required: [true, 'Email không được bỏ trống'],
    trim: true,
    index: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: props => `${props.value} không phải là email hợp lệ`,
    },
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu không được bỏ trống'],
    trim: true,
    minLength: [8, 'Mật khẩu phải chứa ít nhất 8 kí tự'],
    private: true,
  },
  // Used in find account API to send reset pw code by email
  findAccountToken: {
    type: String,
  },
  resetPwCode: {
    type: String,
    length: [6, 'Mã OTP để khôi phục mật khẩu phải chính xác 6 kí tự'],
  },
  resetPwToken: {
    type: String,
  },
  // Unit time: milisecond
  resetPwIssued: {
    type: String,
  },
  // number of request send to server, to limit bruteforce reset password
  resetPwRate: {
    type: Number,
    default: 0,
    min: 0,
    max: [5, 'Giới hạn 5 lần nhập mã sai'],
  },
  // username: Dang Duc Bao Dzung => slug: Dang-Duc-Bao-Dung
  slug: {
    type: String,
    index: true,
  },
  status: {
    type: String,
    default: status.INACTIVE,
    enum: {
      values: Object.values(status),
      message: '{VALUE} không được hỗ trợ',
    },
  },
  // Created when user validates account
  activateToken: {
    type: String,
  },
  address: {
    type: String,
    minLength: [16, 'Địa chỉ phải dài hơn 16 kí tự'],
    maxLength: [255, 'Địa chỉ phải nhỏ hơn 256 kí tự'],
  },
  phoneNumber: {
    type: String,
    maxLength: [11, 'Số điện thoại phải nhỏ hơn 12 kí tự'],
  },
  gender: {
    type: String,
    enum: {
      values: Object.values(gender),
      message: '{VALUE} không được hỗ trợ',
    },
  },
  // Populate to role model by role name
  role: {
    type: String,
    enum: {
      values: role.roleArr,
      message: '{VALUE} không được hỗ trợ',
    },
    default: role.USER,
  },
}, {
  timestamps: true,
  // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toJSON: { virtuals: true },
  // So `console.log()` and other functions that use `toObject()` include virtuals
  toObject: { virtuals: true },
})

/**
 * * Js code
 * `
 *  const x = await User.findById({ _id: '63472aaabb3e2e6764f03f4c' })
      .populate({
        path: 'rolePermissions',
        select: 'permission',
      })
    console.log(x.rolePermissions[0].permission)
  `
 * * Sample of virtual populate one-to-many
 */
userSchema.virtual('rolePermissions', {
  localField: 'role', // userSchema field which is foregin key
  ref: 'Role', // The model to use
  foreignField: 'name', // roleSchema field which is temporary primary key
})

userSchema.methods.rolePopulating = async function (projection) {
  const userPopulate = this.populate({
    path: 'rolePermissions',
    select: projection,
  })
  return userPopulate;
};

userSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug })
}

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email })
}

userSchema.pre('save', async function (next) {
  this.email = validator.normalizeEmail(this.email)
  next()
})

export const User = mongoose.model('User', userSchema)
