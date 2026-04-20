// Global variables
var lastAttemptedAudio = null; // Stores the file name to retry
var activeAudioList = [];

let questionsData = "";
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let globaltime = 10;
let globaltimeset = '00:10'
let timeRemaining = globaltime;
let totalQuestions = 0; //Total QNA
let fiftyFiftyUsed = false;
let setQuestionsUsed = '';
let shuffledQuestions = '';
let questionStartTime = 0;
var currentLessonBatchIndex = 0; 
let lessonTotalQNA = 10; //from server in full lunch //Get 6 json each at every turn

let timerDuration = 60;        // 60 seconds as required
let teaserDuration = 30;
let timeLeft = timerDuration;   // current countdown value
let countdownInterval = null;   // holds setInterval reference
let currentScoreDisplayElement = null; // reference to dynamic time-display div (for timer updates)

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load questions data
    //questionsData = JSON.parse(localStorage.getItem('attenquestionsets')) || ""; //remove
    //if(data == "1000000111"){logout() return;}
    confirmUserPresence()
});


/*************************INITIALIZERS FUNCTION*******************************/
function confirmUserPresence(){
	let dzmhksfoh = Math.floor(Math.random() * 754556465546);
	let outrightP = "presence";
    $.ajax({
        type: "POST",
        url: "https://booky.16mb.com/saintmophines/api/",
        data: {dzmhksfoh: dzmhksfoh, outrightP: outrightP},
		xhrFields: {
			withCredentials: true   // THIS enables cookies
		},
        success: function(data){    
           //$("#main").html(data); 
            if(data == "1001"){ //IF USER IS LOGGED IN
				showToast('Welcome Onboard.', 'success');
				loadScorePage()
            }else{
				showToast('Wrong Turn', 'error');
				removeCookies();
				document.getElementById('mainAppArea').innerHTML = `Seems you have you have stumbled into an unfamiliar territory. Go back to Home to find your way.`;
				setTimeout(function(){
					window.location.href = "./"
				}, 4000);
            }
        },error : function(jqXHR, textStatus, errorThrown) {
			showToast('Please Refresh. An error occured', 'error');
		}
    });
}

function tableliststudypapers(){
	let chgahjokvkkxg  = "chgahjokvkkxg";	
	//let focalgroup  = focusGroupUID;	
		$.ajax({
			type: "POST",
			url: "https://booky.16mb.com/saintmophines/api/", 
			dataType: "json",
			data: {chgahjokvkkxg: chgahjokvkkxg},
			xhrFields: {
				withCredentials: true   // THIS enables cookies
			},
			success: function(result){
				currentstudysessions = result;
				if (result.length === 0 || (result.length === 1 && result[0].length === 0)) {
					showToast('Studies Sessions is empty', 'info');
					nostudyonsession();
				} else {
					
					//console.log(currentstudysessions)
					showToast('Studies Sessions has been loaded', 'success');
					displaystudyonsession()
				}
			},error : function(jqXHR, textStatus, errorThrown) {
				showToast('Please Refresh. An error occured', 'error');
		 }
	  });
}
function displaystudyonsession(){
	let STUDYSLETTERS = `
		<div  class="file-table-container">
		
			<table class="file-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Sharing</th>
					</tr>
				</thead>
				<tbody>
		`;
		currentstudysessions.forEach(function(item, index) {
			let secCurrPapper = item.papers;
			let paperLenght = secCurrPapper.length;
			
		STUDYSLETTERS += `	<tr>
						<td>
							<div class="file-name" >
								<span>${item.textbook}</span>
							</div>
						</td>
						<td>
						<div class="v-flex-wrap">
						`;
						let no = 1;
							for(let i=0;i<paperLenght;i++){
								
							STUDYSLETTERS += `	
							<span data-study-no="${secCurrPapper[i].SuStudy}" data-paper-no="${secCurrPapper[i].SuPapper}" class="sharing-badge">
								<i class="fas fa-globe"></i>
								Paper${no++}
							</span>
							`;
							}
						STUDYSLETTERS += `	
						</div>
						</td>
						
					</tr>
		`;
		});
		STUDYSLETTERS += `			
				</tbody>
			</table>
		</div>`;
	document.getElementById('groupPapers').innerHTML = STUDYSLETTERS;

	
	document.querySelectorAll('.sharing-badge').forEach(span => {
	span.addEventListener('click', function(e) {
		// use currentTarget, not target, because you might click the <i>
		let studyNumbo = e.currentTarget.dataset.studyNo;
		let paperNumbo = e.currentTarget.dataset.paperNo;
		
		let paperrim = '';
		currentstudysessions.forEach(zitem => {
			if(zitem.study == studyNumbo){
				let papersG = zitem.papers;
				let papersGLenght = papersG.length;
				for(let i=0;i<papersGLenght;i++){
					let PSpaperNO = papersG[i].SuPapper;
					if(PSpaperNO == paperNumbo){
						paperrim = papersG[i].SuMeta;
					}
				}
			}
		});
		studypaperoffandon(paperrim);
	  });
	});
}
function nostudyonsession(){
	let STUDYSLETTERS = `
		<h2 class="section-title text-center">You don't have a current study session yet.</h2> `;
	document.getElementById('groupPapers').innerHTML = STUDYSLETTERS;
}
function loadScorePage(){
	$('#mainAppArea').load('_scores.html', function() {
		document.getElementById('groupPapers').innerHTML = `<h2 class="section-title text-center">loading study papers...</h2>`;
		tableliststudypapers();
	});
}
function studypaperoffandon(papers){
	localStorage.setItem('attenquestionsets', papers)
	questionsData = JSON.parse(localStorage.getItem('attenquestionsets')) || "";
	turnOffPapers()
	arrangeDataSpread();
	function turnOnPapers(){
		document.getElementById('groupPapers').style.display = '';
	}
	function turnOffPapers(){
		document.getElementById('groupPapers').style.display = 'none';
	}
}
function arrangeDataSpread(){
	// Get all questions
    setQuestionsUsed = [...questionsData.qdata];
	// Shuffle questions if qutRandom is "yes"
    if (questionsData.qutRandom === "yes") {
        setQuestionsUsed = shuffleArray(setQuestionsUsed);
    }
	let lessonIdx = currentLessonBatchIndex * lessonTotalQNA;
	shuffledQuestions = setQuestionsUsed.slice(lessonIdx, lessonIdx + lessonTotalQNA);
	initializeLessonTut();
	
}
function initializeQuiz() {
	//console.log(shuffledQuestions)
    totalQuestions = shuffledQuestions.length;
    currentQuestionIndex = 0;
    userAnswers = [];
    fiftyFiftyUsed = false;
    
    // Display the first question
    displayQuestion();
}

/*************************QUIZ FUNCTION*******************************/
function retakeQuestons(){
	shuffledQuestions = shuffleArray(shuffledQuestions);
    initializeQuiz();
}
function nextQuestionSection(){
	let lessonIdx = currentLessonBatchIndex * lessonTotalQNA;
	shuffledQuestions = setQuestionsUsed.slice(lessonIdx, lessonIdx + lessonTotalQNA);
	initializeLessonTut();
}
function increaseCurrentBatchIndex(){
	currentLessonBatchIndex++;
	if (currentLessonBatchIndex * lessonTotalQNA >= setQuestionsUsed.length) {
		//console.log("Quiz is over man")
		showToast('You have come to the end of your lesson', 'info');
		return;
	}else{
		nextQuestionSection();
	}
	return;
}

// Function to display a question
function displayQuestion() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset fifty-fifty usage for each question
    fiftyFiftyUsed = false;
    
    // Get the current question
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // Create the question HTML
    const questionGame = document.getElementById('questionGame');
    questionGame.innerHTML = '';
    
    // Create the header with question
    const vivaHeader = document.createElement('div');
    vivaHeader.className = 'viva-header scores';
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.onclick = function() {
        if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            window.location.href = './';
        }
    };
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    
    const questionCounter = document.createElement('div');
    questionCounter.className = 'question-counter';
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${totalQuestions}`;
    
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    
    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = currentQuestion.question;
    
    // Adjust font size based on question length
    const length = questionText.textContent.length;
    let fontSize;
    
    if (length > 200) fontSize = '0.8125rem'; // 13px
    else if (length > 120) fontSize = '0.875rem'; // 14px
    else if (length > 60) fontSize = '1rem'; // 16px
    else fontSize = '1.125rem'; // 18px
    
    questionText.style.fontSize = fontSize;
    questionText.style.transition = 'font-size 0.3s ease';
    
    questionCard.appendChild(questionText);
    //vivaHeader.appendChild(backButton);
    vivaHeader.appendChild(questionCounter);
    vivaHeader.appendChild(questionCard);
    
    // Create the progress section
    const progressSection = document.createElement('div');
    progressSection.className = 'progress-section';
    
    const timerCircle = document.createElement('div');
    timerCircle.className = 'timer-circle';
    
    const timerText = document.createElement('span');
    timerText.className = 'timer-text';
    timerText.id = 'timer';
    timerText.textContent = globaltimeset;
    
    timerCircle.appendChild(timerText);
    
    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'progress-wrapper';
    
    const progressLabels = document.createElement('div');
    progressLabels.className = 'progress-labels';
    
    const timeLabel = document.createElement('span');
    timeLabel.textContent = 'Time';
    
    const progressPercentage = document.createElement('span');
    progressPercentage.id = 'progress-percentage';
    progressPercentage.textContent = '0%';
    
    progressLabels.appendChild(timeLabel);
    progressLabels.appendChild(progressPercentage);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress';
    
    const progressBarInner = document.createElement('div');
    progressBarInner.className = 'progress-bar';
    progressBarInner.id = 'progress-bar';
    progressBarInner.style.width = '0%';
    
    progressBar.appendChild(progressBarInner);
    progressWrapper.appendChild(progressLabels);
    progressWrapper.appendChild(progressBar);
    
    progressSection.appendChild(timerCircle);
    progressSection.appendChild(progressWrapper);
    
    // Create the answers section
    const answersSection = document.createElement('div');
    answersSection.className = 'answers-section';
    
    // Get options and shuffle them if needed
    let options = [];
    let optionKeys = Object.keys(currentQuestion.options);
    let correctAnswerKey = currentQuestion.answer;
    
    // Create option objects with key and value
    for (let key of optionKeys) {
        options.push({
            key: key,
            value: currentQuestion.options[key],
            isCorrect: key === correctAnswerKey
        });
    }
    
    // Shuffle options if optRandom is "yes"
    if (currentQuestion.optRandom === "yes") {
        options = shuffleArray(options);
        options = shuffleArray(options); //interntionally shuffling option twices
        //options = shuffleArray(options); //interntionally shuffling option thrice
    }
    
    // Create answer option elements
    const labels = ['A', 'B', 'C', 'D'];
    options.forEach((option, index) => {
        const answerOption = document.createElement('div');
        answerOption.className = 'answer-option';
        answerOption.dataset.answer = option.key;
        answerOption.dataset.label = labels[index];
        answerOption.onclick = function() { selectAnswer(this); };
        
        const optionLabel = document.createElement('div');
        optionLabel.className = 'option-label';
        optionLabel.textContent = labels[index];
        
        const optionText = document.createElement('div');
        optionText.className = 'option-text';
        optionText.textContent = option.value;
        
        answerOption.appendChild(optionLabel);
        answerOption.appendChild(optionText);
        answersSection.appendChild(answerOption);
    });
    
    // Create the spacer for fixed bottom bar
    const contentSpacer = document.createElement('div');
    contentSpacer.className = 'content-spacer';
    
    // Create the action bar
    const actionBar = document.createElement('div');
    actionBar.className = 'action-bar';
    
    const fiftyFiftyBtn = document.createElement('button');
    fiftyFiftyBtn.className = 'action-button';
    fiftyFiftyBtn.id = 'fifty-fifty-btn';
    fiftyFiftyBtn.onclick = function() { useFiftyFifty(); };
    fiftyFiftyBtn.innerHTML = '<i class="fas fa-divide"></i><span>50:50</span>';
    
    const audienceBtn = document.createElement('button');
    audienceBtn.className = 'action-button';
    audienceBtn.onclick = function() { useAudience(); };
    audienceBtn.innerHTML = '<i class="fas fa-users"></i><span>Audience</span>';
    
    const skipBtn = document.createElement('button');
    skipBtn.className = 'action-button';
    skipBtn.onclick = function() { skipQuestion(); };
    skipBtn.innerHTML = '<i class="fas fa-forward"></i><span>Skip</span>';
    
    //actionBar.appendChild(fiftyFiftyBtn);
    //actionBar.appendChild(audienceBtn);
    //actionBar.appendChild(skipBtn);
    
    // Append all elements to the question game container
    questionGame.appendChild(vivaHeader);
    questionGame.appendChild(progressSection);
    questionGame.appendChild(answersSection);
    questionGame.appendChild(contentSpacer);
    //questionGame.appendChild(actionBar);
    
    // Start the timer
    startTeaserTimer();
    
    // Record question start time
    questionStartTime = Date.now();
}

// Function to start the timer
function startTeaserTimer() {
    timeRemaining = globaltime;
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const totalTime = globaltime;
    
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
            
            // Auto-submit or move to next question
            moveToNextQuestion();
        }
    }, 1000);
}

// Function to select an answer
function selectAnswer(element) {
    // Remove previous selection
    const allOptions = document.querySelectorAll('.answer-option');
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Store the user's answer
    const answerKey = element.dataset.answer;
    const answerLabel = element.dataset.label;
    const questionId = shuffledQuestions[currentQuestionIndex].questionID;
    
    // Check if this question has already been answered
    const existingAnswerIndex = userAnswers.findIndex(answer => answer.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
        // Update existing answer
        userAnswers[existingAnswerIndex] = {
            questionId: questionId,
            selectedAnswer: answerKey,
            selectedLabel: answerLabel,
            timeTaken: Date.now() - questionStartTime
        };
    } else {
        // Add new answer
        userAnswers.push({
            questionId: questionId,
            selectedAnswer: answerKey,
            selectedLabel: answerLabel,
            timeTaken: Date.now() - questionStartTime
        });
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
        moveToNextQuestion();
		mainContentTop();
    }, 500);
}

// Function to use 50:50 lifeline
function useFiftyFifty() {
    if (fiftyFiftyUsed) return;
    
    fiftyFiftyUsed = true;
    const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn');
    fiftyFiftyBtn.classList.add('disabled');
    
    // Get all answer options
    const allAnswers = document.querySelectorAll('.answer-option');
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswerKey = currentQuestion.answer;
    
    // Find the correct answer element
    let correctAnswerElement = null;
    allAnswers.forEach(answer => {
        if (answer.dataset.answer === correctAnswerKey) {
            correctAnswerElement = answer;
        }
    });
    
    // Get wrong answers (excluding the correct one)
    const wrongAnswers = Array.from(allAnswers).filter(
        answer => answer.dataset.answer !== correctAnswerKey
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

// Function to use audience lifeline
function useAudience() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswerKey = currentQuestion.answer;
    
    // Get all answer options
    const allAnswers = document.querySelectorAll('.answer-option');
    
    // Find the correct answer element
    let correctAnswerLabel = '';
    allAnswers.forEach(answer => {
        if (answer.dataset.answer === correctAnswerKey) {
            correctAnswerLabel = answer.dataset.label;
        }
    });
    
    // Generate random percentages with correct answer having the highest
    let percentages = {};
    let remainingPercentage = 100;
    
    // Assign a high percentage to the correct answer
    percentages[correctAnswerLabel] = Math.floor(Math.random() * 30) + 50; // 50-80%
    remainingPercentage -= percentages[correctAnswerLabel];
    
    // Distribute the remaining percentage among wrong answers
    allAnswers.forEach(answer => {
        if (answer.dataset.answer !== correctAnswerKey) {
            const label = answer.dataset.label;
            if (Object.keys(percentages).length < 4) {
                // For the first three wrong answers
                percentages[label] = Math.floor(Math.random() * (remainingPercentage / 2)) + 10;
                remainingPercentage -= percentages[label];
            } else {
                // For the last wrong answer, use the remaining percentage
                percentages[label] = remainingPercentage;
            }
        }
    });
    
    // Create and show the audience poll modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'audienceModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'audienceModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'audienceModalLabel';
    modalTitle.textContent = 'Audience Poll';
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Create poll results
    const pollResults = document.createElement('div');
    pollResults.className = 'poll-results';
    
    allAnswers.forEach(answer => {
        const label = answer.dataset.label;
        const percentage = percentages[label];
        
        const pollOption = document.createElement('div');
        pollOption.className = 'poll-option';
        
        const pollLabel = document.createElement('div');
        pollLabel.className = 'poll-label';
        pollLabel.textContent = `${label}:`;
        
        const pollBar = document.createElement('div');
        pollBar.className = 'poll-bar';
        
        const pollBarFill = document.createElement('div');
        pollBarFill.className = 'poll-bar-fill';
        pollBarFill.style.width = `${percentage}%`;
        
        const pollPercentage = document.createElement('div');
        pollPercentage.className = 'poll-percentage';
        pollPercentage.textContent = `${percentage}%`;
        
        pollBar.appendChild(pollBarFill);
        pollOption.appendChild(pollLabel);
        pollOption.appendChild(pollBar);
        pollOption.appendChild(pollPercentage);
        pollResults.appendChild(pollOption);
    });
    
    modalBody.appendChild(pollResults);
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-secondary';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.textContent = 'Close';
    
    modalFooter.appendChild(closeBtn);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    
    // Add the modal to the body
    document.body.appendChild(modal);
    
    // Show the modal
    const audienceModal = new bootstrap.Modal(document.getElementById('audienceModal'));
    audienceModal.show();
    
    // Remove the modal from the DOM after it's hidden
    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

// Function to skip a question
function skipQuestion() {
    //if (confirm('Are you sure you want to skip this question?')) {
        moveToNextQuestion();
		mainContentTop();
    //}
}

// Function to move to the next question
function moveToNextQuestion() {
    // Check if this is the last question
    if (currentQuestionIndex < totalQuestions - 1) {
        // Move to the next question
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Show results
        showResults();
    }
}

// Function to show the results
function showResults() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Calculate score
    let correctCount = 0;
    let results = [];
    
    // Process each question
    shuffledQuestions.forEach((question, index) => {
        const questionId = question.questionID;
        const correctAnswerKey = question.answer;
        const correctAnswerText = question.options[correctAnswerKey];
        
        // Find user's answer for this question
        const userAnswer = userAnswers.find(answer => answer.questionId === questionId);
        
        let isCorrect = false;
        let selectedAnswerText = 'Not answered';
        let selectedAnswerLabel = '-';
        
        if (userAnswer) {
            selectedAnswerText = question.options[userAnswer.selectedAnswer];
            selectedAnswerLabel = userAnswer.selectedLabel;
            isCorrect = userAnswer.selectedAnswer === correctAnswerKey;
            
            if (isCorrect) {
                correctCount++;
            }
        }
        
        results.push({
            questionNumber: index + 1,
            question: question.question,
            selectedAnswer: selectedAnswerText,
            selectedAnswerLabel: selectedAnswerLabel,
            correctAnswer: correctAnswerText,
            correctAnswerLabel: getCorrectAnswerLabel(question, correctAnswerKey),
            isCorrect: isCorrect
        });
    });
    
    // Create the results HTML
    const questionGame = document.getElementById('questionGame');
    questionGame.innerHTML = '';
    
    // Create the results header
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'results-header';
    
    const resultsTitle = document.createElement('h2');
    resultsTitle.className = 'results-title';
    resultsTitle.textContent = 'Results';
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `Your Score: ${correctCount}/${totalQuestions}`;
	
	const timeDisplay = document.createElement('div');
	timeDisplay.className = 'time-display';
    
    resultsHeader.appendChild(resultsTitle);
    resultsHeader.appendChild(scoreDisplay);
    resultsHeader.appendChild(timeDisplay);
    
    // Create the results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    
    // Add each question result
    results.forEach(result => {
        const questionResult = document.createElement('div');
        questionResult.className = `question-result ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = `Question ${result.questionNumber}`;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text-result';
        questionText.textContent = result.question;
        
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';
        
        const selectedAnswer = document.createElement('div');
        selectedAnswer.className = 'selected-answer';
        selectedAnswer.innerHTML = `<span class="answer-label">Your Answer :</span> ${result.selectedAnswer}`;
        
        const correctAnswer = document.createElement('div');
        correctAnswer.className = 'correct-answer';
        correctAnswer.innerHTML = `<span class="answer-label">Correct Answer :</span> ${result.correctAnswer}`;
        
        answerContainer.appendChild(selectedAnswer);
        answerContainer.appendChild(correctAnswer);
        
        questionResult.appendChild(questionNumber);
        questionResult.appendChild(questionText);
        questionResult.appendChild(answerContainer);
        
        resultsContainer.appendChild(questionResult);
    });
    
    // Create the action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
		
    const retakeBtn = document.createElement('button');
    retakeBtn.className = 'btn btn-primary';
    retakeBtn.textContent = 'Retake Quiz';
    retakeBtn.onclick = function() {
		stopLessonTimer(); //Clear lesson timer used
		teaserDuration = 30;
        retakeQuestons();
		mainContentTop();
    };
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-secondary';
    nextBtn.textContent = 'Next Lesson';
    nextBtn.onclick = function() {
		increaseCurrentBatchIndex();
		mainContentTop();
    };
	
	const homeBtn = document.createElement('button');
    homeBtn.className = 'btn btn-secondary';
    homeBtn.textContent = 'Home';
    homeBtn.onclick = function() {
		document.getElementById('questionGame').innerHTML = '';
		document.getElementById('groupPapers').style.display = '';
		clearLocalStroage();
		questionsData = '';
		mainContentTop();
    };
    
    actionButtons.appendChild(retakeBtn);
	 if(correctCount == totalQuestions ){
		 actionButtons.appendChild(nextBtn);
		 actionButtons.appendChild(homeBtn);
	 }else{
		 startLessonTimer("quiz");
	 }
    
    
    // Append all elements to the question game container
    questionGame.appendChild(resultsHeader);
    questionGame.appendChild(resultsContainer);
    questionGame.appendChild(actionButtons);
}

// Helper function to get the correct answer label
function getCorrectAnswerLabel(question, correctAnswerKey) {
    // Get options and shuffle them if needed
    let options = [];
    let optionKeys = Object.keys(question.options);
    
    // Create option objects with key and value
    for (let key of optionKeys) {
        options.push({
            key: key,
            value: question.options[key],
            isCorrect: key === correctAnswerKey
        });
    }
    
    // Shuffle options if optRandom is "yes"
    if (question.optRandom === "yes") {
        options = shuffleArray(options);
    }
    
    // Find the correct option and return its label
    const labels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < options.length; i++) {
        if (options[i].key === correctAnswerKey) {
            return labels[i];
        }
    }
    return '-';
}

/******************LESSON FUNCTIONS & PROPERTIES****************************/
// Helper: get correct answer text from a question object
function getCorrectAnswerText(questionObj) {
	// answer field stores key like "option1", "option2", etc.
	const answerKey = questionObj.answer;
	// options is an object with keys option1..option4
	if (questionObj.options && questionObj.options[answerKey]) {
		return questionObj.options[answerKey];
	}
	// fallback (should never happen with valid data)
	return "Answer not available";
}
// STOP TIMER (clears interval if exists)
function stopLessonTimer() {
	if (countdownInterval) {
		clearInterval(countdownInterval);
		countdownInterval = null;
	}
}
function updateTimerDisplay(seconds) {
	// try to get current .time-display inside #questionGame (dynamic after rebuild)
	const container = document.getElementById('questionGame');
	if (!container) return;
	const scoreDiv = container.querySelector('.time-display');
	if (!scoreDiv) return;

	// Build the instructional message with dynamic timer seconds
	const instructionBase = "⏱️ High focus session · ";
	const timerMessage = `${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
	const footerMsg = "After timer ends, teasers will appear.";
	
	// Preserve clarity: show countdown prominently
	scoreDiv.innerHTML = `
		<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem;">
			<span>📘 This is drill practice— you have <strong style="color:#FFD966;">${seconds}s</strong> to review Q&A.</span>
			<span style="background: #00000030; padding: 0.2rem 0.7rem; border-radius: 40px; font-family: monospace; font-weight: bold;">⏳ ${timerMessage}</span>
		</div>
		<div style="font-size: 0.8rem; margin-top: 6px; opacity: 0.9;">🎯 A teaser will be set for you to actively recall after the timer.</div>
	`;
}
 // Calls initializeQuiz() automatically when time reaches zero
function startLessonTimer(params) {
	// Clear any previous timer to avoid duplicate intervals
	stopLessonTimer();
	
	// Reset timeLeft to the global timerDuration (allows retake with fresh time)
	if(params == "lesson") timeLeft = timerDuration;
	else if (params == "quiz") timeLeft = teaserDuration;
	
	
	// Locate time display element (just updated after build)
	const questionGameContainer = document.getElementById('questionGame');
	if (questionGameContainer) {
		currentScoreDisplayElement = questionGameContainer.querySelector('.time-display');
	}
	
	// initial display update
	updateTimerDisplay(timeLeft);
	
	// start new interval
	countdownInterval = setInterval(() => {
		if (timeLeft <= 1) {
			// Timer has reached zero: stop countdown and invoke retakeQuestons()
			if (countdownInterval) {
				clearInterval(countdownInterval);
				countdownInterval = null;
			}
			// update final display (0 seconds)
			updateTimerDisplay(0);
			// IMPORTANT: call the already existing retakeQuestons function (assumed global)
			if (typeof retakeQuestons === 'function') {
				retakeQuestons(); //using this Instead of initializeQuiz() for the sake or shuffle only
				mainContentTop();
			} else {
				console.warn("retakeQuestons() is not defined. Ensure it exists globally.");
				// optional fallback: show an alert for debugging
				// but we follow spec: function exists
			}
		} else {
			timeLeft--;
			updateTimerDisplay(timeLeft);
		}
	}, 1000);
}
function buildQuizUI() {
	// Get the main container (already present in HTML)
	const gameSection = document.getElementById('questionGame');
	if (!gameSection) {
		console.error("Fatal: #questionGame section not found in DOM.");
		return;
	}
	
	// Clear existing content to rebuild fresh (ensures no stale timers or duplicates)
	gameSection.innerHTML = '';
	
	// ----- 1. Create results-header -----
	const resultsHeader = document.createElement('div');
	resultsHeader.className = 'results-header';
	
	const resultTitle = document.createElement('h2');
	resultTitle.className = 'results-title';
	resultTitle.textContent = '📋 Drill Practice';
	
	const scoreDisplay = document.createElement('div');
	scoreDisplay.className = 'score-display';
	
	const timeDisplay = document.createElement('div');
	timeDisplay.className = 'time-display';
	// initial placeholder text (will be overwritten by timer update)
	timeDisplay.innerHTML = `⏳ Loading timer...`;
	
	resultsHeader.appendChild(resultTitle);
	resultsHeader.appendChild(scoreDisplay);
	resultsHeader.appendChild(timeDisplay);
	
	// ----- 2. Create results-container (holds all questions)-----
	const resultsContainer = document.createElement('div');
	resultsContainer.className = 'results-container';
	
	// Loop through each question and build question-result card
	shuffledQuestions.forEach((q, idx) => {
		const questionNumber = idx + 1;
		const correctAnswerText = getCorrectAnswerText(q);
		
		// main question card div
		const questionDiv = document.createElement('div');
		questionDiv.className = 'question-result lesson';   // all answers shown as lesson (review mode)
		
		// question number span
		const numberSpan = document.createElement('div');
		numberSpan.className = 'question-number';
		numberSpan.textContent = `Question ${questionNumber}`;
		
		// question text
		const questionTextDiv = document.createElement('div');
		questionTextDiv.className = 'question-text-result';
		questionTextDiv.textContent = q.question;
		
		// answer container
		const answerContainer = document.createElement('div');
		answerContainer.className = 'answer-container';
		
		const correctAnswerDiv = document.createElement('div');
		correctAnswerDiv.className = 'correct-answer';
		
		const labelSpan = document.createElement('span');
		labelSpan.className = 'answer-label';
		labelSpan.textContent = '✅ Answer : ';
		
		const answerTextSpan = document.createElement('span');
		answerTextSpan.textContent = correctAnswerText;
		
		correctAnswerDiv.appendChild(labelSpan);
		correctAnswerDiv.appendChild(answerTextSpan);
		answerContainer.appendChild(correctAnswerDiv);
		
		// assemble question card
		questionDiv.appendChild(numberSpan);
		questionDiv.appendChild(questionTextDiv);
		questionDiv.appendChild(answerContainer);
		
		resultsContainer.appendChild(questionDiv);
	});
	
	// ----- 3. Action buttons container -----
	const actionDiv = document.createElement('div');
	actionDiv.className = 'action-buttons';
	
	// Retake Quiz Button
	const retakeBtn = document.createElement('button');
	retakeBtn.className = 'btn btn-primary';
	retakeBtn.textContent = 'Straight to Teaser.';
	retakeBtn.setAttribute('aria-label', 'Restart the quiz and reset timer');
	
	// Next Lesson Button (placeholder behavior)
	const nextBtn = document.createElement('button');
	nextBtn.className = 'btn btn-secondary';
	nextBtn.textContent = '➡️ Next Lesson';
	nextBtn.setAttribute('aria-label', 'Proceed to next lesson (simulated)');
	
	// add buttons
	actionDiv.appendChild(retakeBtn);
	//actionDiv.appendChild(nextBtn);
	
	// Append all sections to gameSection
	gameSection.appendChild(resultsHeader);
	gameSection.appendChild(resultsContainer);
	gameSection.appendChild(actionDiv);
	
	// ----- store reference to time-display for timer updates (optional but clean)
	const updatedScoreDisplay = gameSection.querySelector('.time-display');
	if (updatedScoreDisplay) {
		currentScoreDisplayElement = updatedScoreDisplay;
	}
	
	// --- attach event listeners for buttons ---
	// Retake logic: stop current timer, rebuild UI from scratch, restart timer.
	retakeBtn.addEventListener('click', () => {
		// stop any ongoing timer to avoid double calls
		stopLessonTimer();
		retakeQuestons(); //using this Instead of initializeQuiz() for the sake or shuffle only
		mainContentTop();
	});
	
	// Next lesson: just a placeholder as per requirement (no navigation defined)
	// But we keep functional: alert, or could be extended. The spec doesn't specify.
	/*nextBtn.addEventListener('click', () => {
		// polite placeholder message; you can replace with actual logic.
		// This does NOT interfere with timer.
		if (typeof nextLessonHandler === 'function') {
			nextLessonHandler();
		} else {
			// default user-friendly hint
			alert("✨ Next lesson would load here. Keep up the great focus!");
		}
	});*/
}
function initializeLessonTut(){
	buildQuizUI();      // generate all dynamic HTML from shuffledQuestions
	startLessonTimer("lesson");       // begin 60-second countdown (global timerDuration)
}

/********************************HELPER FUNCTIONS*******************************/
function globalAudioFunc(audioSound) {
	stopAllAudio();
    // 1. Validation: If undefined/null, handle gracefully (or throw error)
    if (!audioSound) {
        console.error("Audio source is undefined.");
        // Decide logic here: Do you want to skip if file is missing, or break?
        // Assuming we treat missing file as an error -> show modal
        lastAttemptedAudio = audioSound;
        //networkModal.show();
        return;
    }

    // Update the last attempted audio for retry logic
    lastAttemptedAudio = audioSound;
    
    // Create Audio Object
    let audio = new Audio("./ledphoney/" + audioSound);
    activeAudioList.push(audio);

    // 2. Success Handler (Ended)
    audio.addEventListener('ended', () => {
        const index = activeAudioList.indexOf(audio);
        if (index !== -1) activeAudioList.splice(index, 1);
        
        // Clear last attempt on success
        lastAttemptedAudio = null; 
        
    });

    // 3. Error Handler (Network/Loading issues)
    audio.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        //handleAudioFailure(audio);
    });

    // 4. Play Attempt
    // We explicitly check if play() fails (e.g., autoplay blocks or network during load)
    var playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error('Play execution failed:', error);
            //handleAudioFailure(audio);
        });
    }
}
function stopAllAudio() {
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach(element => {
        if (!element.paused) {
            element.pause();
            element.currentTime = 0;
        }
    });

    activeAudioList.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    activeAudioList = [];
}

function clearLocalStroage(){
	if (localStorage.getItem('attenquestionsets')) {
	  localStorage.removeItem('attenquestionsets');
	}
}
// Function to shuffle an array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function mainContentTop(){
	/*const mainContent = document.querySelector('.main-content');
	mainContent.scrollTop = 0;*/
	const mainContent = document.querySelector('.main-content');
mainContent.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
});
}

const toastEl = document.querySelector('.toast');
const toast = new bootstrap.Toast(toastEl, {
  autohide: true, 
  delay: 5000 
});

function showToast(message, type="success") {
  document.getElementById('toastBody').innerHTML = `<i class="fa fa-info-circle"></i> ${message}`;
  
  const toastElement = document.querySelector('.toast');
  toastElement.classList.remove('vbg-success', 'bg-danger');
  if (type === 'success') {
    toastElement.classList.add('vbg-success');
  } else if (type === 'error') {
    toastElement.classList.add('bg-danger');
  } else if (type === 'info') {
    toastElement.classList.add('bg-info');
  }
  
  toast.show();
}
function logout(){
	const expires = new Date();
    expires.setFullYear(1969, 0, 1);
	document.cookie = `fusionnet= 0; expires=${expires.toUTCString()}; path=/`;
	document.cookie = `selebratnet= 0; expires=${expires.toUTCString()}; path=/`;
	window.location.reload();
}
function removeCookies(){
	const expires = new Date();
    expires.setFullYear(1969, 0, 1);
	document.cookie = `fusionnet= 0; expires=${expires.toUTCString()}; path=/`;
	document.cookie = `selebratnet= 0; expires=${expires.toUTCString()}; path=/`;
}