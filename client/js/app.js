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
        underscore: '../../client/bower_components/underscore-amd/underscore'
    }
});

require(["pyandex/core", 'log'], function(Game, log) {
    var game = new Game();
    log(game.name);
});
