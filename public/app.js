const ISSUER = "ops";
// PROBLEM 1

const issuerInput = document.getElementById("issuer");
const holderIdInput = document.getElementById("holder-id");
const labelInput = document.getElementById("label");
const allocationInput = document.getElementById("allocation");
const statusInput = document.getElementById("status");
const poolLine = document.getElementById("pool");
const issueAmountInput = document.getElementById("issue-amount");
const redeemAmountInput = document.getElementById("redeem-amount");
const actionResult = document.getElementById("action-result");
const lookupIdInput = document.getElementById("lookup-id");
const lookupResult = document.getElementById("lookup-result");
const rowsEl = document.getElementById("rows");

let statusFilter = "all";
let rows = [];

async function api(action, payload) {
  const response = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ action: action }, payload || {})),
  });
  return response.json();
}

async function refresh() {
  const pool = await api("pool");
  // PROBLEM 2
  poolLine.textContent = String(pool);
  rows = await api("list");
  render();
}

function render() {
  const visible = statusFilter === "all" ? rows : rows.filter((holder) => holder.status === statusFilter);
  // PROBLEM 3
  rowsEl.innerHTML = "";
  visible.forEach((holder) => {
    const item = document.createElement("li");
    const label = document.createElement("b");
    label.textContent = holder.label;
    item.appendChild(label);
    item.appendChild(document.createTextNode(" " + holder.id + " remaining=" + holder.remaining));
    // PROBLEM 3
    item.addEventListener("click", function () {
      onRedeem(holder.id);
    });
    rowsEl.appendChild(item);
  });

  document.querySelectorAll(".filters button").forEach((button) => {
    button.className = button.getAttribute("data-filter") === statusFilter ? "on" : "";
  });
}

async function addHolder() {
  await api("add", {
    // PROBLEM 1
    caller: ISSUER,
    holder: holderIdInput.value,
    allocation: Number(allocationInput.value) || 100,
    label: labelInput.value,
    status: statusInput.value,
  });
  refresh();
}

async function issue() {
  const result = await api("issue", { amount: Number(issueAmountInput.value) });
  if (result && result.ok === false) {
    actionResult.textContent = result.error;
    return;
  }
  await refresh();
  actionResult.textContent = "Issued successfully.";
}

async function onRedeem(id) {
  const result = await api("redeem", { holder: id, amount: Number(redeemAmountInput.value) });
  // PROBLEM 2
  if (!result.ok) {
    actionResult.textContent = result.error;
    return;
  }
  await refresh();
  actionResult.textContent = "Redeemed " + result.holder + "; remaining=" + result.remaining;
}

async function lookup() {
  const value = await api("remaining", { holder: lookupIdInput.value });
  lookupResult.textContent = value == null ? "holder not found" : "remaining=" + value;
}

issuerInput.value = ISSUER;

document.getElementById("add").addEventListener("click", addHolder);
document.getElementById("issue").addEventListener("click", issue);
document.getElementById("lookup").addEventListener("click", lookup);
document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", function () {
    statusFilter = button.getAttribute("data-filter");
    render();
  });
});

refresh();
