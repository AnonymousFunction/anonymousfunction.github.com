//Euchre.js
var Euchre = function(){
	var SUIT = {
		CLUBS: "&clubs;",
		SPADES: "&spades;",
		HEARTS: "&hearts;",
		DIAMONDS: "&diams;"
	};
	
	var CARDS = [];
	
	var PLAYERS = {
		USER: [],
		OPPONENT_ONE: [],
		PARTNER: [],
		OPPONENT_TWO: []
	};
	
	var KITTY = [];
	
	var createCard = function(value, suit, cssClass){
		return {
			value: value,
			suit: suit,
			cssClass: cssClass 
		}
	};
	
	var buildDeck = function(){
		CARDS.push(createCard("9", SUIT.CLUBS, "club"));
		CARDS.push(createCard("10", SUIT.CLUBS, "club"));
		CARDS.push(createCard("J", SUIT.CLUBS, "club"));
		CARDS.push(createCard("Q", SUIT.CLUBS, "club"));
		CARDS.push(createCard("K", SUIT.CLUBS, "club"));
		CARDS.push(createCard("A", SUIT.CLUBS, "club"));
		
		CARDS.push(createCard("9", SUIT.SPADES, "spade"));
		CARDS.push(createCard("10", SUIT.SPADES, "spade"));
		CARDS.push(createCard("J", SUIT.SPADES, "spade"));
		CARDS.push(createCard("Q", SUIT.SPADES, "spade"));
		CARDS.push(createCard("K", SUIT.SPADES, "spade"));
		CARDS.push(createCard("A", SUIT.SPADES, "spade"));
		
		CARDS.push(createCard("9", SUIT.HEARTS, "heart"));
		CARDS.push(createCard("10", SUIT.HEARTS, "heart"));
		CARDS.push(createCard("J", SUIT.HEARTS, "heart"));
		CARDS.push(createCard("Q", SUIT.HEARTS, "heart"));
		CARDS.push(createCard("K", SUIT.HEARTS, "heart"));
		CARDS.push(createCard("A", SUIT.HEARTS, "heart"));	
		
		CARDS.push(createCard("9", SUIT.DIAMONDS, "diamond"));
		CARDS.push(createCard("10", SUIT.DIAMONDS, "diamond"));
		CARDS.push(createCard("J", SUIT.DIAMONDS, "diamond"));
		CARDS.push(createCard("Q", SUIT.DIAMONDS, "diamond"));
		CARDS.push(createCard("K", SUIT.DIAMONDS, "diamond"));
		CARDS.push(createCard("A", SUIT.DIAMONDS, "diamond"));
	};
	
	var shuffle = function(){
		for(var j, x, i = CARDS.length; i; j = parseInt(Math.random() * i), x = CARDS[--i], CARDS[i] = CARDS[j], CARDS[j] = x);
	};
	
	var deal = function(){
		var i;
		for (i = 0; i < 5; i++) {
			PLAYERS.USER.push(CARDS[i]);
		}
		
		for (i = 5; i < 10; i++) {
			PLAYERS.OPPONENT_ONE.push(CARDS[i]);
		}
		
		for (i = 10; i < 15; i++) {
			PLAYERS.PARTNER.push(CARDS[i]);
		}
		
		for (i = 15; i < 20; i++) {
			PLAYERS.OPPONENT_TWO.push(CARDS[i]);
		}
		
		for (i = 20; i < CARDS.length; i++) {
			KITTY.push(CARDS[i]);
		}
	}
	
	var initialize = function(){
		buildDeck();
		shuffle();
		deal();
	};
	
	return {
		initialize: initialize,
		shuffle: shuffle,
		PLAYERS: PLAYERS,
		KITTY: KITTY
	}
}()




$(document).ready(function(){
	Euchre.initialize();
	
	var userHand = "";
	for (var card in Euchre.PLAYERS.USER){
		var thisCard = Euchre.PLAYERS.USER[card];
		userHand += "<span class='card " + thisCard.cssClass + "'>" + thisCard.value + " " + thisCard.suit + "</span>";
	}
	$("#user .hand").html(userHand);
	
	var opponentOneHand = "";
	for (var card in Euchre.PLAYERS.OPPONENT_ONE){
		var thisCard = Euchre.PLAYERS.OPPONENT_ONE[card];
		opponentOneHand += "<span class='card " + thisCard.cssClass + "'>" + thisCard.value + " " + thisCard.suit + "</span>";
	}
	$("#opponentOne .hand").html(opponentOneHand);
	
	var partnerHand = "";
	for (var card in Euchre.PLAYERS.PARTNER){
		var thisCard = Euchre.PLAYERS.PARTNER[card];
		partnerHand += "<span class='card' " + thisCard.cssClass + "'>" + thisCard.value + " " + thisCard.suit + "</span>";
	}
	$("#partner .hand").html(partnerHand);
	
	var opponentTwoHand = "";
	for (var card in Euchre.PLAYERS.OPPONENT_TWO){
		var thisCard = Euchre.PLAYERS.OPPONENT_TWO[card];
		opponentTwoHand += "<span class='card' " + thisCard.cssClass + "'>" + thisCard.value + " " + thisCard.suit + "</span>";
	}
	$("#opponentTwo .hand").html(opponentTwoHand);
	
	console.log("Kitty:");
	for (var card in Euchre.KITTY){
		console.log(Euchre.KITTY[card]);
	}
	
});