const PADDLE_HEIGHT = 100, PADDLE_WIDTH = 10;
const WINNING_SCORE = 3;
var canvas, canvasContext;
var paddle1Y, paddle2Y = (600 - PADDLE_HEIGHT)/2;
var ballX = 5, ballY = 5, ballSpeedX = 5, ballSpeedY = 2;
var player1Score = 0, player2Score = 0;
var winningPlayer;
var displayWinningScreen = false;

function getMouseClick(event) {
	if(displayWinningScreen) {
		player1Score = 0;
		player2Score = 0;
		displayWinningScreen = false;
	}
}

function getMousePosition(event) {
	var mousePosition = calculateMousePosition(event);
	paddle1Y = mousePosition.y - PADDLE_HEIGHT/2;
}

function calculateMousePosition(event) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

window.onload = function() {
	//Preparing the canvas for drawing
	var framesPerSecond = 50;
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	//Calling paint and move functions for moving the ball
	setInterval(function() { 
		paintComponents(); 
		moveComponents(); 
	}, 1000/framesPerSecond);

	//Attaching mousedown to screen
	canvas.addEventListener('mousedown', getMouseClick)

	//Attaching mousemove event to paddle1
	canvas.addEventListener('mousemove', getMousePosition);
}

function computerMovement(){
	//Inducing intelligence in computer player
	if((paddle2Y + PADDLE_HEIGHT/2) < ballY-35)
		paddle2Y += 5;	
	else if((paddle2Y + PADDLE_HEIGHT/2) > ballY+35)
		paddle2Y -= 5;
}

function resetBall(){
	//Reset ball position after a point is scored
	if(player1Score >= WINNING_SCORE){
		winningPlayer = 1;
		displayWinningScreen = true;
	}
	else if(player2Score >= WINNING_SCORE){
		winningPlayer = 2;
		displayWinningScreen = true;
	}
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = -ballSpeedX;
}

function moveComponents() {
	if(displayWinningScreen)
		return;
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	//Checking if the ball hits the paddle or not
	if(ballX < 0) {
		if(ballY >= paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.40;
		}
		else{
			player2Score++;
			resetBall();
		}
	}

	if(ballX > canvas.width) {
		if(ballY >= paddle2Y && ballY <= paddle2Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.40;
		}
		else{
			player1Score++;			
			resetBall();		
		}
	}

	//Elastic collision from top of the canvas
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	//Elastic collision from bottom of the canvas
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function paintComponents() {
	//Drawing the canvas
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	//Drawing the paddles
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

	//Drawing the ball
	canvasContext.fillStyle = "white";
	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, 5, 0, Math.PI*2, true);
	canvasContext.fill();

	//Drawing the scores
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);

	//Drawing the winning screen
	if(displayWinningScreen){
		var string = "Player " + winningPlayer + " wins! Click to play again"
		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		canvasContext.fillStyle = 'white';
		canvasContext.fillText(string, (canvas.width - 120)/2, 200);
	}
}