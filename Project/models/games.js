var mongoose = require('mongoose');
var GamesSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    system:{


        type: String,
        unique: true,
        required: true,
        trim: true
    },
    release:{

        type: String,
        unique: true,
        required: true,
        trim: true
    },
    developer:{


        type: String,
        unique: true,
        required: true,
        trim: true
    },

    score:{

        type: int,
        unique: true,
        required: true,
        trim: true
    },

    genre:{

        type: String,
        unique: true,
        required: true,
        trim: true
    }





});









var Games = mongoose.model('Games', GamesSchema);
module.exports = Games;