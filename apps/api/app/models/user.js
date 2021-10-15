/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-invalid-this */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const nano = require('nanoid/non-secure')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'O']
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    document: {
      type: String
    },
    avatar: {
      type: String,
      lowercase: true
    },
    video: {
      type: String,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
      default: 'enabled'
    },
    birthDate: {
      type: Date
    },
    password: {
      type: String,
      required: true,
      default: () => nano.customAlphabet('AB1234567890', 8)()
    },
    address: {
      type: String
    },
    description: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'host', 'admin'], // host anfitrion o persona que esta ofertando el tour
      default: 'user'
    },
    referredCode: {
      type: String,
      unique: true,
      required: true,
      default: () => nano.customAlphabet('MO1234567890', 8)()
    },
    verification: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Object
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    position: {
      type: String
    },
    typeReferred: {
      type: mongoose.Types.ObjectId
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
    accountStripe: {
      type: String
    },
    accessToken: {
      type: String,
      required: true
    },
    isAgency: {
      type: Boolean,
      required: true,
      default: false
    },
    isAgent: {
      type: Boolean
    },
    customData: {
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.post('findOneAndUpdate', async () => { })

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
UserSchema.plugin(mongoosePaginate)
UserSchema.plugin(aggregatePaginate)
UserSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('User', UserSchema)
