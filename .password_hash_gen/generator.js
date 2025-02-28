const bcrypt = require('bcryptjs');

// Get the password from the command-line arguments
const password = process.argv[2];

if (!password) {
    console.log('Please provide a password as a command-line argument.');
    process.exit(1);  // Exit the program if no password is provided
}

const saltRounds = 10;

// Generate bcrypt hash asynchronously
bcrypt.hash(password, saltRounds)
    .then(hash => {
        console.log('Generated bcrypt hash:', hash);
    })
    .catch(err => {
        console.error('Error generating hash:', err);
    });
