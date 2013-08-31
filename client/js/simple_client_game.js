/**
 * User: pahaz
 * Date: 30.08.13
 * Time: 21:06
 */

define(["pyandex/core", 'text!templates/player.html', 'underscore', 'jquery', "pyandex/util", "log"], function (Game, template, _, $, util, log) {
    var render_player_template = _.template(template);
    //render_player_template({player_name:"asdasd", player_card_count:22, player_card_img_src:"img/shrit_card.png"});

    function get_card_image_url(card) {
        var represent_number = ["", "ERROR", '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace', "ERROR"];
        var represent_suit = ["no_card", 'spades', 'clubs', 'diamonds', 'hearts'];
        if (card.number == 0 || card.suit == 0) {
            return -1;
        }

        return 'img/cards/' + represent_number[card.number] + '_of_' + represent_suit[card.suit] + '.png';
    }

    function SimpleGame($game_map, callback_on_game_over) {
        this.$map = $game_map;
        this.callback_on_game_over = callback_on_game_over;
        this.callback_is_called = false;
        $game_map.html("");
        $game_map.hide();
    }

    SimpleGame.prototype.start = function (count_of_players) {
        var game = new Game(count_of_players);
        game.init();

        console.log(game.get_players_pack_of_cards_string_representation_arrays());

        this.game = game;
        this.old_raund_state_array = [0];
        this.need_add_card_on_table = false;
        this.old_round_super_dispute_detected = false;

        this.old_round_players_count_cards_array = [];

        var players_count_cards = this.game.get_players_pack_of_cards_count_array();
        var players_round_cards = this.game.get_players_round_cards_array();
        for (var i = 0; i < count_of_players; i++) {
            var context = {
                player_name: util.generateRandomName() + ' #' + (i + 1),
                player_card_count: players_count_cards[i] - 1,
                player_card_img_src: get_card_image_url(players_round_cards[i])
            };
            this.$map.append(render_player_template(context));
        }

        this.$map.show(1000);
    };

    SimpleGame.prototype.play_round = function () {
        if (!this.game) throw new Error('game not started');

        var players_count_cards = this.game.get_players_pack_of_cards_count_array();
        var players_cards = this.game.get_players_round_cards_array();
        var old_round_state_is_dispute = this.old_raund_state_array[0] == Game.states.dispute_in_round;
        var old_round_state_is_victory = this.old_raund_state_array[0] == Game.states.victory_in_round;
        var old_round_disputers = old_round_state_is_dispute ? this.old_raund_state_array.slice(1) : [];


        var $child = this.$map.children();

        if (this.need_add_card_on_table) {
            log("Current round state DISPUTE ADD CARDS");

            // remove not disputer cards
            // this.$map.find('.one_card').not('.dispute > .one_card').remove();
            // TODO if uncomment: add remove .add_card if in next dispute round player lose

            // display add cards
            for (var i = 1; i < this.old_raund_state_array.length; i++) {
                var player_disputer_index = this.old_raund_state_array[i];

                if (this.old_round_players_count_cards_array[player_disputer_index] >= 2 ||
                    (this.old_round_super_dispute_detected &&
                        this.old_round_players_count_cards_array[player_disputer_index] == 1)) { // 2 = one on table + one for dispute
                    // add imd
                    $child.eq(player_disputer_index).append("<img class=\"add_card\" src=\"img/shrit_card.png\">");
                } else if (this.old_round_players_count_cards_array[player_disputer_index] == 1) {
                    log("Player " + (player_disputer_index + 1) + " lose because can not continue dispute");
                    $child.eq(player_disputer_index).addClass('no_more_card_for_dispute');
                } else {
                    // may be if disputers_not_have_card on disputer
                    if (!this.old_round_super_dispute_detected) {
                        log("<script>alert('REAL BUG DETECTED!');</script>BUG DETECTED!");
                    }
                }

                // fix card player_count_cards
                $child.eq(player_disputer_index).find('.player_card_count').text(players_count_cards[player_disputer_index]);
            }

            this.need_add_card_on_table = false;
            return 1;
        }

        var state_array = this.game.get_round_state_array();
        var state = state_array[0];
        var state_is_dispute = Game.states.dispute_in_round == state;
        var state_is_game_over = state == Game.states.game_over;

        var state_args = state_array.slice(1);

        // log
        var repr_for_states = ["--", "GAME OVER WINN ", "PLAYER WINN ROUND ", "DISPUTE "];
        var end_of_message = _.map(state_args,function (v) {
            return v + 1;
        }).join(' ');
        log("Current round state " + repr_for_states[state] + end_of_message);

        // remove old cards
        this.$map.find('.one_card').not('.no_more_card_for_dispute > .one_card').remove();
        if (old_round_state_is_victory) {
            $('.add_card').remove();
        }

        // show current cards
        var cards_on_table_count = 0;
        for (var i = 0; i < this.game.get_count_players(); i++) {
            var player_count_cards = players_count_cards[i];
            var player_is_disputer = state_is_dispute ? _.indexOf(state_args, i) != -1 : false;
            var player_is_old_round_disputer = old_round_state_is_dispute ? _.indexOf(old_round_disputers, i) != -1 : false;
            var player_card_on_table = players_cards[i].number != 0;

            if (player_card_on_table) {
                cards_on_table_count += 1;
                player_count_cards -= 1; // one card on table
            }

            if (player_count_cards == 0) {
                // if them disputer may be not hide?
                $child.eq(i).fadeOut(1000 + _.random(0, 15000));
            }

            $child.eq(i).find('.player_card_count').text(player_count_cards);

            var img_url = get_card_image_url(players_cards[i]);
            if (img_url != -1) {
                $child.eq(i).append("<img class=\"one_card\" src=\"" + img_url + "\">");
            }
        }

        // remove old states
        $child.removeClass('round_winner').removeClass('dispute');

        // set state
        if (state_is_dispute) {
            for (var i = 0; i < state_args.length; i++) {
                var disputer_index = state_args[i];
                $child.eq(disputer_index).addClass('dispute');
            }

            this.need_add_card_on_table = true;
        } else {
            $child.eq(state_args[0]).addClass('round_winner');
        }

        if (state_is_game_over) {
            if (typeof this.callback_on_game_over === "function" && !this.callback_is_called) {
                var winner = state_array[1];
                this.callback_on_game_over(winner);
                this.callback_is_called = true;
            }
        }

        this.old_raund_state_array = state_array;
        this.old_round_players_count_cards_array = players_count_cards;
        if (cards_on_table_count === 0) {
            log("SUPER DISPUTE DETECTED");
            this.old_round_super_dispute_detected = true;
        } else {
            this.old_round_super_dispute_detected = false;
        }
        this.game.play_round();

        return 0;
    };

    SimpleGame.prototype.start_auto_play_round = function () {
        if (!this.game) throw new Error('game not started');
        var that = this;
        var handler;
        var work = function () {
            var ret = that.play_round();
            if (that.game.game_is_over()) {
                alert("GAME OVER");
                clearInterval(handler);

                // correct if play_round not call
                if (ret != 0) that.play_round();
            }
        };
        handler = setInterval(work, 100);
    };

    return SimpleGame
});