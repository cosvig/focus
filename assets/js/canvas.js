var questionsdata = "";
var myModal = new bootstrap.Modal(document.getElementById('qModal'))
var mainScrContent = document.querySelector('.main-content');
var currentPageScroll = 0;
var lasPageScroll = 0;

var allgroups = '';
var currentstudysessions = '';
var focusGroupUID = '';
var fgStudySection = '';
//var saveToggleAR = 1; //to avoid hiting saveQtoCloud(); twices;
mainScrContent.addEventListener('scroll', () => {
  currentPageScroll = mainScrContent.scrollTop;
});
document.addEventListener('DOMContentLoaded', function() {
	//questionsdata = JSON.parse(localStorage.getItem('attenquestionsets')) || "";
	//console.log(questionsdata)
	//console.log(JSON.stringify(questionsdata))
	groupslisting();
});

/*********************LIST GROUPS FUNCTION***************************/
function groupslisting(){
	let vmgvmbmvlzwj  = "vmgvmbmvlzwj";	
	$.ajax({
		type: "POST",
		url: "./saintmophines/api/", 
		dataType: "json",
		data: {vmgvmbmvlzwj: vmgvmbmvlzwj},
		success: function(result){
			allgroups = result;
			initFocusGroups();
			
			showToast('Group has been loaded', 'success');
		},error : function(jqXHR, textStatus, errorThrown) {
			showToast('Please Refresh. An error occured', 'error');
	 }
  });
}
function escapeHtml(str) {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
function renderGroupCards(groupsArray) {
	const container = document.getElementById('allfocusgrouplist');
	if (!container) return;

	// If no groups match the search -> display "not available" message
	if (!groupsArray || groupsArray.length === 0) {
		container.innerHTML = `
			<div class="no-results-message">
				<i class="fas fa-folder-open"></i> 
				The group you are searching for is not available.
			</div>
		`;
		return;
	}

	// Generate cards for each group (using groupFname as title, 0 files as count)
	const cardsHtml = groupsArray.map(group => {
		const safeName = escapeHtml(group.groupFname);
		const groupId = group.groupFxix;
		// "0 files" exactly as specification (all groups show 0 files)
		return `
			<div class="quick-access-card" data-group-id="${groupId}" data-group-name="${safeName}">
				<div class="quick-access-icon icon-blue">
					<i class="fas fa-users text-primary"></i>
				</div>
				<div class="quick-access-card-title">${safeName}</div>
				<div class="quick-access-card-count">0 files</div>
			</div>
		`;
	}).join('');

	container.innerHTML = cardsHtml;
	clickingFocusGroup();
}
function filterGroupsBySearchTerm(searchTerm) {
	if (!searchTerm || searchTerm.trim() === '') {
		// empty search -> return full list
		return allgroups.slice(); // return copy of original groups
	}
	const lowerTerm = searchTerm.trim().toLowerCase();
	return allgroups.filter(group => {
		const groupName = group.groupFname.toLowerCase();
		return groupName.includes(lowerTerm);
	});
}
function setupSearchListener() {
	const searchInput = document.getElementById('searchgroup');
	if (!searchInput) return;

	searchInput.addEventListener('input', function(e) {
		const query = e.target.value;
		const filtered = filterGroupsBySearchTerm(query);
		renderGroupCards(filtered);
	});
}

function initFocusGroups() {
	// Initially render full list of groups
	renderGroupCards(allgroups);
	// Attach event listener for real-time search
	setupSearchListener();
}
/*********************STUDY SESSION FUNCTION***************************/
function clickingFocusGroup(){
let quickAccessCard = document.querySelectorAll('.quick-access-card');
	quickAccessCard.forEach((item, index) => {
		item.addEventListener('click', function() {
		focusGroupUID = item.dataset.groupId;
		//focusGroupUID = allgroups.find(game => game.groupFxix == focusgroupdid);
			//document.getElementById("pageHeader").style.display = "";
			//document.getElementById("questionMain").style.display = "";
			document.getElementById("quickAcecess").style.display = "none";
			document.getElementById("groupPapers").style.display = "";
			enliststudyonsession()
		});
	});
}

function enliststudyonsession(){
	let sdtgvmbmvlzwj  = "sdtgvmbmvlzwj";	
	let focalgroup  = focusGroupUID;	
		$.ajax({
			type: "POST",
			url: "./saintmophines/api/", 
			dataType: "json",
			data: {sdtgvmbmvlzwj: sdtgvmbmvlzwj, focalgroup: focalgroup},
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
	let STUDYSLETTERS = `<div class="v-mb-10">
		<button id="createTextBook" class="btn btn-primary">Create</button>
		</div>
		<div  class="file-table-container">
		
			<table class="file-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Sharing</th>
						<th>Size</th>
						<th>Modified</th>
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
								<div class="v-flex-column-g10">
								<i data-file-no="${item.study}" class="fas fa-plus file-icon folder-icon v-click"></i>
								<i data-pencil-no="${item.study}" class="fas fa-pencil file-icon pencil-icon v-click"></i>
								</div>
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
						<td>1.2 MB</td>
						<td>Yesterday</td>
					</tr>
		`;
		});
		STUDYSLETTERS += `			
				</tbody>
			</table>
		</div>`;
	document.getElementById('groupPapers').innerHTML = STUDYSLETTERS;
	document.getElementById('createTextBook').addEventListener('click', function() {
		document.getElementById("groupPapers").style.display = "none";
		document.getElementById("textBookInov").style.display = "";
		studyHandelers()
	});
	document.querySelectorAll('.folder-icon').forEach(folder => {
	folder.addEventListener('click', function(e) {
		
		let studyNumbo = e.currentTarget.dataset.fileNo;
		
		let paperrim = '';
		let paperTextbook = '';
		let paperTextacc = '';
		let paperTextdescr = '';
		let studyIDX = '';
		let paperIDX = 0;
		let oldnew = 'newPuntPaper';
		currentstudysessions.forEach(jime => {
			if(jime.focusG == focusGroupUID && jime.study == studyNumbo){
				paperTextbook = jime.textbook;
				paperTextacc = jime.textbookabbr;
				paperTextdescr = jime.textbookdescribe;
				studyIDX = jime.study;
			}
		});
		//console.log("File Number", e.currentTarget.dataset.fileNo);
		fullconstructpaper(paperrim, paperTextbook, paperTextacc, paperTextdescr, studyIDX, paperIDX, oldnew);
		
		});
	});
	document.querySelectorAll('.pencil-icon').forEach(folder => {
	folder.addEventListener('click', function(e) {
		
		let studyNumbo = e.currentTarget.dataset.pencilNo;
		
		let paperrim = '';
		let paperTextbook = '';
		let paperTextacc = '';
		let paperTextdescr = '';
		let studyIDX = '';
		let paperIDX = 0;
		let oldnew = 'editPuntStudy';
		currentstudysessions.forEach(jime => {
			if(jime.focusG == focusGroupUID && jime.study == studyNumbo){
				paperTextbook = jime.textbook;
				paperTextacc = jime.textbookabbr;
				paperTextdescr = jime.textbookdescribe;
				studyIDX = jime.study;
			}
		});
		//console.log("Paper Number", e.currentTarget.dataset.pencilNo);
		fullconstructpaper(paperrim, paperTextbook, paperTextacc, paperTextdescr, studyIDX, paperIDX, oldnew);
		editstudyHandeler();
		});
	});
	document.querySelectorAll('.sharing-badge').forEach(span => {
	span.addEventListener('click', function(e) {
		// use currentTarget, not target, because you might click the <i>
		let studyNumbo = e.currentTarget.dataset.studyNo;
		let paperNumbo = e.currentTarget.dataset.paperNo;
		
		let paperrim = '';
		let paperTextbook = '';
		let paperTextacc = '';
		let paperTextdescr = '';
		let studyIDX = '';
		let paperIDX = '';
		let oldnew = 'old';
		currentstudysessions.forEach(zitem => {
			if(zitem.focusG == focusGroupUID && zitem.study == studyNumbo){
				let papersG = zitem.papers;
				let papersGLenght = papersG.length;
				for(let i=0;i<papersGLenght;i++){
					let PSpaperNO = papersG[i].SuPapper;
					if(PSpaperNO == paperNumbo){
						paperrim = papersG[i].SuMeta;
						paperTextbook = zitem.textbook;
						paperTextacc = zitem.textbookabbr;
						paperTextdescr = zitem.textbookdescribe;
						studyIDX = papersG[i].SuStudy;
						paperIDX = papersG[i].SuPapper;
					}
				}
			}
		});
		
		//console.log("focusGroupUID", focusGroupUID);
		//console.log("Study Number", e.currentTarget.dataset.studyNo);
		//console.log("Paper Number", e.currentTarget.dataset.paperNo);
		fullconstructpaper(paperrim, paperTextbook, paperTextacc, paperTextdescr, studyIDX, paperIDX, oldnew)
	  });
	});
}
function fullconstructpaper(papers, textbook, txtabbr, description, studyZX, paperZX, sPGT){
	 
	var studySectionNew = {
		studyPGT: sPGT,
		studyFocusGroup: focusGroupUID,
		studySessUID: studyZX,
		studyBookUID: paperZX,
		studyTextbookname: textbook,
		studyTextbookacn: txtabbr,
		studyTextbookdescription: description
	};
	fgStudySection = studySectionNew;
	if(sPGT == "old"){
		localStorage.setItem('attenquestionsets', papers)
		questionsdata = JSON.parse(localStorage.getItem('attenquestionsets')) || "";
	}else if(sPGT == "newPuntPaper"){
		questionsdata = "";
	}else if(sPGT == "editPuntStudy"){
		questionsdata = "";
		console.log("fgStudySection", fgStudySection)
		
		return;
	}
	console.log("fgStudySection", fgStudySection)
	textBookSession();
}
function nostudyonsession(){
	let STUDYSLETTERS = `<div class="v-mb-10">
		<button id="createTextBook" class="btn btn-primary">Create</button>
		</div>
		<h2 class="section-title">You don't have a current study session yet.</h2> `;
	document.getElementById('groupPapers').innerHTML = STUDYSLETTERS;
	document.getElementById('createTextBook').addEventListener('click', function() {
		document.getElementById("groupPapers").style.display = "none";
		document.getElementById("textBookInov").style.display = "";
		studyHandelers()
	});
}
function editstudyHandeler(){
	console.log("got to edit handler")
	document.getElementById("groupPapers").style.display = "none";
	document.getElementById("textBookInov").style.display = "";
	
	document.getElementById("textbookname").value = fgStudySection.studyTextbookname;
	document.getElementById("textbookacn").value = fgStudySection.studyTextbookacn;
	document.getElementById("textbookdescription").value = fgStudySection.studyTextbookdescription;
	
	document.getElementById('resetstudyform').addEventListener('click', function() {
		resetStudyForm(event);
	});
	document.getElementById('textBookForm').addEventListener('submit', function() {
		handleEditStudyFormSubmit(event);
	});
}

function studyHandelers(){
	document.getElementById('resetstudyform').addEventListener('click', function() {
		resetStudyForm(event);
	});
	document.getElementById('textBookForm').addEventListener('submit', function() {
		handleStudyFormSubmit(event);
	});
}
function resetStudyForm(){
	event.preventDefault();
	document.getElementById('textBookForm').reset();
	addAutoResizeReset();
}

function validateStudyForm() {
	// Validate Focus Group Name
	const textbookname = document.getElementById('textbookname').value.trim();
	if (!textbookname) {
		showToast('Please Enter Book Name.', 'error');
		return false;
	}else if(textbookname.length < 3){
		showToast('Book Name Is Too Short', 'error');
		return false;
	}
	const textbookacn = document.getElementById('textbookacn').value.trim();
	if (!textbookacn) {
		showToast('Please Enter Book Code/Acronym.', 'error');
		return false;
	}else if(textbookacn.length < 2){
		showToast('Book Code/Acronym Is Too Short', 'error');
		return false;
	}
	const textbookdescription = document.getElementById('textbookdescription').value.trim();
	if (!textbookdescription) {
		showToast('Please Enter Book Description.', 'error');
		return false;
	}else if(textbookdescription.length < 10){
		showToast('Book Description Is Too Short', 'error');
		return false;
	}
	return true;
}
function handleStudyFormSubmit(event) {
	event.preventDefault();
	const textbookname = document.getElementById('textbookname');
	const textbookacn = document.getElementById('textbookacn');
	const textbookdescription = document.getElementById('textbookdescription');
	if (validateStudyForm()) {
		var studySectionNew = {
			studyPGT: "new",
			studyFocusGroup: focusGroupUID,
			studySessUID: 0,
			studyBookUID: 0,
			studyTextbookname: textbookname.value.trim(),
			studyTextbookacn: textbookacn.value.trim(),
			studyTextbookdescription: textbookdescription.value.trim()
		};
		fgStudySection = studySectionNew;
		showToast('Study Session Submitted');
		textBookSession();
	}
}

function handleEditStudyFormSubmit(event) {
	event.preventDefault();
	console.log("got to edit server")
	const textbookname = document.getElementById('textbookname');
	const textbookacn = document.getElementById('textbookacn');
	const textbookdescription = document.getElementById('textbookdescription');
	
	
	if (validateStudyForm()) {
		var studySectionNew = {
			studyPGT: fgStudySection.studyPGT,
			studyFocusGroup: focusGroupUID,
			studySessUID: fgStudySection.studySessUID,
			studyBookUID: 0,
			studyTextbookname: textbookname.value.trim(),
			studyTextbookacn: textbookacn.value.trim(),
			studyTextbookdescription: textbookdescription.value.trim()
		};
		fgStudySection = studySectionNew;
		showToast('Study Session Submitted');
		saveQtoCloud();
		
		
		//document.getElementById('saveQuestionToCloud').click();
	}
}
function clearLocalStroage(){
	if (localStorage.getItem('attenquestionsets')) {
	  localStorage.removeItem('attenquestionsets');
	}
}
function textBookSession(studysession){
	
	//console.log(studysession);
	document.getElementById("groupPapers").style.display = "none";
	document.getElementById("textBookInov").style.display = "none";
	document.getElementById("pageHeader").style.display = "";
	document.getElementById("questionMain").style.display = "";
	rowQuestionCreate(); //Show the right newQuesions Headers
    // Set initial active state for 4 options
    document.getElementById('kr2').classList.remove('active');
	document.getElementById('kr2').innerHTML = '2 Options';
    document.getElementById('kr3').classList.remove('active');
	document.getElementById('kr3').innerHTML = '3 Options';
    document.getElementById('kr4').classList.add('active');
    document.getElementById('kr4').innerHTML = '4 Options <i class="fa fa-check-square "></i>';
	updateOptionCount(4); //setting the option 1 to 4. option 4 is default
	
	clearLocalStroage();
	
	if(questionsdata !== ""){
		document.getElementById('qtListings').innerText = questionsdata.qdata.length;
	}
	// Prevent default back button behavior for demo
	/*document.querySelector('.back-button').addEventListener('click', function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to go back? All progress will be lost.')) {
			window.history.back();
		}
	});*/
	const questionTexts = document.querySelectorAll('.question-text');
    
    questionTexts.forEach(textElement => {
        const length = textElement.textContent.length;
        let fontSize;
        
        if (length > 200) fontSize = '0.8125rem'; // 13px
        else if (length > 120) fontSize = '0.875rem'; // 14px
        else if (length > 60) fontSize = '1rem'; // 16px
        else fontSize = '1.125rem'; // 18px
        
        textElement.style.fontSize = fontSize;
        textElement.style.transition = 'font-size 0.3s ease';
    });
    
    // Add validation to quizForm submit button
    document.getElementById('quizForm').addEventListener('submit', function(e) {
        e.preventDefault();
        validateAndSubmit();
    });
}

document.getElementById('backQList').addEventListener('click', function() {
	backToStudyList();
});
function backToStudyList(){
	enliststudyonsession();
		questionsdata = "";
		document.getElementById('qtListings').innerHTML = "0";
		document.getElementById('pageHeader').style.display = "none";
		document.getElementById('quickAcecess').style.display = "none";
		document.getElementById('groupPapers').style.display = "";
		document.getElementById('textBookInov').style.display = "none";
		document.getElementById('questionListMainTab').innerHTML = `<section class="question-card-header" id="questionListMain" >
			<div class="question-card">
                <p class="question-text">No questions available at the moment. Add Questions</p> 
           </div>
		</section>`;
		document.getElementById('questionListMainTab').style.display = "none";
		document.getElementById('addMDQuestionMain').style.display = "none";
		document.getElementById('editQuestionMain').style.display = "none";
		document.getElementById('questionMain').style.display = "none";
}
/*********************QUESTION CRUD FUNCTION***************************/
var questionsOptions = ["option1", "option2", "option3", "option4"];
var editOptions = [];
var editQuestionId = "";
function saveToStorage() {
	localStorage.setItem('attenquestionsets', JSON.stringify(questionsdata));
	blickCloudSaving()
}
function blickCloudSaving(){
	let saveQuestionToCloud = question = document.getElementById('saveQuestionToCloud');
	saveQuestionToCloud.style.display = "";
	saveQuestionToCloud.classList.add('v-blinking');
}
document.getElementById('saveQuestionToCloud').addEventListener('click', function() {
	saveQtoCloud();
});
function validateAndSubmit() {
    const question = document.getElementById('question').value.trim();
    const answer = document.getElementById('answer').value;
   
    if (!question) {
        showToast('Please enter a question.', 'error');
        return;
    }
   
    // Check if any option has a value length < 5
    const invalidOption = questionsOptions.some(function(item) {
        const optionValue = document.getElementById(item).value.trim();
        return optionValue.length < 1;
    });
   
    if (invalidOption) {
        //alert('Each option must be at least 5 characters long.');
        showToast("Each option must be not be empty.", "error");
        return;
    }
   
    if (!answer) {
        showToast('Please select the correct answer.', 'error');
        return;
    }
   
    // Form is valid, you can submit it
    showToast('Question Submitted!');
   
    // Console log all form values
    const formData = {
        question: question,
        answer: answer,
        options: {},
        questionID: Date.now().toString(),
        optRandom: "yes",
        timeCreated: new Date().toISOString(),
        timeUpdated: ""
    };
   
    questionsOptions.forEach(function(item) {
        formData.options[item] = document.getElementById(item).value.trim();
    });
   
    // Check if questionsdata is empty
    if (questionsdata === "") {
        // Create new data structure
        questionsdata = {
            qtID: Date.now().toString(),
            saved: "no",
            qdata: [formData],
            qutRandom: "yes",
            logs: {}
        };
		document.getElementById('qtListings').innerText = questionsdata.qdata.length;
    } else {
        questionsdata.qdata.push(formData);
		document.getElementById('qtListings').innerText = questionsdata.qdata.length;
    }
   
	resetForm()
	saveToStorage()
	
	mainContentTop()
}
function displayQuestions() {
    //const questionListMain = document.getElementById("questionListMain");
    //questionListMain.innerHTML = "";
	if(questionsdata == ""){
		showToast('No questions available at the moment. Add Questions', 'info');
		return;
	}
	
	//SEARCH
	// Get the main section element by its ID
		let questionListMainTab = document.getElementById("questionListMainTab");
		questionListMainTab.innerHTML = "";

		// Create the search-section div
		let searchSection = document.createElement("section");
		searchSection.className = "search-section";

		// Create the search-container div
		let searchContainer = document.createElement("div");
		searchContainer.className = "search-container";

		// Create the search-input-wrapper div
		let searchInputWrapper = document.createElement("div");
		searchInputWrapper.className = "search-input-wrapper";

		// Create the input element
		let input = document.createElement("input");
		input.type = "text";
		input.id = "questionSearch";
		input.className = "search-input";
		input.placeholder = "Search questions, options, or answers...";

		// Create the search icon
		let searchIcon = document.createElement("i");
		searchIcon.className = "fa fa-search search-icon";

		// Create the clear icon
		let clearIcon = document.createElement("i");
		clearIcon.className = "fa fa-times-circle clear-icon";
		clearIcon.id = "clearSearch";

		// Append the input and icons to the search-input-wrapper
		searchInputWrapper.appendChild(input);
		searchInputWrapper.appendChild(searchIcon);
		searchInputWrapper.appendChild(clearIcon);

		// Append the search-input-wrapper to the search-container
		searchContainer.appendChild(searchInputWrapper);

		// Append the search-container to the search-section
		searchSection.appendChild(searchContainer);
		
		let questionListMain = document.createElement("section");
		questionListMain.className = "question-card-header";
		questionListMain.id = "questionListMain"

		// Finally, append the search-section to the questionListMain section
		questionListMainTab.appendChild(searchSection);
		questionListMainTab.appendChild(questionListMain);
	
	//QUESTIONS
		questionsdata.qdata.forEach(item => {
        const questionCardDiv = document.createElement("div");
        questionCardDiv.className = "question-card";
        
        const questionText = document.createElement("div");
        questionText.className = "question-text";
        questionText.textContent = item.question;
		
		const iconDiv = document.createElement("div");
        iconDiv.className = "qustion-icons";
        
        const editIcon = document.createElement("i");
        editIcon.className = "fa fa-pencil-square";
		editIcon.addEventListener("click", function() {
			editQuestion(item.questionID)
		});
		
		const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa fa-trash";
		deleteIcon.addEventListener("click", function() {
			myModal.show()
			document.getElementById("qModalLabel").innerHTML = `<i class="fa fa-trash"></i> Are you sure you want to delete this Question?`;
			document.getElementById("qModalBody").innerHTML = item.question;
			document.getElementById("trashQuestion").addEventListener("click", function() {
				deleteQuestion(item.questionID)
			});
		});
        
        questionCardDiv.appendChild(questionText);
		
		iconDiv.appendChild(editIcon);
		iconDiv.appendChild(deleteIcon);
		
        questionCardDiv.appendChild(iconDiv);
        questionListMain.appendChild(questionCardDiv);
    });
	
	initializeSearch();
}
// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('questionSearch');
    const clearIcon = document.getElementById('clearSearch');
    
    // Hide clear icon initially
    clearIcon.style.opacity = '0';
    clearIcon.style.pointerEvents = 'none';
    
    // Add event listener for search input
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        // Show/hide clear icon based on input
        if (searchTerm.length > 0) {
            clearIcon.style.opacity = '1';
            clearIcon.style.pointerEvents = 'auto';
        } else {
            clearIcon.style.opacity = '0';
            clearIcon.style.pointerEvents = 'none';
        }
        
        // Filter and display questions
        filterAndDisplayQuestions(searchTerm);
    });
    
    // Add event listener for clear button
    clearIcon.addEventListener('click', function() {
        searchInput.value = '';
        clearIcon.style.opacity = '0';
        clearIcon.style.pointerEvents = 'none';
        
        // Display all questions
        filterAndDisplayQuestions('');
    });
}
// Filter questions based on search term
function filterAndDisplayQuestions(searchTerm) {
    const questionListMain = document.getElementById('questionListMain');
    questionListMain.innerHTML = "";
    
    // If no search term, display all questions
    if (!searchTerm) {
        displayAllQuestions();
        return;
    }
    
    // Filter questions based on search term
    const filteredQuestions = questionsdata.qdata.filter(function(item) {
        // Search in question text
        const questionMatch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Search in options
        let optionsMatch = false;
        for (const key in item.options) {
            if (item.options[key].toLowerCase().includes(searchTerm.toLowerCase())) {
                optionsMatch = true;
                break;
            }
        }
        
        // Search in answer (get the actual answer text)
        let answerText = '';
        if (item.options[item.answer]) {
            answerText = item.options[item.answer].toLowerCase();
        }
        const answerMatch = answerText.includes(searchTerm.toLowerCase());
        
        // Return true if any field matches
        return questionMatch || optionsMatch || answerMatch;
    });
    
    // Display filtered questions
    filteredQuestions.forEach(function(item) {
        createQuestionCard(item);
    });
    
    // Show "no results" message if no matches found
    if (filteredQuestions.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.innerHTML = '<i class="fa fa-search"></i> No questions found matching "' + searchTerm + '"';
        questionListMain.appendChild(noResultsDiv);
    }
}

// Display all questions (original function logic)
function displayAllQuestions() {
    questionsdata.qdata.forEach(function(item) {
        createQuestionCard(item);
    });
}

// Create individual question card (extracted from original displayQuestions)
function createQuestionCard(item) {
    const questionCardDiv = document.createElement('div');
    questionCardDiv.className = 'question-card';
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = item.question;
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'qustion-icons';
    
    const editIcon = document.createElement('i');
    editIcon.className = 'fa fa-pencil-square';
    editIcon.addEventListener('click', function() {
        editQuestion(item.questionID);
    });
    
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash';
    deleteIcon.addEventListener('click', function() {
        myModal.show();
        document.getElementById('qModalLabel').innerHTML = '<i class="fa fa-trash"></i> Are you sure you want to delete this Question?';
        document.getElementById('qModalBody').innerHTML = item.question;
        document.getElementById('trashQuestion').addEventListener('click', function() {
            deleteQuestion(item.questionID);
        });
    });
    
    questionCardDiv.appendChild(questionText);
    
    iconDiv.appendChild(editIcon);
    iconDiv.appendChild(deleteIcon);
    
    questionCardDiv.appendChild(iconDiv);
    document.getElementById('questionListMain').appendChild(questionCardDiv);
}

function deleteQuestion(id){
	const index = questionsdata.qdata.findIndex(q => q.questionID === id);
	// Remove it if found
	if (index !== -1) {
	  questionsdata.qdata.splice(index, 1);
	  showToast('Question Deleted!');
		saveToStorage()
	  document.getElementById('qtListings').innerText = questionsdata.qdata.length;
	  displayQuestions();
	  myModal.hide()
	}
}
function editQuestion(id) {
    let currentQuestion = questionsdata.qdata;
	editQuestionId = id;
    let faaj = currentQuestion.find(bsmh => bsmh.questionID == id); 
    
    // Extract properties directly (no arrays)
    let question = faaj ? faaj.question : undefined;
    let answer = faaj ? faaj.answer : undefined;
    let options = faaj ? faaj.options : undefined;
    let questionID = faaj ? faaj.questionID : undefined;
    let optRandom = faaj ? faaj.optRandom : undefined;
    let timeCreated = faaj ? faaj.timeCreated : undefined;
    let timeUpdated = faaj ? faaj.timeUpdated : undefined;
	let optionsArr = Object.values(options);
    
	

	lasPageScroll = currentPageScroll;
	rowQuestionEdit()
	mainContentTop()
	
	let nameO = 1;
	let idO = 1;
	let labO = 1;
	let forO = 1;
	let PlO = 1;
	let selO = 1;
	let opO = 1;
	let lgO = 1;
	
	let nio = 1;
	editOptions = [];
	optionsArr.forEach(function(item) {
		editOptions.push("editoption"+nio++);
	});
	//console.log(editOptions)
	let QUE = `<div class="card viva-bg-bd-none v-mb-10">
			<div class="card-body viva-flex viva-jsb">
				<button id="editBack" class="v-circle-button">
					<i class="fas fa-arrow-left"></i>
				</button>
				<button id="editDelete" class="v-circle-button">
					<i class="fas fa-trash"></i>
				</button>
			</div>
			</div>
	
	<div class="form-container">
        <div class="viva-header canvas">
		
            <div class="form-card">
                <form name="quizEditForm" id="quizEditForm">
                    <div class="form-group">
                        <label for="editquestion" class="form-label text-danger">Question:</label>
                        <textarea data-autoresize name="editquestion" id="editquestion" class="form-textarea vform vdanger" placeholder="Enter your question here..." required>${question}</textarea>
                    </div>`;
					
		optionsArr.forEach(function(item) {
			QUE += `<div class="form-group">
                        <label for="option${forO++}" class="form-label">Option ${labO++}:</label>
                        <textarea data-autoresize name="editoption${nameO++}" id="editoption${idO++}" class="form-textarea" placeholder="Enter option ${PlO++}..." required>${item}</textarea>
                    </div>`;
		});
			QUE += `
                    <div class="form-group">
                        <label for="answer" class="form-label vtext-success">Correct Answer:</label>
                        <select name="editeditanswer" id="editanswer" class="form-select" required>
                            <option value="">Select correct answer...</option>`;
							
		optionsArr.forEach(function(item) {
			let lll = "option"+lgO++;
			let selects = "";
			if(answer == lll){ selects = "selected";}
			QUE += `    <option value="option${selO++}" ${selects}>Option ${opO++}</option>`;
		});
			QUE += `
                        </select>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Spacer for fixed bottom bar on mobile -->
        <div class="content-spacer"></div>
        
        <!-- Bottom Action Bar -->
        <div class="action-bar">
            <button id="resetEditform" class="action-button">
                <i class="fas fa-plus"></i>
                <span>New</span>
            </button>
            <button id="submitEditform" class="action-button">
                <i class="fas fa-paper-plane"></i>
                <span>Submit</span>
            </button>
        </div>
    </div>`;
	
	
	document.getElementById('editQuestionMain').innerHTML = QUE;
	document.getElementById('submitEditform').addEventListener('click', function() {
		validateSubmitEdit()
	});
	document.getElementById('resetEditform').addEventListener('click', function() {
		rowQuestionCreate();
		mainContentTop();
	});
	
	document.getElementById('editBack').addEventListener('click', function() {
		rowQuestionList()
		mainScrContent.scrollTo(0, lasPageScroll + 0);
	});
	
	document.getElementById('editDelete').addEventListener('click', function() {
		myModal.show()
			document.getElementById("qModalLabel").innerHTML = `<i class="fa fa-trash"></i> Are you sure you want to delete this Question?`;
			document.getElementById("qModalBody").innerHTML = question;
			document.getElementById("trashQuestion").addEventListener("click", function() {
				deleteQuestion(id)
				rowQuestionList()
				mainScrContent.scrollTo(0, lasPageScroll + 0);
			});
	});

}

function validateSubmitEdit() {
    const question = document.getElementById('editquestion').value.trim();
    const answer = document.getElementById('editanswer').value;
   
    if (!question) {
        showToast('Please enter a question.', 'error');
        return;
    }
   
    const invalidOption = editOptions.some(function(item) {
        const optionValue = document.getElementById(item).value.trim();
        return optionValue.length < 1;
    });
   
    if (invalidOption) {
        //alert('Each option must be at least 5 characters long.');
        showToast("Each option must be not be empty.", "error");
        return;
    }
   
    if (!answer) {
        showToast('Please select the correct answer.', 'error');
        return;
    }
   
    const formData = {
        question: question,
        answer: answer,
        options: {},
        timeUpdated: new Date().toISOString()
    };
   
    editOptions.forEach(function(item) {
		let optionRename = item;
		optionRename = optionRename.replace("edit", "")
        formData.options[optionRename] = document.getElementById(item).value.trim();
    });
	
	// Find the question index with the specific questionID and update it
	let questionIndex = questionsdata.qdata.findIndex(function(question) {
		return question.questionID === editQuestionId;
	});
	
	if (questionIndex !== -1) {
		// Merge the existing question data with the new form data
		questionsdata.qdata[questionIndex] = {
			...questionsdata.qdata[questionIndex],  // Keep all existing properties
			...formData                             // Override with new values
		};
		showToast('Question Updated!');
		saveToStorage()
		rowQuestionList()
		mainScrContent.scrollTo(0, lasPageScroll + 0);
	}else {
		showToast("Question not found.", "error");
	}
}

document.getElementById("submitMDform").addEventListener("click", function (e) {
    e.preventDefault();

    const mdText = document.getElementById("mdquestion").value.trim();

    const errors = [];

    if (!mdText) {
        return showToast("Error: The markdown textarea is empty.", "error");
    }

    const lines = mdText
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    // Must have at least header + separator + 1 row
    if (lines.length < 3) {
        return showToast("Error: The Markdown table is incomplete. It must include a header, a separator row, and at least one question row.", "error");
    }

    // Validate header
    const header = lines[0].toLowerCase();
    const expectedHeaders = ["question", "answer", "option1", "option2", "option3", "option4"];

    expectedHeaders.forEach(h => {
        if (!header.includes(h)) {
            errors.push(`Missing header: "${h}"`);
        }
    });

    if (errors.length > 0) {
        return showToast("Header Errors:\n" + errors.join("\n"), "error");
    }

    // Separator row must contain --- at least 6 times
    if (!lines[1].includes("---")) {
        return showToast('Error: The Markdown table separator row (|---|---|...) is missing or incorrect.', 'error');
    }

    const contentLines = lines.slice(2); // data rows

    const results = [];

    contentLines.forEach((line, index) => {
        const rowNumber = index + 1; // for user-friendly messages

        // Ensure row has pipes
        if (!line.includes("|")) {
            errors.push(`Row ${rowNumber}: Missing "|" characters.`);
            return;
        }

        // Split and clean parts
        const parts = line
            .split("|")
            .map(p => p.trim())
            .filter(Boolean);

        // Must have exactly 6 columns
        if (parts.length !== 6) {
            errors.push(`Row ${rowNumber}: Expected 6 columns but found ${parts.length}.`);
            return;
        }

        const [question, answer, opt1, opt2, opt3, opt4] = parts;

        // Validate mandatory fields
        if (!question) errors.push(`Row ${rowNumber}: "question" cannot be empty.`);
        if (!answer) errors.push(`Row ${rowNumber}: "answer" cannot be empty.`);

        // Validate answer format (must be option1–option4)
        if (!["option1", "option2", "option3", "option4"].includes(answer)) {
            errors.push(`Row ${rowNumber}: Invalid answer value "${answer}". Must be option1, option2, option3, or option4.`);
        }

        // Validate options
        if (!opt1 || !opt2 || !opt3 || !opt4) {
            errors.push(`Row ${rowNumber}: All options must have values.`);
        }

        // If this row had errors, skip generating an object
        if (errors.length > 0) return;
		if (questionsdata === "") {
        // Create new data structure
			questionsdata = {
				qtID: Date.now().toString(),
				saved: "no",
				qdata: [],
				qutRandom: "yes",
				logs: {}
			};
			questionsdata.qdata.push({
				question,
				answer,
				options: {
					option1: opt1,
					option2: opt2,
					option3: opt3,
					option4: opt4
				},
				questionID: generateUniqueId(),
				optRandom: "yes",
				timeCreated: new Date().toISOString(),
				timeUpdated: ""
			});
		document.getElementById('qtListings').innerText = questionsdata.qdata.length;
		} else {
			questionsdata.qdata.push({
				question,
				answer,
				options: {
					option1: opt1,
					option2: opt2,
					option3: opt3,
					option4: opt4
				},
				questionID: generateUniqueId(),
				optRandom: "yes",
				timeCreated: new Date().toISOString(),
				timeUpdated: ""
			});
			document.getElementById('qtListings').innerText = questionsdata.qdata.length;
		}
    });

    // If errors happened, show them and stop
    if (errors.length > 0) {
        return showToast("Markdown Errors:\n\n" + errors.join("\n") , "error");
    }
	//console.log(questionsdata)
	
    //console.log(JSON.stringify(results, null, 2));
    showToast("Success! Your MarkDown Questions Has Been Submited.");
	
	saveToStorage()
	mainContentTop()
	resetMDForm()
});

function resetMDForm(){
	document.getElementById('quizMDForm').reset();
	addAutoResizeReset();
}

/*
//HIGH UNIQUENES
function generateHighlyUniqueId() { 
	const currentTimestamp = Date.now(); 
	if (currentTimestamp === lastTimestamp) { 
		sequence++; 
	} else { 
		lastTimestamp = currentTimestamp; sequence = 0; 
	} 
	const randomNumber = getRandomInt(1, 999); // A smaller random number for brevity 
	return `${currentTimestamp}${randomNumber}${sequence}`; 
}
allqs = { id: generateHighlyUniqueId(), saved: "no", };
*/
let counter = 0;
function generateUniqueId() {
    const timestamp = Date.now().toString();
    // Reset counter if the millisecond changes, or keep incrementing
    // For simplicity, let's just increment for now
    counter++;
    return timestamp + counter.toString();
}



// ========== Reset Form Function ========== 
document.getElementById('resetform').addEventListener('click', function() {
	resetForm();
	showToast("Form has been reset.", "info");
});

function resetForm(){
	document.getElementById('quizForm').reset();
	addAutoResizeReset();
}

// ========== Dynamic Option Management ========== 
// Function to update the number of visible options
function updateOptionCount(optionCount) {
    // Hide all option fields initially
    document.getElementById('option3').closest('.form-group').style.display = 'none';
    document.getElementById('option4').closest('.form-group').style.display = 'none';
    
    // Show the required number of options
    if (optionCount >= 2) {
        document.getElementById('option1').closest('.form-group').style.display = 'block';
        document.getElementById('option2').closest('.form-group').style.display = 'block';
		showToast('Updated to 2 options', 'info');
		questionsOptions = ["option1", "option2"];
    }
    if (optionCount >= 3) {
        document.getElementById('option3').closest('.form-group').style.display = 'block';
		showToast('Updated to 3 options', 'info');
		questionsOptions = ["option1", "option2", "option3"];
    }
    if (optionCount >= 4) {
        document.getElementById('option4').closest('.form-group').style.display = 'block';
		showToast('Updated to 4 options', 'info');
		questionsOptions = ["option1", "option2", "option3", "option4"];
    }
    
    // Update the answer dropdown options
    const answerSelect = document.getElementById('answer');
    answerSelect.innerHTML = '<option value="">Select correct answer...</option>';
    
    for (let i = 1; i <= optionCount; i++) {
        const option = document.createElement('option');
        option.value = `option${i}`;
        option.textContent = `Option ${i}`;
        answerSelect.appendChild(option);
    }
    
    // Reset the form to clear any previous selections
    resetForm();
	//console.log(questionsOptions)
}

// Add event listeners to the option count buttons
document.getElementById('kr2').addEventListener('click', function() {
    updateOptionCount(2);
	
    // Update active state
    document.querySelectorAll('.viva-option-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    this.innerHTML = '2 Options <i class="fa fa-check-square"></i>';
    document.getElementById('kr3').innerHTML = '3 Options';
    document.getElementById('kr4').innerHTML = '4 Options';
});

document.getElementById('kr3').addEventListener('click', function() {
    updateOptionCount(3);
	
    // Update active state
    document.querySelectorAll('.viva-option-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    this.innerHTML = '3 Options <i class="fa fa-check-square"></i>';
    document.getElementById('kr2').innerHTML = '2 Options';
    document.getElementById('kr4').innerHTML = '4 Options';
});

document.getElementById('kr4').addEventListener('click', function() {
    updateOptionCount(4);
	
    // Update active state
    document.querySelectorAll('.viva-option-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    this.innerHTML = '4 Options <i class="fa fa-check-square"></i>';
    document.getElementById('kr2').innerHTML = '2 Options';
    document.getElementById('kr3').innerHTML = '3 Options';
});

document.getElementById('viewQuestionsList').addEventListener('click', function() {
	rowQuestionList()
	displayQuestions();
	mainContentTop()
});
document.getElementById('addNewQuestion').addEventListener('click', function() {
	rowQuestionCreate()
	mainContentTop()
});
document.getElementById('addMDQuestion').addEventListener('click', function() {
	rowMarkDownQuestionCreate();
	mainContentTop()
});

function rowQuestionList(){
	document.getElementById('questionListMainTab').style.display = "";
	document.getElementById('editQuestionMain').style.display = "none";
	document.getElementById('questionMain').style.display = "none";
	document.getElementById('addMDQuestionMain').style.display = "none";
	
	document.getElementById('addNewQuestion').style.display = "";
	document.getElementById('viewQuestionsList').style.display = "none";
	document.getElementById('addMDQuestion').style.display = "";
}
function rowQuestionEdit(){
	document.getElementById('questionListMainTab').style.display = "none";
	document.getElementById('editQuestionMain').style.display = "";
	document.getElementById('questionMain').style.display = "none";
	document.getElementById('addMDQuestionMain').style.display = "none";
	
	document.getElementById('addNewQuestion').style.display = "none";
	document.getElementById('viewQuestionsList').style.display = "none";
	document.getElementById('addMDQuestion').style.display = "";
}
function rowQuestionCreate(){
	document.getElementById('questionListMainTab').style.display = "none";
	document.getElementById('editQuestionMain').style.display = "none";
	document.getElementById('questionMain').style.display = "";
	document.getElementById('addMDQuestionMain').style.display = "none";
	
	document.getElementById('addNewQuestion').style.display = "none";
	document.getElementById('viewQuestionsList').style.display = "";
	document.getElementById('addMDQuestion').style.display = "";
}
function rowMarkDownQuestionCreate(){
	document.getElementById('questionListMainTab').style.display = "none";
	document.getElementById('editQuestionMain').style.display = "none";
	document.getElementById('questionMain').style.display = "none";
	document.getElementById('addMDQuestionMain').style.display = "";
	
	document.getElementById('addNewQuestion').style.display = "";
	document.getElementById('viewQuestionsList').style.display = "";
	document.getElementById('addMDQuestion').style.display = "none";
}
/*************************SUBMIT TO SERVER FUNCTION*****************************/
function saveQtoCloud(){

	let ackinsover = "ackinsover";
	let allQuestionData = localStorage.getItem('attenquestionsets');
	let mainStudySection = fgStudySection;
	//console.log(allQuestionData)
	console.log(mainStudySection)
	
	//var rcbutton = document.getElementById("rcbutton");
    //rcbutton.setAttribute("disabled", "");
    //rcbutton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';	
	
	$.ajax({
		type: "POST",
		url: "./saintmophines/api/", 
		dataType: "json",
		data: {ackinsover: ackinsover, allQuestionData: allQuestionData, mainStudySection: mainStudySection, },
		success: function(data){

		var slf = data;
		if(slf.ErrorNote == "none"){
			
			fgStudySection.studySessUID  = slf.CaroUpdated;
			fgStudySection.studyBookUID  = slf.TilidUpdated;
			if (saveQuestionToCloud.classList.contains('v-blinking')) {
				saveQuestionToCloud.classList.remove('v-blinking');
				saveQuestionToCloud.style.display = "none";
			}
			if(fgStudySection.studyPGT == "editPuntStudy"){
				resetStudyForm();
				backToStudyList()
			}
			fgStudySection.studyPGT  = "old";
			showToast('Saved To Cloud', 'success');
			//console.log(mainStudySection)
        }else{
			showToast('Wrong Turn, You Might Loss Your Data', 'error');
        }
		},error : function(jqXHR, textStatus, errorThrown) {
            showToast('Shit is happening in the server', 'error');
	 }
  });
		
		
		

}

/*************************HELPER FUNCTION****************************************/
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

function todaysDateTime(){
	let now = new Date();
let month = String(now.getMonth() + 1).padStart(2, '0'); // Adds 1 for zero-index, pads to 2 digits
let day = String(now.getDate()).padStart(2, '0');
let year = now.getFullYear();
let hours = String(now.getHours()).padStart(2, '0'); // 24-hour format
let minutes = String(now.getMinutes()).padStart(2, '0');

return todaysDate = `${month}/${day}/${year} ${hours}:${minutes}`;
}

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