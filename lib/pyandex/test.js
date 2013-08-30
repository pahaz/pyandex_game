/**
 * User: pahaz
 * Date: 30.08.13
 * Time: 13:13
 */

define(['pyandex/core', 'underscore'], function (Game, _) {
    function ok(a1, a2, msg_if_error, not_log) {
        var status_ok = false;
        if (_.isObject(a1) && _.isObject(a2)) {
            if (_.isEqual(a1, a2)) {
                status_ok = true;
            }
        } else {
            status_ok = !_.isObject(a1) && !_.isObject(a2) && a1 === a2;
        }

        if (status_ok) {
            //if (!not_log) console.log(' [OK]');
        } else {
            if (!not_log) {
                console.log(' [ERROR] ' + msg_if_error);
                console.log(a1);
                console.log(a2);
                console.log('-------');
            }
        }
        return status_ok;
    }

    function log(msg) {
        console.log(msg);
    }

    function test() {
        var game = new Game(4);
        game.init();

        var res, res_template;

        ok(game.name, "pyandex", "pyandex name error.");

        var cards = Game.create_pack_of_cards_array();
        var strings_cards = _.map(cards, function (obj) {
            return obj.get_card_string_representation();
        });
        res = [ '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠',
            '10♠', 'J♠', 'Q♠', 'K♠', 'A♠', '2♣', '3♣', '4♣',
            '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣',
            'K♣', 'A♣', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦',
            '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦', '2♥',
            '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥',
            'J♥', 'Q♥', 'K♥', 'A♥' ];
        ok(strings_cards, res, "invalid Game.create_pack_of_cards_array() string representation");

        var a = [
            [
                { number: 9, suit: 2 },
                { number: 14, suit: 2 },
                { number: 4, suit: 1 },
                { number: 11, suit: 4 },
                { number: 5, suit: 4 },
                { number: 9, suit: 1 },
                { number: 5, suit: 2 },
                { number: 9, suit: 3 },
                { number: 12, suit: 3 },
                { number: 14, suit: 4 },
                { number: 5, suit: 3 },
                { number: 2, suit: 1 },
                { number: 6, suit: 2 }
            ],
            [
                { number: 2, suit: 2 },
                { number: 2, suit: 3 },
                { number: 9, suit: 4 },
                { number: 13, suit: 1 },
                { number: 12, suit: 4 },
                { number: 8, suit: 1 },
                { number: 4, suit: 2 },
                { number: 7, suit: 3 },
                { number: 10, suit: 2 },
                { number: 7, suit: 4 },
                { number: 7, suit: 1 },
                { number: 6, suit: 3 },
                { number: 13, suit: 3 }
            ],
            [
                { number: 13, suit: 4 },
                { number: 8, suit: 2 },
                { number: 10, suit: 3 },
                { number: 6, suit: 1 },
                { number: 8, suit: 4 },
                { number: 2, suit: 4 },
                { number: 4, suit: 3 },
                { number: 12, suit: 1 },
                { number: 6, suit: 4 },
                { number: 3, suit: 4 },
                { number: 5, suit: 1 },
                { number: 7, suit: 2 },
                { number: 4, suit: 4 }
            ],
            [
                { number: 3, suit: 1 },
                { number: 11, suit: 2 },
                { number: 13, suit: 2 },
                { number: 11, suit: 3 },
                { number: 10, suit: 4 },
                { number: 12, suit: 2 },
                { number: 3, suit: 2 },
                { number: 14, suit: 3 },
                { number: 3, suit: 3 },
                { number: 14, suit: 1 },
                { number: 8, suit: 3 },
                { number: 11, suit: 1 },
                { number: 10, suit: 1 }
            ]
        ];
        var a_str = [ '9♣ A♣ 4♠ J♥ 5♥ 9♠ 5♣ 9♦ Q♦ A♥ 5♦ 2♠ 6♣',
            '2♣ 2♦ 9♥ K♠ Q♥ 8♠ 4♣ 7♦ 10♣ 7♥ 7♠ 6♦ K♦',
            'K♥ 8♣ 10♦ 6♠ 8♥ 2♥ 4♦ Q♠ 6♥ 3♥ 5♠ 7♣ 4♥',
            '3♠ J♣ K♣ J♦ 10♥ Q♣ 3♣ A♦ 3♦ A♠ 8♦ J♠ 10♠' ];
        game._players_cards_arrays = a;

        var round_card_numbers = game.get_playing_round_card_numbers();
        ok(round_card_numbers, [9, 2, 13, 3], 'invalid round_card_numbers()');

        var state_array = game.get_round_state_array();
        ok(state_array, [2, 2], 'invalid get_round_state_array()');

        game.play_round();
        ok(game.get_playing_round_card_numbers(true), [ 6, 13, 3, 10 ], 'play_round() last player cards array bug');
        ok(game.get_playing_round_card_numbers(), [ 14, 2, 8, 11 ], 'play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [0, 1, 2, 3], 'play_round() next round player bug');
        ok(game.get_round_dispute_cards_array(), [], 'play_round() dispute cards bug');

        var C = function (a, b) {
            return new Game.Card(a, b)
        };
        a = [
            [C(3, 1), C(2, 2), C(3, 3), C(10, 2), C(12, 1), C(4, 3)],
            [C(3, 1), C(2, 2), C(3, 3), C(10, 2), C(13, 1), C(13, 2)],
            [C(3, 1), C(2, 2), C(2, 3), C(11, 2)],
            [C(2, 1), C(2, 2)]
        ];
        game = new Game(4);
        game.init();
        game._players_cards_arrays = a;
        var states = [Game.states.dispute_in_round, Game.states.dispute_in_round, Game.states.victory_in_round, Game.states.game_over];

        res = a;
        ok(game.get_players_pack_of_cards_arrays(), res, 'begin round play_round() players pack of cards arrays bug');
        res = [];
        ok(game.get_round_dispute_cards_array(), res, 'begin round play_round() dispute cards bug');

        ok(game.get_game_winner_index(), -1, 'begin round get_game_winner_index() != -1 on 3 player dispute');
        ok(game.get_round_winner_array(), [0, 1, 2], 'begin round get_round_winner_array() bug on 3 player dispute');
        ok(game.get_round_state_array(), [Game.states.dispute_in_round, 0, 1, 2], 'begin round get_round_state_array() bug');
        ok(game.get_playing_round_card_numbers(true, true), [ 4, 13, 11, 2], 'begin round play_round() last player cards array bug #1');
        ok(game.get_playing_round_card_numbers(), [ 3, 3, 3, 2], 'begin round play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [0, 1, 2, 3], 'begin round play_round() next round player bug');

        game.play_round();
        res = [C(3, 1), C(3, 1), C(3, 1), C(2, 1), C(2, 2), C(2, 2), C(2, 2)];
        ok(game.get_round_dispute_cards_array(), res, '1th round play_round() dispute cards bug');
        res = [
            [C(3, 3), C(10, 2), C(12, 1), C(4, 3)],
            [C(3, 3), C(10, 2), C(13, 1), C(13, 2)],
            [C(2, 3), C(11, 2)],
            [C(2, 2)]
        ];
        ok(game.get_players_pack_of_cards_arrays(), res, '1th round play_round() players pack of cards arrays bug');
        ok(game.get_game_winner_index(), -1, '1th round get_game_winner_index() != -1');
        ok(game.get_round_winner_array(), [0, 1], '1th round get_round_winner_array() bug on 3 player dispute');
        ok(game.get_round_state_array(), [Game.states.dispute_in_round, 0, 1], '1th round get_round_state_array() bug');
        ok(game.get_playing_round_card_numbers(true, true), [ 4, 13, 11, 2], '1th round play_round() last player cards array bug #1');
        ok(game.get_playing_round_card_numbers(), [ 3, 3, 2, 0], '1th round play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [0, 1, 2], '1th round play_round() next round player bug');

        game.play_round();
        res = [C(3, 1), C(3, 1), C(3, 1), C(2, 1), C(2, 2), C(2, 2), C(2, 2), C(3, 3), C(3, 3), C(2, 3), C(10, 2), C(10, 2)];
        ok(game.get_round_dispute_cards_array(), res, '2th round play_round() dispute cards bug');
        res = [
            [C(12, 1), C(4, 3)],
            [C(13, 1), C(13, 2)],
            [C(11, 2)],
            [C(2, 2)]
        ];
        ok(game.get_players_pack_of_cards_arrays(), res, '2th round play_round() players pack of cards arrays bug');
        ok(game.get_game_winner_index(), -1, '2th round get_game_winner_index() != -1');
        ok(game.get_round_winner_array(), [1], '2th round get_round_winner_array() bug on 3 player dispute');
        ok(game.get_round_state_array(), [Game.states.victory_in_round, 1], '2th round get_round_state_array() bug');
        ok(game.get_playing_round_card_numbers(true, true), [ 4, 13, 11, 2], '2th round play_round() last player cards array bug #1');
        ok(game.get_playing_round_card_numbers(), [12, 13, 0, 0], '2th round play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [0, 1], '2th round play_round() next round player bug');

        game.play_round();
        res = [];
        ok(game.get_round_dispute_cards_array(), res, '3th round play_round() dispute cards bug');
        res = [
            [C(4, 3)],
            [C(13, 2), C(3, 1), C(3, 1), C(3, 1), C(2, 1), C(2, 2), C(2, 2), C(2, 2), C(3, 3), C(3, 3), C(2, 3), C(10, 2), C(10, 2),
                C(12, 1), C(13, 1)],
            [C(11, 2)],
            [C(2, 2)]
        ];
        ok(game.get_players_pack_of_cards_arrays(), res, '3th round play_round() players pack of cards arrays bug');
        ok(game.get_game_winner_index(), -1, '3th round get_game_winner_index() != -1');
        ok(game.get_round_winner_array(), [1], '3th round get_round_winner_array() bug on 3 player dispute');
        ok(game.get_round_state_array(), [Game.states.victory_in_round, 1], '3th round get_round_state_array() bug');
        ok(game.get_playing_round_card_numbers(true, true), [ 4, 13, 11, 2], '3th round play_round() last player cards array bug #1');
        ok(game.get_playing_round_card_numbers(), [4, 13, 11, 2], '3th round play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [0, 1, 2, 3], '3th round play_round() next round player bug');

        game.play_round();
        res = [];
        ok(game.get_round_dispute_cards_array(), res, '4th round play_round() dispute cards bug');
        res = [
            [],
            [C(3, 1), C(3, 1), C(3, 1), C(2, 1), C(2, 2), C(2, 2), C(2, 2), C(3, 3), C(3, 3), C(2, 3), C(10, 2), C(10, 2),
                C(12, 1), C(13, 1),
                C(4, 3), C(13, 2), C(11, 2),C(2, 2)
            ],
            [],
            []
        ];
        ok(game.get_players_pack_of_cards_arrays(), res, '4th round play_round() players pack of cards arrays bug');
        ok(game.get_game_winner_index(), 1, '4th round get_game_winner_index() bug');
        ok(game.get_round_winner_array(), [1], '4th round get_round_winner_array() bug');
        ok(game.get_round_state_array(), [Game.states.game_over, 1], '4th round get_round_state_array() bug');
        ok(game.get_playing_round_card_numbers(true, true), [ 0, 2, 0, 0], '4th round play_round() last player cards array bug #1');
        ok(game.get_playing_round_card_numbers(), [0, 3, 0, 0], '4th round play_round() first player cards array bug');
        ok(game.get_round_playing_player_indexes_array(), [1], '4th round play_round() next round player bug');
    }

    return test;
});