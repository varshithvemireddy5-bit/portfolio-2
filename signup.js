// signup.js - JavaScript for login and sign-up form validation and handling

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('.signin-btn') || document.querySelector('.login-btn');

    // Check if this is a sign-up page or login page
    const isSignUpPage = document.querySelector('.signin-btn') !== null;

    // Email validation function
    function isValidEmail(email) {
        // For login page, allow the admin email "varshithvemireddy5@gmail.com"
        if (!isSignUpPage && email === 'varshithvemireddy5@gmail.com') {
            return true;
        }
        // Standard email validation for sign-up
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password validation function (minimum 6 characters)
    function isValidPassword(password) {
        return password.length >= 6;
    }

    // Get stored accounts from localStorage
    function getStoredAccounts() {
        try {
            const accounts = localStorage.getItem('userAccounts');
            return accounts ? JSON.parse(accounts) : [];
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return [];
        }
    }

    // Save account to localStorage
    function saveAccount(email, password) {
        try {
            const accounts = getStoredAccounts();
            // Check if account already exists (case-insensitive)
            if (accounts.some(account => account.email.toLowerCase() === email.toLowerCase())) {
                return false; // Account already exists
            }
            accounts.push({ email: email.toLowerCase(), password });
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            return true; // Account created successfully
        } catch (error) {
            console.error('Error saving account:', error);
            return false;
        }
    }

    // Check if login credentials are valid
    function validateLogin(email, password) {
        try {
            const accounts = getStoredAccounts();

            // Check for default admin credentials (case-insensitive)
            if (email.toLowerCase() === 'varshithvemireddy5@gmail.com' && password === '123456') {
                return true;
            }

            // Check against stored user accounts (case-insensitive)
            return accounts.some(account => account.email.toLowerCase() === email.toLowerCase() && account.password === password);
        } catch (error) {
            console.error('Error validating login:', error);
            return false;
        }
    }

    // Show error message
    function showError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and insert error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '10px';
        errorDiv.textContent = message;

        form.appendChild(errorDiv);
    }

    // Show success message
    function showSuccess(message) {
        // Remove existing messages
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();

        // Create and insert success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.color = 'green';
        successDiv.style.fontSize = '14px';
        successDiv.style.marginTop = '10px';
        successDiv.textContent = message;

        form.appendChild(successDiv);
    }

    // Reset button to original state
    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignUpPage ? 'Sign Up' : 'Login';
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate email
        if (!email) {
            showError('Please enter your email address.');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        // Validate password
        if (!password) {
            showError('Please enter your password.');
            passwordInput.focus();
            return;
        }

        if (!isValidPassword(password)) {
            showError('Password must be at least 6 characters long.');
            passwordInput.focus();
            return;
        }

        // Handle sign-up vs login
        if (isSignUpPage) {
            // Sign-up logic
            if (saveAccount(email, password)) {
                showSuccess('Account created successfully! Redirecting to login...');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';

                // Redirect to login page after 2 seconds
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showError('An account with this email already exists.');
                resetButton();
                emailInput.focus();
            }
        } else {
            // Login logic
            if (validateLogin(email, password)) {
                showSuccess('Login successful! Redirecting...');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';

                // Redirect to a dashboard or home page (you can change this URL)
                setTimeout(function() {
                    window.location.href = 'dashboard.html'; // You might want to create this page
                }, 2000);
            } else {
                showError('Invalid email or password.');
                resetButton();
                emailInput.focus();
            }
        }
    });

    // Real-time validation feedback
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = 'red';
        } else if (email && isValidEmail(email)) {
            this.style.borderColor = 'green';
        } else {
            this.style.borderColor = '#ccc';
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = this.value.trim();
        if (password && !isValidPassword(password)) {
            this.style.borderColor = 'red';
        } else if (password && isValidPassword(password)) {
            this.style.borderColor = 'green';
        } else {
            this.style.borderColor = '#ccc';
        }
    });

    // Optional: Add Enter key support for form submission
});