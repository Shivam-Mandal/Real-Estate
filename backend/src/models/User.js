import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin", "vendor"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    wishlist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        default: null,
      },
      planName: {
        type: String,
        default: "",
      },
      listingLimit: {
        type: Number,
        default: 0,
      },
      featuredListingsAllowed: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ["inactive", "active", "expired"],
        default: "inactive",
      },
      startsAt: {
        type: Date,
        default: null,
      },
      endsAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  return rawToken;
};

export const User = mongoose.model("User", userSchema);
