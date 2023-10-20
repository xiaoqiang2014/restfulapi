const bcrypt = require('bcrypt');

password = 'guest';

encrypt = async function() {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
}

encrypt();
