$(document).ready(function(){

    $('form').on('submit', function(){

        var game = $('form input');
        var favourites = {game: game.val()};

        $.ajax({
            type: 'POST',
            url: '/favourites',
            data: favourites,
            success: function(data){
                //do something with the data via front-end framework
                location.reload();
            }
        });

        return false;

    });

    $('li').on('click', function(){
        var game = $(this).text().trim(/ /g, "-");
        $.ajax({
            type: 'DELETE',
            url: '/favourites/' + game,
            success: function(data){
                //do something with the data via front-end framework
                location.reload();
            }
        });
    });

});

