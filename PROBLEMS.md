# Wallet Watchlist problems

These are issues ops hit on the issuance desk: the HTML console and the Node handlers. On this branch the matching spots are tagged in the source. Search for `PROBLEM 1`, `PROBLEM 2`, or `PROBLEM 3`.

Work through them in the code, and make commits with clear messages as you go. You may rewrite the page or the API in the stack you ship with. Keep the desk behavior.

## 1. Anyone can put a holder on the asset (`PROBLEM 1`)

What we need: only the issuer can add a holder, and only with a non-empty holder id. A missing `caller` must not be treated as issuer.

What happens now:
- The Issuer box is editable. Saving it writes that value in the browser and the next Add uses it.
- `addHolder` does not check `caller` against `issuer`. An empty or missing id still lands on the list.
- The handler defaults `caller` to `"ops"`, which is also the registry issuer, so a request with no caller looks authorized.

Where to look:
- `src/registry.js` - `addHolder`
- `src/server.js` - `"add"`
- `public/app.js` - `SESSION_KEY`, `saveIssuer`, `addHolder`
- `public/index.html` - Issuer box

## 2. Issue and redeem do not hold (`PROBLEM 2`)

What we need: amounts must be greater than 0. Issue credits the shared unit pool and the page shows that number. Only a listed holder can redeem, and only up to remaining allocation. A successful redeem cuts both the pool and remaining. Failed redeems should be explicit results, not a crash that is then swallowed.

What happens now:
- `issue` accepts `0`. `redeem` always reports `ok` and does not cut remaining. The pool is decremented, then `row.id` crashes when the holder is missing, then the handler catches the crash and returns `{ ok: false }`.
- The handler turns a missing amount into `0` and still calls issue or redeem.
- The Issued pool line reads remaining for the holder id `pool`, so an issue looks like it did nothing.
- Click a row and the page always tries to redeem `10`. The page refreshes after a failed redeem as if nothing failed.

Where to look:
- `src/registry.js` - `issue`, `redeem`
- `src/server.js` - `"issue"`, `"redeem"`, `toNumber`
- `public/app.js` - `refresh`, `issue`, `onRedeem`

## 3. A missing holder looks like remaining 0, and the list does not filter (`PROBLEM 3`)

What we need: remaining allocation may reach `0` after redeems. That must not look the same as "never listed". Eligible / Restricted / All must change which rows you see. Labels should read as normal text. The holder registry should not be a process-wide list shared across registries.

What happens now:
- `remaining` returns `0` when the holder was never added. Lookup on the page renders that as a real remaining.
- Tapping Eligible or Restricted does not hide any rows.
- Each row shows raw markup (`<b>...`) instead of a bold label.
- `holders` is a module-level array, so every `Registry` instance shares the same rows.

Where to look:
- `src/registry.js` - `holders`, `remaining`
- `src/server.js` - `"remaining"`
- `public/app.js` - `statusFilter`, `render`, `lookup`
