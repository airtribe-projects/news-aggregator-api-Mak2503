const mongoose = require("mongoose");

const CATEGORY_ENUM = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "world",
  "politics",
  "finance",
  "travel",
  "lifestyle",
  "culture",
  "opinion",
];

const SOURCE_ENUM = [
  "abc-news",
  "abc-news-au",
  "aftenposten",
  "al-jazeera-english",
  "ansa",
  "argaam",
  "ars-technica",
  "ary-news",
  "associated-press",
]

// --- MONGODB SCHEMA (for database operations) ---
const userPreferencesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    categories: {
      type: [String],
      default: ["general"],
      enum: CATEGORY_ENUM,
    },
    sources: {
      type: [String],
      default: ["bbc-news"],
      enum: SOURCE_ENUM,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

module.exports = mongoose.model("UserPreference", userPreferencesSchema);
