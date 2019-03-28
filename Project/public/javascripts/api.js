var express = require('express');
var router = express.Router();
var request = require('request');

var options = {

    url: 'https://api-v3.igdb.com/games1/?fields=aggregated_rating,name,cover.url,genres.name,total_rating,videos.name; sort popularity desc' ,
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",

};
request(options, (error, response) => {
    if (error) {
        res.sendStatus(504);
    } else {
        let games = JSON.parse(response.body);

    }
});

module.exports = router;