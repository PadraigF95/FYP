var mongoose = require('mongoose');




var gamesSchema = new mongoose.Schema({
    name: String
});



module.exports = mongoose.model('games', gamesSchema);

