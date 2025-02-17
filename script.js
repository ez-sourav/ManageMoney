const walletBalanceElement = document.getElementById('wallet-balance');
const totalSpentElement = document.getElementById('total-spent');
const transactionForm = document.getElementById('transaction-form');
const transactionHistory = document.getElementById('transaction-history');
const resetButton = document.getElementById('reset-btn');

let walletBalance = 0;
let totalSpent = 0;
let transactions = [];
let pendingTransactions = [];
let reminderInterval;
let transactionAdded = false;

// Load data from localStorage on page load
window.addEventListener('load', () => {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedSpent = localStorage.getItem('totalSpent');
    const savedTransactions = localStorage.getItem('transactions');
    const savedPending = localStorage.getItem('pendingTransactions');

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

    if (savedPending) {
        pendingTransactions = JSON.parse(savedPending);
    }


});

// Add transaction form submission handler
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const note = document.getElementById('note').value;
    const today = new Date();
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
    const date = `${today.toLocaleDateString('en-US', optionsDate)}, ${today.toLocaleTimeString('en-US', optionsTime)}`;

    const transaction = { amount, type, note, date };

    if (navigator.onLine) {
        processTransaction(transaction);
    } else {
        savePendingTransaction(transaction);
        showToast("⚠️ No internet! Transaction saved and will sync when online.", "warning");
    }

    transactionForm.reset();
});

// Process and display a transaction
function processTransaction(transaction) {
    if (transaction.type === 'add') {
        walletBalance += transaction.amount;
    } else if (transaction.type === 'spend') {
        walletBalance -= transaction.amount;
        totalSpent += transaction.amount;
    }

    transactions.push(transaction);
    addTransactionToHistory(transaction);
    saveDataToLocalStorage();
    walletBalanceElement.textContent = walletBalance.toFixed(2);
    totalSpentElement.textContent = `Total Spent: ₹${totalSpent.toFixed(2)}`;
    
    transactionAdded = true;

}

// Add a transaction to the history list
function addTransactionToHistory(transaction) {
    const transactionElement = document.createElement('li');
    transactionElement.className = transaction.type;
    transactionElement.innerHTML = `<strong>${transaction.type === 'add' ? '+' : '-'} ₹${transaction.amount.toFixed(2)}</strong> 
                                    <span>${transaction.note} - ${transaction.date}</span>`;
    transactionHistory.appendChild(transactionElement);
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('walletBalance', walletBalance.toFixed(2));
    localStorage.setItem('totalSpent', totalSpent.toFixed(2));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Save pending transactions when offline
function savePendingTransaction(transaction) {
    pendingTransactions.push(transaction);
    localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions));
}

// Sync offline transactions when back online
function syncOfflineTransactions() {
    if (pendingTransactions.length > 0) {
        pendingTransactions.forEach(transaction => processTransaction(transaction));
        pendingTransactions = [];
        localStorage.removeItem('pendingTransactions');
        showToast("✅ Offline transactions synced successfully!", "success");
    }
}

// Reset all data
resetButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
        walletBalance = 0;
        totalSpent = 0;
        transactions = [];
        pendingTransactions = [];

        walletBalanceElement.textContent = walletBalance.toFixed(2);
        totalSpentElement.textContent = "Total Spent: ₹0.00";
        transactionHistory.innerHTML = '';

        localStorage.clear();
        alert("All data has been reset.");
        
    }
});

// Network status detection and sync
window.addEventListener('online', () => {
    showToast("🌐 Internet reconnected. Syncing offline transactions...", "success");
    syncOfflineTransactions();
});


// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? '#27ae60' : (type === 'warning' ? '#f39c12' : '#e74c3c');
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

// Popup for viewing transaction history
const transactionPopup = document.getElementById("transaction-popup");
const viewHistoryBtn = document.getElementById("view-history-btn");
const closePopup = document.getElementById("close-popup");

viewHistoryBtn.addEventListener("click", () => {
    transactionPopup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
    transactionPopup.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === transactionPopup) {
        transactionPopup.style.display = "none";
    }
});
