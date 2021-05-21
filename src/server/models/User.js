const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },  
    password: {
        String
    },
    passwordResetToken: {
        type: String,
        default: '',
        select: false,
      },
      passwordResetExpires: {
        type: Date,
        default: Date.now,
        select: false,
      },  
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  });
  

module.exports = mongoose.model('User', UserSchema);

