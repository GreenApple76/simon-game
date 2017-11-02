$(document).ready(function() {

var power = 'off';
var strict = false;
var buttons = ['green','red','yellow','blue'];
var simonButtonSeq = [];
var userButtonSeq = [];
var count = 0;
var turn;
var match;
var seqListenerId;

function startGame() {
	turn = 'simon';
	count = 0;
	simonButtonSeq = [];
	userButtonSeq = [];
	match = undefined;
	clearInterval(seqListenerId);
	$('.green').removeClass('green-active');
	$('.red').removeClass('red-active');
	$('.yellow').removeClass('yellow-active');
	$('.blue').removeClass('blue-active');
	// add random button to simon sequence
	randButton();
	// check user button sequence clicks
	seqListener();
}

function randButton() {
	// keep track of current game level
	count++;
	$('.count').html(count < 10 ? '0' + count : count);
	simonButtonSeq.push(buttons[Math.floor(Math.random() * 4)]);
	// play simon button sequence for user
	var i = 0;
  	var playSeqId = setInterval(function(){
		$('.' + simonButtonSeq[i]).trigger('click');
    	i++;
    if (i >= simonButtonSeq.length) {
	// simon finished adding a random button to sequence
	// now switch turn to user
		turn = 'user';
      	clearInterval(playSeqId);
    }
  }, 700);
}

function seqListener() {
	seqListenerId = setInterval(checkSequence, 1000);
}

function checkSequence() {
	// check the user's button sequence if it is user's turn
	if (turn === 'user' && userButtonSeq.length >= 1) {
		for(var i = 0; i < userButtonSeq.length; i++) {
				// check if user lost
				if (simonButtonSeq[i] !== userButtonSeq[i]) {
					match = 'mismatched';
				}	
		}
		// user lost
		if (match === 'mismatched') {
			// strict mode on: notify user of error (ERR) and restart game
			var errorTone = new Audio("http://www.freesound.org/data/previews/331/331912_3248244-lq.mp3");
			if (strict) {
				$('.count').html('<span class="error">ERR!</span>');
				errorTone.play();
				setTimeout(function() {
					console.log('setTimeout: startGame()');
					match = undefined;
					startGame();
				},1500);
			// strict mode off: clear user button sequence, play back simon sequence
			// again so user can have another chance
			} else {
				turn = 'simon';
				$('.count').html('<span class="error">ERR!</span>');
				errorTone.play();
				match = undefined;
				userButtonSeq = [];
				setTimeout(function() {
					var i = 0;
					$('.count').html(count < 10 ? '0' + count : count);
					var playSeqId = setInterval(function(){
						$('.' + simonButtonSeq[i]).trigger('click');
				    	i++;
				   		if (i >= simonButtonSeq.length) {
							// simon finished playing back simon sequence
							clearInterval(playSeqId);
							turn = 'user';
						}
					},700);
				},1500);
			}
		// user matched all simon's button sequence
		} else if (userButtonSeq.length === simonButtonSeq.length && match !== 'mismatched') {
			// user solved all 20 levels - announce winner
			if (count === 20) {
				clearInterval(seqListenerId);
				var winAudio = new Audio('https://freesound.org/people/mickleness/sounds/269198/download/269198__mickleness__game-win.mp3');
				winAudio.play();
				$('.green').addClass('green-active');
				$('.red').addClass('red-active');
				$('.yellow').addClass('yellow-active');
				$('.blue').addClass('blue-active');
				$('.count').html('<span class="win">WIN!</span>');
				var j = 0;
				var k = 0;
				var winHideId = setInterval(function() {
					$('.count').html('<span class="win">YOU!</span>');
					if (j > 3) {
						clearInterval(winHideId);
					}
					j++;
					
				}, 350);
				var winShowId = setInterval(function() {
						$('.count').html('<span class="win">WIN!</span>');
						if (k > 4) {
							clearInterval(winShowId);
						}
						k++;
					}, 450);
			// user matched entire simon sequence so far
			// clear user button sequence and add button to simon sequence
			// so that user can attempt guessing next level / round
			} else {
				userButtonSeq = [];
				turn = 'simon';
				randButton();
			}
		} else {
			// do nothing, allow user to continue to press buttons to match additional
			// buttons in the simon sequence
		}
	}
}

$('.on-btn').click(function() {
	if (power === 'on') {
		$('.off-btn').trigger('click');
	} else {
		power = 'on';
		$('.off-btn').css('background-color', '#222').css('border', 'none');
		$('.on-btn').css('background-color', '#479AC6').css('border', '.01rem solid gray');
	}
});

$('.off-btn').click(function() {
	if (power === 'off') {
		$('.on-btn').trigger('click');
	} else {
		power = 'off';
		clearInterval(seqListenerId);
		count = '---';
		$('.count').html(count);
		$('.green').removeClass('green-active');
		$('.red').removeClass('red-active');
		$('.yellow').removeClass('yellow-active');
		$('.blue').removeClass('blue-active');
		strict = false;
		$('.strict').css('background-color', '#CCA707');
		$('.on-btn').css('background-color', '#222').css('border', 'none');
		$('.off-btn').css('background-color', '#479AC6').css('border', '.01rem solid gray');
	}
});

$('.start').click(function() {
	if (power === 'on') {
		startGame();
	}
});

// strict mode on = force game reset on user error
// strict mode off = clear user button sequence history and replay simon button sequence to
//                   allow user to have another guess without resetting game
$('.strict').click(function() {
	var strictAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
	if (strict) {
		strict = false;
		$('.strict').css('background-color', '#CCA707');
		strictAudio.play();
	} else {
		strict = true;
		$('.strict').css('background-color', '#ff0');
		strictAudio.play();
	}
});

$('.green').click(function() {
	$('.green').addClass('green-active');
	new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3').play();
	if (turn === 'user') {
		userButtonSeq.push('green');
	} 
	setTimeout(function() {
		$('.green').removeClass('green-active');
	}, 250);
});

$('.red').click(function() {
	$('.red').addClass('red-active');
	new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3').play();
	if (turn === 'user') {
		userButtonSeq.push('red');
	}
	setTimeout(function() {
		$('.red').removeClass('red-active');
	}, 250);	
});

$('.yellow').click(function() {
	$('.yellow').addClass('yellow-active');
	new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3').play();
	if (turn === 'user') {
		userButtonSeq.push('yellow');
	}
	setTimeout(function() {
		$('.yellow').removeClass('yellow-active');
	}, 250);	
});

$('.blue').click(function() {
	$('.blue').addClass('blue-active');
	new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3').play();
	if (turn === 'user') {
		userButtonSeq.push('blue');
	}
	setTimeout(function() {
		$('.blue').removeClass('blue-active');
	}, 250);	
});

});