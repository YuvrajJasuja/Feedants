const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    profileImage: {
      type: String,
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
