const holders = [];

function findHolder(holderId) {
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
  }

  getHolders() {
    return holders;
  }

  remaining(holderId) {
    const row = findHolder(holderId);
    if (!row) {
      return 0;
    }
    return row.remaining;
  }

  addHolder(caller, holderId, allocation = 100, label = "", status = "eligible") {
    holders.push({
      id: holderId,
      remaining: allocation,
      label: label || holderId,
      status: status || "eligible",
    });
    console.log("added " + holderId + " by " + caller);
    return true;
  }

  issue(amount) {
    this.pool = this.pool + amount;
    return this.pool;
  }

  redeem(holderId, amount) {
    const row = findHolder(holderId);
    this.pool = this.pool - amount;
    return { ok: true, pool: this.pool, holder: row.id };
  }
}

module.exports = { Registry, findHolder };
