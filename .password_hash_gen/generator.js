const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const password = process.argv[2];

if (!password) {
    console.log('Please provide a password as a command-line argument.');
    process.exit(1);
}

const saltRounds = 10;

const configFilePath = path.join(__dirname, '../panel.config.ts');

bcrypt.hash(password, saltRounds)
    .then(hash => {
        console.log('Generated bcrypt hash:', hash);

        fs.readFile(configFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the config file:', err);
                process.exit(1);
            }

            const passwordHashRegex = /password_hash:\s*"[^"]*"/;

            const updatedData = data.replace(passwordHashRegex, `password_hash: "${hash}"`) || data.replace(/(password_hash:\s*".*")/, `password_hash: "${hash}"`);

            fs.writeFile(configFilePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the config file:', err);
                    process.exit(1);
                }

                console.log('Updated the password hash in panel.config.ts');
            });
        });
    })
    .catch(err => {
        console.error('Error generating hash:', err);
    });
