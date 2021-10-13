const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const nano = require('nanoid/non-secure')
const nanoid = require('nanoid')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    accessToken: {
      type: String,
      required: true,
      default: () => nanoid.nanoid(45)
    },
    address: {
      type: String
    },
    description: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'host', 'admin'],
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
    urlTwitter: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    urlGitHub: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
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
    contracts: {
      type: Array,
      default: []
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

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => err ? cb(err) : cb(null, isMatch))
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)
