// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login data to the server
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'home.html'; // Redirect to home page
        } else {
            alert('Invalid username or password');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Redirect to Create Account page
document.getElementById('createAccountButton')?.addEventListener('click', function () {
    window.location.href = 'createAccount.html';
});

// Create Account Form Submission
document.getElementById('createAccountForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Send account creation data to the server
    fetch('http://localhost:3000/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created successfully! Redirecting to login page.');
            window.location.href = 'login.html';
        } else {
            alert('Failed to create account: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
