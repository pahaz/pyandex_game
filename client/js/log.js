/**
 * User: pahaz
 * Date: 30.08.13
 * Time: 2:50
 */

define(['jquery'], function ($) {
    return function (msg) {
        $('#log').append(msg + "<br>").scrollTop(100000);
    }
});