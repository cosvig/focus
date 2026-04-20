var allgroups = '';
const groupInput = document.getElementById('groupInput');
const groupkey = document.getElementById('groupkey');
const sendbutton = document.getElementById('sendbutton');
document.addEventListener('DOMContentLoaded', function() {
	groupslisting();
	sendbutton.addEventListener('click', handleFormSubmit);
});


/*************************ONCLICK GROUP DIV FUNCTION*****************************/
function clickingFocusGroup(){
	let quickAccessCard = document.querySelectorAll('.quick-access-card');

quickAccessCard.forEach((item, index) => {
	item.addEventListener('click', function() {
		const focusgroupdid = item.dataset.groupId;
		let groupSingle = allgroups.find(game => game.groupFxix == focusgroupdid);
		//addressClickedDiv(groupSingle)
		document.getElementById("groupkeytitle").innerHTML = groupSingle.groupFname;
		document.getElementById("groupInput").value = groupSingle.groupFxix;
		document.getElementById("quickAcecess").style.display = "none";
		document.getElementById("signLog").style.display = "";
	});
});
}
/*************************SUBMIT GROUP KEY FUNCTION*****************************/
function validateForm() {
	// Validate Focus Group Name
	const groupInputValue = groupInput.value.trim();
	if (!groupInputValue) {
		showToast('Please enter Focus Group Name.', 'error');
		return false;
	}

	// Validate Focus Group School
	const groupkeyValue = groupkey.value.trim();
	if (!groupkeyValue) {
		showToast('Please enter Focus Group Key.', 'error');
		return false;
	}else if(groupkeyValue.length < 8){
		removeCookies();
		showToast('Please enter valid Focus Group Key.', 'error');
		return false;
	}

	return true;
}
function handleFormSubmit(event) {
	// Prevent default form submission (page reload)
	//event.preventDefault();
	// Run validation
	if (validateForm()) {
		
		signInGroupMember();
	}
}
function signInGroupMember(val){
		
	let groupInput  = document.getElementById("groupInput").value;	
	let groupkey  = document.getElementById("groupkey").value;
	
	var rcbutton = document.getElementById("sendbutton");
    rcbutton.setAttribute("disabled", "");
    //rcbutton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';	
	$.ajax({
		type: "POST",
		url: "./saintmophines/api/", 
		dataType: "json",
		data: {groupInput: groupInput, groupkey: groupkey, },
		success: function(data){
		
		if (Object.keys(data).length === 0) {
			removeCookies();
			showToast('Though Shall Not Pass', 'error');
			rcbutton.removeAttribute("disabled", "");
		} else {
			let firstcookie = data.flathemin;
			let secondcookie = data.sledinlake;
			generateCookies(firstcookie, secondcookie)
			showToast('Signing in...', 'success');
			//rcbutton.removeAttribute("disabled", ""); //remove this 
			window.location.href = "scores.html"
		}
		/*var slf = data;
		if(slf.ErrorNote == "none"){
			showToast('The form has been successfully submitted.', 'success');
			//createacookie();
			window.location.href = "scores.html"
        }else{
			showToast(slf.ErrorNoteMsg, 'error');
            rcbutton.removeAttribute("disabled", "");
        }*/
		},error : function(jqXHR, textStatus, errorThrown) {
            showToast('Please Refresh. An error occured', 'error');
			rcbutton.removeAttribute("disabled", "");
	 }
  });
 
}


function generateCookies(first, second) {
	const daysInFuture = 30;
	const expires = new Date();
	expires.setDate(expires.getDate() + daysInFuture);

	// Set the cookies
	document.cookie = `fusionnet=${first}; expires=${expires.toUTCString()}; path=/`;
	document.cookie = `selebratnet=${second}; expires=${expires.toUTCString()}; path=/`;
	//document.cookie = `cookie3=${cookieValue}; expires=${expires.toUTCString()}; path=/`;
}
/*************************LIST & SEARCH FUNCTION*********************************/
function groupslisting(){
	let dvmgvmbmvlzwj  = "dvmgvmbmvlzwj";	
	$.ajax({
		type: "POST",
		url: "./saintmophines/api/", 
		dataType: "json",
		data: {dvmgvmbmvlzwj: dvmgvmbmvlzwj},
		success: function(result){
			allgroups = result;
			initFocusGroups();
			
			showToast('Group has been loaded');
		},error : function(jqXHR, textStatus, errorThrown) {
			showToast('Please Refresh. An error occured', 'error');
			//rcbutton.removeAttribute("disabled", "");
            //rcbutton.innerHTML = `<i class="fas fa-paper-plane"></i> <span>Submit</span>`;
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
				<!--<div class="quick-access-card-count">0 files</div>-->
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
/*************************HELPER FUNCTION****************************************/
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