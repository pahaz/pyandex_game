/**
 * User: pahaz
 * Date: 29.08.13
 * Time: 19:42
 */

define(['underscore'], function (_) {
    var Card = function (number, suit) {
        this.number = number || 0;
        this.suit = suit || 0;
    };

    Card.prototype.get_card_string_representation = function (use_suit_names) {
        var represent_number = ["", "ERROR", '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', "ERROR"];
        var represent_suit = ["no card", '♠', '♣', '♦', '♥'];
        if (use_suit_names) {
            represent_suit = ["no", 'spades', 'clubs', 'diamonds', 'hearts'];
        }
        return represent_number[this.number] + represent_suit[this.suit];
    };

    Card.prototype.toString = function () {
        return this.get_card_string_representation();
    };

    var Game = function (count_of_layers) {
        if (count_of_layers <= 1 || count_of_layers > 26) {
            throw new Error("Bead count of players value.")
        }

        this.count_of_players = count_of_layers;
        this.inicialized = false;
    };

    Game.Card = Card;
    Game.name = "pyandex";
    Game.states = {
        init: 0,
        game_over: 1,
        victory_in_round: 2,
        dispute_in_round: 3
    };

    Game.prototype.name = "pyandex";
    Game.prototype.check_init = function () {
        if (!this.inicialized) {
            this.init();
        }
    };

    Game.create_pack_of_cards_array = function () {
        var cards_array = [];
        for (var suit = 1; suit <= 4; suit++) {
            for (var number = 2; number <= 14; number++) {
                var card = new Card(number, suit);
                cards_array.push(card);
            }
        }
        return cards_array;
    };

    Game.prototype.distribute_pack_of_cards_array_for_players = function (pack_of_cards_array, count_of_players) {
        var players_packs_of_cards_arrays = [];
        for (var i = 0; i < pack_of_cards_array.length; i++) {
            if (i < count_of_players) {
                players_packs_of_cards_arrays.push([]);
            }
            players_packs_of_cards_arrays[ i % count_of_players ].push(pack_of_cards_array[i]);
        }
        return players_packs_of_cards_arrays;
    };

    Game.prototype.init = function () {
        var pack_of_cards_array = Game.create_pack_of_cards_array();
        var shuffled_pack_of_cards_array = _.shuffle(pack_of_cards_array);
        var distribution_pack_of_cards_array = this.distribute_pack_of_cards_array_for_players(
            shuffled_pack_of_cards_array, this.count_of_players);

        this._raund_players_indexes_array = _.range(this.count_of_players);
        this._dispute_cards_array = [];
        this._players_cards_arrays = distribution_pack_of_cards_array;
        this.inicialized = true;
    };

    /**
     * @return {Number} winner player index if game is over else return -1
     */
    Game.prototype.get_game_winner_index = function () {
        this.check_init();

        var last_player_index_who_have_cards = -1;
        var count_of_players_who_have_not_cards = 0;

        for (var i = 0; i < this._players_cards_arrays.length; i++) {
            if (this._players_cards_arrays[i].length) {
                last_player_index_who_have_cards = i;
            } else {
                count_of_players_who_have_not_cards += 1;
            }
        }

        if (count_of_players_who_have_not_cards === this._players_cards_arrays.length - 1) {
            return last_player_index_who_have_cards;
        }

        return -1;
    };

    /**
     * @return {Boolean} true if game over
     */
    Game.prototype.game_is_over = function () {
        return this.get_game_winner_index() != -1;
    };

    Game.prototype.player_is_playing_in_round = function (index) {
        return _.indexOf(this._raund_players_indexes_array, index) != -1
    };

    Game.prototype.get_playing_round_card_numbers = function (use_last_cards, not_check_playing) {
        var round_card_numbers = [];
        var number, card;
        for (var i = 0; i < this._players_cards_arrays.length; i++) {
            if (this._players_cards_arrays[i].length && (this.player_is_playing_in_round(i) || not_check_playing)) {
                if (use_last_cards) {
                    card = _.last(this._players_cards_arrays[i]);
                } else {
                    card = _.first(this._players_cards_arrays[i]);
                }
                number = card.number;
            } else {
                number = 0;
            }
            round_card_numbers.push(number);
        }
        return round_card_numbers;
    };

    Game.prototype.get_round_winner_array = function () {
        var players_current_card_numbers = this.get_playing_round_card_numbers();
        var max_card_number = _.max(players_current_card_numbers);
        var winner_indexes = [];

        for (var i = 0; i < players_current_card_numbers.length; i++) {
            if (players_current_card_numbers[i] === max_card_number) {
                winner_indexes.push(i);
            }
        }
        return winner_indexes;
    };

    Game.prototype.get_round_state_array = function () {
        this.check_init();

        var winner_index = this.get_game_winner_index();
        if (winner_index != -1) {
            return [Game.states.game_over, winner_index];
        }

        var round_winner_array = this.get_round_winner_array();
        if (round_winner_array.length === 1) {
            return [Game.states.victory_in_round, round_winner_array[0]];
        } else {
            return [Game.states.dispute_in_round].concat(round_winner_array);
        }
    };

    Game.prototype.take_away_cards_from_index_array = function (index_array) {
        var taken_cards = [];
        for (var i = 0; i < index_array.length; i++) {
            var index = index_array[i];
            if (this._players_cards_arrays[index].length) {
                var card = this._players_cards_arrays[index].shift();
                taken_cards.push(card);
            }
        }
        return taken_cards;
    };

    Game.prototype.take_away_round_cards = function () {
        return this.take_away_cards_from_index_array(this._raund_players_indexes_array);
    };

    /**
     * @public
     * @returns {Array} player indexes who play in round
     */
    Game.prototype.get_round_playing_player_indexes_array = function () {
        return _.clone(this._raund_players_indexes_array);
    };

    /**
     * @public
     * @returns {Array} dispute Cards array
     */
    Game.prototype.get_round_dispute_cards_array = function () {
        return _.clone(this._dispute_cards_array);
    };

    /**
     * @public
     * @returns {Array} players Cards arrays
     */
    Game.prototype.get_players_pack_of_cards_arrays = function() {
        return _.clone(this._players_cards_arrays);
    };

    Game.prototype.update_next_round_play_playing_player_indexes = function (next_round_plying_player_indexes) {
        if (next_round_plying_player_indexes) {
            this._raund_players_indexes_array = next_round_plying_player_indexes;
            return;
        }

        this._raund_players_indexes_array = [];
        for (var i = 0; i < this._players_cards_arrays.length; i++) {
            if (this._players_cards_arrays[i].length) {
                this._raund_players_indexes_array.push(i)
            }
        }
    };

    /**
     * Update players deck of cards.
     *
     * Depend from get_round_state_array.
     * @return {undefined}
     */
    Game.prototype.play_round = function () {
        this.check_init();

        var state_array = this.get_round_state_array();
        var round_cards = this.take_away_round_cards();
        var state = state_array[0];
        if (state === Game.states.dispute_in_round) {
            var dispute_player_indexes = state_array.slice(1);

            // add round cards
            this._dispute_cards_array.push.apply(this._dispute_cards_array, round_cards);

            // add dispute adds cards
            var added_dispute_cards = this.take_away_cards_from_index_array(dispute_player_indexes);
            this._dispute_cards_array.push.apply(this._dispute_cards_array, added_dispute_cards);

            this.update_next_round_play_playing_player_indexes(dispute_player_indexes);
        } else {
            var winner_index = state_array[1]; // game_over or round_win

            var winner_cards_array = this._players_cards_arrays[winner_index];

            // add dispute cards
            winner_cards_array.push.apply(winner_cards_array, this._dispute_cards_array);
            this._dispute_cards_array = [];

            // add round cards
            winner_cards_array.push.apply(winner_cards_array, round_cards);

            this.update_next_round_play_playing_player_indexes();
        }
    };

    Game.prototype.get_players_pack_of_cards_string_representation_array = function (){
        return _.map(this._players_cards_arrays, function(cards) {
            return _.map(cards, function(card) {
                return card.get_card_string_representation();
            })
                .join(' ')
        })
    };

    return Game;
});