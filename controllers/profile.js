const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'd09adfaf7e3e4f289c8dce4bc6c04507'
   });


const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with API'))
}       


const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({id:id})
        .then(user => {
        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('User not found');
        }
        })
        .catch(err => res.status(400).json('Error getting user'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleImage: handleImage,
    handleApiCall: handleApiCall
};