
const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
        db.transaction(trx => {
            trx('login').insert({
                email: email,
                hash: hash,
            })
            .returning('email')
            .then(loginEmail => {
            return db('users')
                    .returning('*')
                    .insert({ 
                    email: loginEmail[0].email, 
                    name: name,
                    joined: new Date() 
                }).then(user => { 
                    res.status(201).json(user[0]); 
                }).catch(err => {
                    res.status(400).json(err.detail);
                })
            })
            .then(trx.commit) 
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json(err)) 
    })
}

module.exports = {
    handleRegister: handleRegister
};