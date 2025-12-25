let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const expenseList = document.getElementById("expenseList");
const balanceEl = document.getElementById("balance");
const addBtn = document.getElementById("addBtn");
const chartWrapper = document.getElementById("chartWrapper");

addBtn.addEventListener("click", addExpense);

function addExpense() {
    const title = titleInput.value.trim();
    const amount = amountInput.value;

    if (title === "" || amount === "") {
        alert("Please fill all fields");
        return;
    }

    expenses.push({
        id: Date.now(),
        title,
        amount: Number(amount),
        type: typeInput.value,
        time: new Date().toLocaleString()
    });

    titleInput.value = "";
    amountInput.value = "";

    saveAndRender();
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveAndRender();
}

function renderExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(e => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${e.title}</td>
            <td>₹${e.amount}</td>
            <td class="${e.type}">${e.type}</td>
            <td>${e.time}</td>
            <td class="action-cell">
                <span class="delete-icon" onclick="deleteExpense(${e.id})" title="Delete">
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M6 6l1 14h10l1-14" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                    </svg>
                </span>
             </td>

        `;
        expenseList.appendChild(row);
    });
}

function calculateBalance() {
    let balance = 0;

    expenses.forEach(e => {
        balance += e.type === "income" ? e.amount : -e.amount;
    });

    balanceEl.textContent = balance;
}

function renderChart() {
    const incomeTotal = expenses
        .filter(e => e.type === "income")
        .reduce((s, e) => s + e.amount, 0);

    const expenseTotal = expenses
        .filter(e => e.type === "expense")
        .reduce((s, e) => s + e.amount, 0);

    if (incomeTotal === 0 && expenseTotal === 0) {
        chartWrapper.style.display = "none";
        return;
    }

    chartWrapper.style.display = "block";

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [incomeTotal, expenseTotal],
                backgroundColor: ["#10B981", "#F43F5E"]
            }]
        },
        options: {
            responsive: true,
            cutout: "65%",  
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }

    });
}

function saveAndRender() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    calculateBalance();
    renderChart();
}

renderExpenses();
calculateBalance();
renderChart();
