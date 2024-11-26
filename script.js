const walletBalanceElement = document.getElementById('wallet-balance');
const transactionForm = document.getElementById('transaction-form');
const transactionHistory = document.getElementById('transaction-history');
const resetButton = document.createElement('button');

let walletBalance = 0;
let transactions = [];

// Add Reset Button
resetButton.textContent = "Reset by Date";
resetButton.className = "reset-btn";
document.querySelector('.container').appendChild(resetButton);

// Load data from localStorage on page load
window.addEventListener('load', () => {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedTransactions = localStorage.getItem('transactions');

    if (savedBalance) {
        walletBalance = parseFloat(savedBalance);
        walletBalanceElement.textContent = walletBalance.toFixed(2);
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

    // Update wallet balance
    if (type === 'add') {
        walletBalance += amount;
    } else if (type === 'spend') {
        walletBalance -= amount;
    }

    walletBalanceElement.textContent = walletBalance.toFixed(2);

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
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to reset data by date
resetButton.addEventListener('click', () => {
    const dateToReset = prompt("Enter the date to reset (dd/mm/yyyy):");

    if (dateToReset) {
        // Filter out transactions for the given date
        const filteredTransactions = transactions.filter(t => t.date !== dateToReset);
        const removedTransactions = transactions.filter(t => t.date === dateToReset);

        // Update wallet balance
        removedTransactions.forEach(transaction => {
            if (transaction.type === 'add') {
                walletBalance -= transaction.amount;
            } else if (transaction.type === 'spend') {
                walletBalance += transaction.amount;
            }
        });

        transactions = filteredTransactions;

        // Update UI
        transactionHistory.innerHTML = '';
        transactions.forEach(addTransactionToHistory);
        walletBalanceElement.textContent = walletBalance.toFixed(2);

        // Update localStorage
        saveDataToLocalStorage();

        alert(`Transactions for ${dateToReset} have been reset.`);
    } else {
        alert("No date entered. Reset canceled.");
    }
});
