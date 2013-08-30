/**
 * User: pahaz
 * Date: 29.08.13
 * Time: 21:37
 */

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        pyandex: '../../lib/pyandex',
        underscore: '../../client/bower_components/underscore-amd/underscore',
        jquery: '../../client/bower_components/jquery/jquery',
        text: '../../client/bower_components/requirejs-text/text',
    }
});

require(["simple_client_game", 'log', 'pyandex/test', 'underscore', 'jquery'], function (SimpleGame, log, test, _, $) {
    test();

    var $game_map = $('#game_map');
    var $game_begin_form = $('#game_begin_form');
    var $game_control_form = $('#game_control_form');
    var game = new SimpleGame($game_map, function(winnder) {alert("ВЫИГРАЛ #" + (winnder+1));});

    $game_map.hide();
    $game_control_form.hide();

    $game_begin_form.find('button').one("click", function (event) {
        event.preventDefault();
        var count_of_players = +$game_begin_form.find('input:radio:checked').val();
        $game_begin_form.hide();
        $game_control_form.show();
        log("PYANdex start for " + count_of_players + " users");

        game.start(count_of_players);
    });

    var $fast_button = $game_control_form.find('#fast_game');
    var $next_round = $game_control_form.find('#next_round');
    $fast_button.one("click", function (event) {
        event.preventDefault();
        $fast_button.attr("disabled", "disabled");
        $next_round.unbind('click');
        $next_round.attr("disabled", "disabled");

        game.start_auto_play_round();
    });
    $next_round.click(function(){
        event.preventDefault();

        game.play_round();
    });

    log("PYANdex loaded");
});
