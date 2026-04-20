/* ========== Global Variables ========== */
let timeRemaining = 12;
let timerInterval = null;
let selectedAnswerElement = null;
let fiftyFiftyUsed = false;

/* ========== Timer Countdown Function ========== */
function startTimer() {
	const timerElement = document.getElementById('timer');
	const progressBar = document.getElementById('progress-bar');
	const progressPercentage = document.getElementById('progress-percentage');
	const totalTime = 12;
	
	timerInterval = setInterval(function() {
		timeRemaining--;
		
		// Update timer display
		const minutes = Math.floor(timeRemaining / 60);
		const seconds = timeRemaining % 60;
		timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
		
		// Update progress bar
		const progressValue = ((totalTime - timeRemaining) / totalTime) * 100;
		progressBar.style.width = progressValue + '%';
		progressPercentage.textContent = Math.round(progressValue) + '%';
		
		// Stop at 0
		if (timeRemaining <= 0) {
			clearInterval(timerInterval);
			timerElement.textContent = '00:00';
			progressBar.style.width = '100%';
			progressPercentage.textContent = '100%';
			// Auto-submit or show timeout message
		}
	}, 1000);
}

/* ========== Answer Selection Function ========== */
function selectAnswer(element) {
	// Remove previous selection
	if (selectedAnswerElement) {
		selectedAnswerElement.classList.remove('selected');
	}
	
	// Add selection to clicked element
	element.classList.add('selected');
	selectedAnswerElement = element;
}

/* ========== 50:50 Lifeline Function ========== */
function useFiftyFifty() {
	if (fiftyFiftyUsed) return;
	
	fiftyFiftyUsed = true;
	const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn');
	fiftyFiftyBtn.classList.add('disabled');
	
	// Get all answer options
	const allAnswers = document.querySelectorAll('.answer-option');
	const correctAnswer = 'A'; // Uruguay is the correct answer (first World Cup winner in 1930)
	
	// Get wrong answers (excluding the correct one)
	const wrongAnswers = Array.from(allAnswers).filter(
		answer => answer.dataset.answer !== correctAnswer
	);
	
	// Randomly select 2 wrong answers to remove
	const shuffled = wrongAnswers.sort(() => 0.5 - Math.random());
	const toRemove = shuffled.slice(0, 2);
	
	// Remove them with animation
	toRemove.forEach((answer, index) => {
		setTimeout(() => {
			answer.classList.add('removed');
		}, index * 150);
	});
}

/* ========== Audience Lifeline Function ========== */
function useAudience() {
	alert('Audience Poll:\nA: 65%\nB: 20%\nC: 10%\nD: 5%');
}

/* ========== Skip Question Function ========== */
function skipQuestion() {
	if (confirm('Are you sure you want to skip this question?')) {
		// Navigate to next question (placeholder)
		console.log('Skipping to next question...');
	}
}

/* ========== Initialize on Page Load ========== */
document.addEventListener('DOMContentLoaded', function() {
	// Start the countdown timer
	startTimer();
	
	// Prevent default back button behavior for demo
	document.querySelector('.back-button').addEventListener('click', function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to go back? Your progress will be lost.')) {
			console.log('Going back...');
		}
	});
});