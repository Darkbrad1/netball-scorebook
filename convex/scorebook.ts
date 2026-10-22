import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

const KEY = "main";

function checkPasscode(passcode: string) {
  const expected = process.env.EDIT_PASSCODE;
  if (!expected) {
    throw new ConvexError({ code: "no_passcode_set" });
  }
  if (passcode !== expected) {
    throw new ConvexError({ code: "bad_passcode" });
  }
}

// Anyone can read the scorebook.
export const get = query({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("scorebook")
      .withIndex("by_key", (q) => q.eq("key", KEY))
      .unique();
    return doc ? { data: doc.data, rev: doc.rev, updatedAt: doc.updatedAt } : null;
  },
});

// Lets the page check a passcode before it remembers it.
export const checkEditor = mutation({
  args: { passcode: v.string() },
  handler: async (_ctx, { passcode }) => {
    checkPasscode(passcode);
    return true;
  },
});

// Saving needs the editor passcode. baseRev is the version the editor's
// page last saw; if someone else saved in between, nothing is written and
// the page is told so it can load the newer copy.
export const save = mutation({
  args: { passcode: v.string(), data: v.string(), baseRev: v.number() },
  handler: async (ctx, { passcode, data, baseRev }) => {
    checkPasscode(passcode);
    const parsed = JSON.parse(data);
    for (const t of ["fixtures", "results", "teams", "notes"]) {
      if (!Array.isArray(parsed[t])) {
        throw new ConvexError({ code: "bad_data" });
      }
    }
    const doc = await ctx.db
      .query("scorebook")
      .withIndex("by_key", (q) => q.eq("key", KEY))
      .unique();
    const current = doc ? doc.rev : 0;
    if (baseRev !== current) {
      return { ok: false as const, rev: current };
    }
    const rev = current + 1;
    const updatedAt = Date.now();
    if (doc) {
      await ctx.db.patch(doc._id, { data, rev, updatedAt });
    } else {
      await ctx.db.insert("scorebook", { key: KEY, data, rev, updatedAt });
    }
    return { ok: true as const, rev };
  },
});
