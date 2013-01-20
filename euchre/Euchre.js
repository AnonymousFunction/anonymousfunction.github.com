//Euchre.js
var Euchre = function(){
	var SUIT = {
		CLUBS: "&clubs;",
		SPADES: "&spades;",
		HEARTS: "&hearts;",
		DIAMONDS: "&diams;"
	};
	
	var ALL_SUITS_CSS = "club spade heart diamond";
	
	var CARDS = [];
	
	var PLAYERS = {
		USER: [],
		OPPONENT_ONE: [],
		PARTNER: [],
		OPPONENT_TWO: []
	};
	
	var KITTY = [];
	
	var TRUMP = "";
	
	var TEAM = {
		USER: "User",
		OPPONENT: "Opponent"
	};
	
	var PLAYER = {
		USER: "USER",
		OPPONENT_ONE: "OPPONENT_ONE",
		PARTNER: "PARTNER",
		OPPONENT_TWO: "OPPONENT_TWO"
	}
	
	var LED_TRICK = "";
	
	var LED_SUIT = ""
	
	var HAS_TRICK = "";
	
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
	
	var showKitty = function(){
		$("#kitty").html(KITTY[0].value + " " + KITTY[0].suit).addClass(KITTY[0].cssClass);
	};
	
	var userDecideKitty = function(orderedUp){
		//TODO - go around for kitty
		$("#pass, #orderUp").hide();
		if (orderedUp) {
			//TODO - discard
			showMessageDialog({message: "You must discard", title: "Discard"});
			$("#user .card").on("click", function(){
				//Change the card they pick to the first of the kitty
				$(this).html(KITTY[0].value + " " + KITTY[0].suit)
					.removeClass(ALL_SUITS_CSS)
					.addClass(KITTY[0].cssClass);
					
				//Hide the kitty, it's not needed for the hand
				$("#kitty").hide();
				
				//Set trump for the hand and on the screen
				TRUMP = KITTY[0].suit;
				$("#trumpSuit").html(TRUMP);
					
				//Turn off the kitty replacing event handler
				$("#user .card").off();
				
				startTrick();
			});
		} else {
			//TODO - pass to left
		}
	};
	
	var startTrick = function(){
		//TODO - who's the dealer? start to the left of them, let's hardcode the user for now
		userTurn()
		
	};
	
	var userTurn = function(){
		$("#user .card").on("click", function(){
			$("#userPlay").html($(this).html()).removeClass(ALL_SUITS_CSS);
			var newSuit;
			
			//TODO - a better way to get the suit
			if ($(this).hasClass("club")) {
				newSuit = "club";
			} else if ($(this).hasClass("spade")) {
				newSuit = "spade";
			} else if ($(this).hasClass("heart")) {
				newSuit = "heart";
			} else if ($(this).hasClass("diamond")) {
				newSuit = "diamond";
			}
			$("#userPlay").addClass(newSuit);
			
			$("#user .card").off();

			//TODO - Combine PLAYER and PLAYERS
			LED_TRICK = PLAYER.USER;
			
			LED_SUIT = newSuit;
			
			HAS_TRICK = TEAM.USER;
			
			//Delete card from hand after user plays it
			$(this).remove();
		
			//TODO - don't hardcode this
			opponentOneTurn();
		});
	};
	
	var opponentOneTurn = function(){
		console.log("Who has the trick?", HAS_TRICK);
		consoleLogHand("Opponent One", PLAYERS.OPPONENT_ONE);
		
		var hand = PLAYERS.OPPONENT_ONE;
		var cardToPlay;
		
		if (hasToFollowSuit(hand)) {
			console.log("Must follow suit");
			if (HAS_TRICK == TEAM.OPPONENT) {
				//TODO - We have the trick, throw lowest value suit card
				//Just play the first suited card for now
				for (var card in hand){
					if (hand[card].cssClass == LED_SUIT) {
						cardToPlay = hand[card];
						break;
					}
				}
			} else {
				//TODO - If I can take the trick, throw highest suit card
				//TODO - Else throw lowest value suit card
				
				//Just play the first suited card for now
				for (var card in hand){
					if (hand[card].cssClass == LED_SUIT) {
						cardToPlay = hand[card];
						break;
					}
				}
			}
		} else {
			console.log("Can't follow suit");
			if (HAS_TRICK == TEAM.OPPONENT) {
				//TODO - We have the suit, throw lowest off suit card, do NOT play trump
				
				//Just play the first card for now
				cardToPlay = hand[0];
			} else {
				//TODO - If I have trump, throw the lowest value trump card
				//TODO - Else throw lowest value off suit card
				
				//Just play the first card for now
				cardToPlay = hand[0];
			}
		}
		
		//Play the card the the board and remove it from the hand
		$("#opponentOnePlay").html(cardToPlay.value + " " + cardToPlay.suit)
			.removeClass(ALL_SUITS_CSS).addClass(cardToPlay.cssClass);
		$("#opponentOne .hiddenHand span:first").remove();
	};
	
	var hasToFollowSuit = function(playerHand){
		//TODO - Add "acts as" suit for trump
		console.log("Led Trick", LED_TRICK);
		//TODO - Who led the trick? What suit did they play?
		console.log("User play", $("#userPlay").text());
		console.log("Led Suit", LED_SUIT);
		
		var doesHaveToFollowSuit = false;
		
		for (var card in playerHand){
			if (playerHand[card].cssClass == LED_SUIT) {
				doesHaveToFollowSuit = true;
				break;
			}
		}
		
		return doesHaveToFollowSuit;
		
	}
	
	var showMessageDialog = function(params) {
		$("#messageDialog").text(params.message);
		$("#messageDialog").dialog({
			autoOpen: true,
			draggable: false,
			resizable: false,
			modal: true,
			title: params.title
		});
	};
	
	var consoleLogHand = function(label, playerHand) {
		console.log(label + "'s hand");
		for (var card in playerHand){
			console.log(playerHand[card]);
		}
	}
	
	var initialize = function(){
		buildDeck();
		shuffle();
		deal();
		showKitty();
		
		$("#help").on("click", function(){
			$("#helpDialog").dialog({
				autoOpen: true,
				draggable: false,
				resizable: false,
				modal: true,
				title: "Euchre Help"
			});
		});
		
		$("#pass").on("click", function(){
			userDecideKitty(false);
		});
		
		$("#orderUp").on("click", function(){
			userDecideKitty(true);
		});
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