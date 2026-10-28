# Netball Scorebook 2026

Fixtures, scores, standings and umpires for the 2026 D Sports Shop Inter-Secondary Schools Netball Tournament (Eastern and Western zones, junior and senior divisions).

## What it does

- Lists all 97 zone fixtures by date, with scores, venues and umpires
- Tap a match to add or change its score, mark it postponed, or edit its details
- Standings for each zone and division, with charts of games won and goal difference
- Enter the teams, the score and the umpires together in one match form. A team or umpire that isn't on the list yet is added when you save the match
- Teams (with full school names), umpires (with optional phone and notes) and notes screens. Umpires can also be added on their own, before they have a match
- Save a copy as an Excel workbook or a PDF, including any changes

## Using it

Open `index.html` in a web browser, or visit the GitHub Pages address for this repository.

If the shared scorebook is set up (see below), everyone sees the same scores, and changes appear on every open page straight away. Anyone can view. To change anything you need the editor passcode: tap **Sign in to edit** in the menu. If you are not signed in when you save a change, the page asks for the passcode, and the change is undone if you cancel.

If the shared scorebook is not set up, changes are saved only in the browser you make them in. To share updated scores, use **Excel** or **PDF** at the top of the page and send the file.

## Setting up the shared scorebook (Convex)

The page is still hosted on GitHub Pages. The data lives in [Convex](https://convex.dev), and the page talks to it from the browser.

1. Create a free account at convex.dev.
2. On your computer, in this folder, run `npm install`, then `npx convex dev`. Sign in when asked and create a new project. This uploads the functions in `convex/` and prints your deployment address (it looks like `https://happy-otter-123.convex.cloud`). You can stop it with Ctrl+C once it says the functions are ready.
3. In the Convex dashboard, open your project's **Settings → Environment Variables** and add `EDIT_PASSCODE` with the passcode editors will use. Do this for the production deployment too.
4. Run `npx convex deploy` to set up the production deployment, and copy its address from the dashboard.
5. In `index.html`, search for `const CONVEX_URL=''` and paste the production address between the quotes. Commit and push to `main`.
6. Open the site, tap **Sign in to edit** and type the passcode. The first editor to sign in uploads their copy of the scorebook, including any changes saved in their browser, to fill the empty database.

To deploy changes to `convex/` automatically, create a production deploy key in the Convex dashboard (**Settings → Deploy Keys**) and add it to this repository on GitHub as an Actions secret named `CONVEX_DEPLOY_KEY`. The **Deploy Convex functions** workflow then runs whenever `convex/` changes on `main`.

To change the passcode, change `EDIT_PASSCODE` in the Convex dashboard. Editors are signed out the next time they save and need to sign in with the new one.

### How the data is stored

The whole scorebook is one document in the `scorebook` table. Every save sends the full copy along with the version it started from. If someone else saved in between, nothing is overwritten: the page loads the newer copy and asks you to make your last change again.

The page also keeps the latest copy in the browser, so it opens quickly and can still be read without a connection. Changes need a connection to save.

## Updating the fixtures for everyone

The original fixtures and scores are stored inside `index.html` (search for `const DATA=`). With the shared scorebook set up, editors can change everything on the page itself. **Reset to the original lists** (shown to editors) puts these original lists back for everyone.

Without the shared scorebook, changes made on the page stay in that one browser, so to change what every visitor sees, edit the data in `index.html` and commit it.

## Ranking

The official points system is not on the printed sheets, so standings are ranked by games won, then goal difference, then goals scored.
