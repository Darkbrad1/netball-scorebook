import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The whole scorebook (fixtures, results, teams, notes) is kept as one
// JSON document. It is small, and saving it in one piece keeps the page
// and the database in step.
export default defineSchema({
  scorebook: defineTable({
    key: v.string(),
    data: v.string(),
    rev: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
