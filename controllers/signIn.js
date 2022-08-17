const handleSignIn = (req, res, db, bcrypt) => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where({'email':req.body.email })
        .then(data => {
            bcrypt.compare(req.body.password, data[0].hash, function(err, result) {
                if(data.length){
                    if (req.body.email === data[0].email && result){
                        return db.select('*').from('users')
                          .where({'email':req.body.email })
                          .then(user => res.status(200).json(user[0]))
                          .catch(err => res.status(400).json('unable to get user', err))
                    }else{
                        return res.status(400).json('Incorrect email or password');
                    }
                }else{
                    return res.status(400).json('Incorrect email or password');
                }
            }); 
        }) 
        .catch(err => res.status(400).json('Error accesing database'))
}

module.exports = {
    handleSignIn: handleSignIn
};