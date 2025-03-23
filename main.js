const webAppUrl = 'https://script.google.com/macros/s/AKfycbxBwfPjThFNAws4jfM2Puidm66k7blOKnLmO36FspHhNQ8R9iLcWYvjWcaccpHxSy5Jkg/exec'; // Replace with your Web App URL

const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const userList = document.getElementById('user-list');
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-button');

let currentUserId = null; // Store logged-in user's ID

// Function to fetch users and populate the user list
function fetchUsers() {
    fetch(`${webAppUrl}?action=getUsers`)
        .then(response => response.json())
        .then(users => {
            userList.innerHTML = '';
            users.forEach(user => {
                const userButton = document.createElement('button');
                userButton.textContent = user.username;
                userButton.classList.add('btn', 'btn-secondary', 'mr-2');
                userButton.addEventListener('click', () => {
                    // Logic to start a chat with the selected user
                    // You can add logic to filter messages based on users.
                    fetchMessages(); // Refresh messages
                });
                userList.appendChild(userButton);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users. Check console.");
        });
}

// Function to fetch and display messages
function fetchMessages() {
    fetch(`${webAppUrl}?action=getMessages`)
        .then(response => response.json())
        .then(messages => {
            chatWindow.innerHTML = '';
            messages.forEach(message => {
                chatWindow.innerHTML += `<p><strong>${message.users_id}:</strong> ${message.message}</p>`;
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
            alert("Failed to fetch messages. Check console.");
        });
}

// Function to send a message
function sendMessage(message) {
    fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'addMessage', users_id: currentUserId, message: message })
    })
    .then(() => {
        messageInput.value = '';
        fetchMessages();
    })
    .catch(error => {
        console.error("Error sending message:", error);
        alert("Failed to send message. Check console.");
    });
}

// Event listener for login
document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.users_id) {
            currentUserId = data.users_id;
            loginForm.style.display = 'none';
            chatForm.style.display = 'block';
            fetchUsers();
            fetchMessages();
        } else {
            alert('Login failed. Please check your username and password.');
        }
    })
    .catch(error => {
        console.error("Login Error:", error);
        alert('An error occurred during login. Please try again.');
    });
});

// Event listener for sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && currentUserId) {
        sendMessage(message);
    }
});
