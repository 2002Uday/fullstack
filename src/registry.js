// PROBLEM 3

function findHolder(holderId, holders = []) {
  for (const row of holders) {
    if (row.id === holderId || String(row.id).toLowerCase() === String(holderId).toLowerCase()) {
      return row;
    }
  }
  return null;
}

class Registry {
  constructor(issuer = "admin") {
    this.issuer = issuer;
    this.pool = 0;
    this.holders = [];
  }

  getHolders() {
    return this.holders;
  }

  remaining(holderId) {
    const row = findHolder(holderId, this.holders);
    if (!row) {
      // PROBLEM 3
      return null;
    }
    return row.remaining;
  }

  addHolder(caller, holderId, allocation = 100, label = "", status = "eligible") {
    // PROBLEM 1
    if (caller !== this.issuer || holderId == null || String(holderId).trim() === "") {
      return false;
    }

    this.holders.push({
      id: holderId,
      remaining: allocation,
      label: label || holderId,
      status: status || "eligible",
    });
    console.log("added " + holderId + " by " + caller);
    return true;
  }

  issue(amount) {
    // PROBLEM 2
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: "amount must be greater than 0" };
    }
    this.pool = this.pool + amount;
    return this.pool;
  }

  redeem(holderId, amount) {
    // PROBLEM 2
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: "amount must be greater than 0" };
    }

    const row = findHolder(holderId, this.holders);
    if (!row) {
      return { ok: false, error: "holder not found" };
    }
    if (amount > row.remaining) {
      return { ok: false, error: "amount exceeds remaining allocation" };
    }
    if (amount > this.pool) {
      return { ok: false, error: "amount exceeds issued pool" };
    }

    this.pool = this.pool - amount;
    row.remaining = row.remaining - amount;
    return { ok: true, pool: this.pool, holder: row.id, remaining: row.remaining };
  }
}

module.exports = { Registry, findHolder };
