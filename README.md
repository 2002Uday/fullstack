# Wallet Watchlist

Issuance desk for a tokenized fund share class. HTML console and a Node HTTP API.

We have turned several problems we face in practice into a problem review so we can see how you think. Please download the project, check out the `problems` branch, open `PROBLEMS.md`, and make commits with clear messages as you work through them.

You may rewrite the page or the API in the stack you ship with. Keep the desk behavior. We care about how you work through the problems, not whether you stay in these files.

In the meeting, walk us through your approach, including your assumptions, tradeoffs, and the solution you would choose.

## Start here

You are on **`main`**.

**Check out `problems` for the current problem list:**

```bash
git checkout problems
```

Then open **`PROBLEMS.md`**.

## Run

```bash
node src/server.js
```

Open `http://127.0.0.1:3000`.

## What is in the codebase

- `public/index.html` - desk page
- `public/app.js` - console behavior
- `public/app.css` - layout
- `src/registry.js` - holders, remaining allocation, issue and redeem
- `src/server.js` - HTTP API and static files
