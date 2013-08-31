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
        $game_map.html("");
        $game_map.hide();
    }

    SimpleGame.prototype.start = function (count_of_players) {
        var game = new Game(count_of_players);
        game.init();

        console.log(game.get_players_pack_of_cards_string_representation_arrays());

        this.game = game;
        this.raund_state_array = [0];
        this.need_add_card = false;

        var players_count_cards = this.game.get_players_pack_of_cards_count_array();
        var players_round_cards = this.game.get_players_round_cards_array();
        for (var i = 0; i < count_of_players; i++) {
            var context = {
                player_name: util.generateRandomName(3, 10) + ' #' + (i + 1),
                player_card_count: players_count_cards[i],
                player_card_img_src: get_card_image_url(players_round_cards[i])
            };
            this.$map.append(render_player_template(context));
        }

        this.$map.show(1000);
    };

    SimpleGame.prototype.play_round = function () {
        if (!this.game) throw new Error('game not started');

        var players_count_cards = this.game.get_players_pack_of_cards_count_array();
        var players_round_cards = this.game.get_players_round_cards_array();
        var $child = this.$map.children();

        if (this.need_add_card) {
            log("Current round state DISPUTE ADD CARDS");
            this.$map.find('.one_card').not('.dispute > .one_card').remove();

            for (var i = 1; i < this.raund_state_array.length; i++) {
                var index = this.raund_state_array[i];
                if (players_count_cards[index]) {
                    // add imd
                    $child.eq(index).append("<img class=\"add_card\" src=\"img/shrit_card.png\">");
                    // fix card count
                    $child.eq(index).find('.player_card_count').text(players_count_cards[index]);
                }
            }

            this.need_add_card = false;
            return 1;
        }

        this.$map.find('.one_card').remove();
        if (this.raund_state_array[0] == Game.states.victory_in_round) {
            $('.add_card').remove();
        }

        var old_state_is_dispute = this.raund_state_array[0] == Game.states.dispute_in_round;
        var state_array = this.raund_state_array = this.game.get_round_state_array();
        var state = state_array[0];
        var state_args = state_array.slice(1);
        var state_is_dispute = Game.states.dispute_in_round == state;

        // log
        var repr_for_states = ["--", "GAME OVER WINN ", "PLAYER WINN ROUND ", "DISPUTE "];
        var end_of_message = state_args.join(' ');
        log("Current round state " + repr_for_states[state] + end_of_message);

        // show cards
        for (var i = 0; i < this.game.get_count_players(); i++) {
            // update current count cards
            var count = players_count_cards[i];

            $child.eq(i).find('.player_card_count').text(count);
            if (count == 0) {
                $child.eq(i).fadeOut(1000 + _.random(0, 15000));
            }

            $child.eq(i).removeClass('round_winner').removeClass('dispute');
            var img_url = get_card_image_url(players_round_cards[i]);
            if (img_url != -1) {
                $child.eq(i).append("<img class=\"one_card\" src=\"" + img_url + "\">");
            }
        }

        if (state_is_dispute) {
            for (var i = 0; i < state_args.length; i++) {
                var index = state_args[i];
                $child.eq(index).addClass('dispute');
            }
            this.need_add_card = true;
        } else {
            $child.eq(state_args[0]).addClass('round_winner');
        }

        if (state == Game.states.game_over) {
            if (typeof this.callback_on_game_over === "function") {
                var winner = state_array[1];
                this.callback_on_game_over(winner);
            }
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