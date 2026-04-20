/* ========== Form Validation and Submission ========== */
function validateAndSubmit() {
	const question = document.getElementById('question').value.trim();
	const option1 = document.getElementById('option1').value.trim();
	const option2 = document.getElementById('option2').value.trim();
	const option3 = document.getElementById('option3').value.trim();
	const option4 = document.getElementById('option4').value.trim();
	const answer = document.getElementById('answer').value;
	
	if (!question) {
		alert('Please enter a question.');
		return;
	}
	
	if (!option1 || !option2 || !option3 || !option4) {
		alert('Please fill in all options.');
		return;
	}
	
	if (!answer) {
		alert('Please select the correct answer.');
		return;
	}
	
	// Form is valid, you can submit it
	alert('Form submitted successfully!');
	console.log({
		question: question,
		option1: option1,
		option2: option2,
		option3: option3,
		option4: option4,
		answer: answer
	});
}

/* ========== Reset Form Function ========== */
function resetForm() {
	if (confirm('Are you sure you want to reset the form?')) {
		document.getElementById('quizForm').reset();
		addAutoResizeReset();
	}
}

/* ========== Initialize on Page Load ========== */
document.addEventListener('DOMContentLoaded', function() {
	// Prevent default back button behavior for demo
	document.querySelector('.back-button').addEventListener('click', function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to go back? All progress will be lost.')) {
			window.history.back();
		}
	});
});
addAutoResize()
function addAutoResize() {
  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    var offset = element.offsetHeight - element.clientHeight;
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
    });
    element.removeAttribute('data-autoresize');
  });
}

function addAutoResizeReset() {
  document.querySelectorAll('textarea').forEach(function (element) {
	element.style.height = '0px';
  });
}

function questionFormReset(){
	//document.getElementById("quizForm").reset();
	document.getElementById("multirecipient")
	addAutoResizeReset();
}