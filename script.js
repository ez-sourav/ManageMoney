
const walletBalanceElement = document.getElementById('wallet-balance');
const totalSpentElement = document.getElementById('total-spent');
const transactionForm = document.getElementById('transaction-form');
const transactionHistory = document.getElementById('transaction-history');
const resetButton = document.getElementById('reset-btn');

let walletBalance = 0;
let totalSpent = 0;
let transactions = [];

// Load data from localStorage on page load
window.addEventListener('load', () => {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedSpent = localStorage.getItem('totalSpent');
    const savedTransactions = localStorage.getItem('transactions');

    if (savedBalance) {
        walletBalance = parseFloat(savedBalance);
        walletBalanceElement.textContent = walletBalance.toFixed(2);
    }

    if (savedSpent) {
        totalSpent = parseFloat(savedSpent);
        totalSpentElement.textContent = `Total Spent: ₹${totalSpent.toFixed(2)}`;
    }

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        transactions.forEach(addTransactionToHistory);
    }
});

// Add transaction form submission handler
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const note = document.getElementById('note').value;

    // Format the date as dd/mm/yyyy
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    // Update wallet balance and total spent
    if (type === 'add') {
        walletBalance += amount;
    } else if (type === 'spend') {
        walletBalance -= amount;
        totalSpent += amount; // Add to total spent
    }

    walletBalanceElement.textContent = walletBalance.toFixed(2);
    totalSpentElement.textContent = `Total Spent: ₹${totalSpent.toFixed(2)}`;

    // Save transaction to the history
    const transaction = { amount, type, note, date };
    transactions.push(transaction);

    // Update UI and localStorage
    addTransactionToHistory(transaction);
    saveDataToLocalStorage();

    transactionForm.reset();
});

// Function to add a transaction to the history list
function addTransactionToHistory(transaction) {
    const transactionElement = document.createElement('li');
    transactionElement.className = transaction.type;
    transactionElement.innerHTML = `<strong>${transaction.type === 'add' ? '+' : '-'} ₹${transaction.amount.toFixed(2)}</strong> 
                                    <span>${transaction.note} - ${transaction.date}</span>`;
    transactionHistory.appendChild(transactionElement);
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('walletBalance', walletBalance.toFixed(2));
    localStorage.setItem('totalSpent', totalSpent.toFixed(2));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to reset all data
resetButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
        walletBalance = 0;
        totalSpent = 0;
        transactions = [];

        walletBalanceElement.textContent = walletBalance.toFixed(2);
        totalSpentElement.textContent = "Total Spent: ₹0.00";
        transactionHistory.innerHTML = '';

        localStorage.removeItem('walletBalance');
        localStorage.removeItem('totalSpent');
        localStorage.removeItem('transactions');

        alert("All data has been reset.");
    }
});

// DOM Elements
const transactionPopup = document.getElementById("transaction-popup");
const viewHistoryBtn = document.getElementById("view-history-btn");
const closePopup = document.getElementById("close-popup");

// Show the popup
viewHistoryBtn.addEventListener("click", () => {
    transactionPopup.style.display = "flex";
});

// Close the popup
closePopup.addEventListener("click", () => {
    transactionPopup.style.display = "none";
});

// Close the popup when clicking outside the content
window.addEventListener("click", (event) => {
    if (event.target === transactionPopup) {
        transactionPopup.style.display = "none";
    }
});
