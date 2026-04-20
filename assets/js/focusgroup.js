var allgroups = '';
const form = document.getElementById('groupForm');
const groupFormType = document.getElementById('groupinit');
const groupIxv = document.getElementById('groupxxxd');
const groupGLcookieset = document.getElementById('groupcookieset');
const resetButton = document.getElementById('resetgroupform');
const groupnameInput = document.getElementById('groupname');
const groupschoolInput = document.getElementById('groupschool');
const groupschoolacnInput = document.getElementById('groupschoolacn');
const groupvisibleSelect = document.getElementById('groupvisible');


document.addEventListener('DOMContentLoaded', function() {
	groupslisting();
	form.addEventListener('submit', handleFormSubmit);
});

/*************************CREATE FORM FUNCTION***********************************/
function resetFormFields() {
	//document.getElementById('groupForm').reset();
	document.getElementById("groupinit").value = "create";
	document.getElementById("groupxxxd").value = "";
	document.getElementById("groupcookieset").value = "no";
	
	document.getElementById("additionOnUpdate").innerHTML = "";
	groupnameInput.value = '';
	groupschoolInput.value = '';
	groupschoolacnInput.value = '';
	groupvisibleSelect.value = ''; // Resets to first option (empty)
}
function handleReset(event) {
	event.preventDefault();
	resetFormFields();
	// Optional: Uncomment below if you want a toast notification on reset
	// showToast('Form has been reset.', 'info');
}
resetButton.addEventListener('click', handleReset);

function validateForm() {
	// Validate Focus Group Name
	const groupnameValue = groupnameInput.value.trim();
	if (!groupnameValue) {
		showToast('Please enter Focus Group Name.', 'error');
		return false;
	}

	// Validate Focus Group School
	const groupschoolValue = groupschoolInput.value.trim();
	if (!groupschoolValue) {
		showToast('Please enter Focus Group School.', 'error');
		return false;
	}

	// Validate Focus Group School Acronym
	const groupschoolacnValue = groupschoolacnInput.value.trim();
	if (!groupschoolacnValue) {
		showToast('Please enter Focus Group School Acronym.', 'error');
		return false;
	}

	// Validate Group Visibility
	const groupvisibleValue = groupvisibleSelect.value;
	if (!groupvisibleValue) {
		showToast('Please select Group Visibility.', 'error');
		return false;
	}

	return true;
}

function handleFormSubmit(event) {
	// Prevent default form submission (page reload)
	event.preventDefault();
	// Run validation
	if (validateForm()) {
		// Show success message
		

		// Prepare form data object
		const formData = {
			groupname: groupnameInput.value.trim(),
			groupschool: groupschoolInput.value.trim(),
			groupschoolacn: groupschoolacnInput.value.trim(),
			groupvisible: groupvisibleSelect.value
		};
		// Send validated data to the external function
		//groupsending(formData);
		groupsending();
	}
}


function groupsending(){
	let groupxxxd  = document.getElementById("groupxxxd").value;	
	let groupinit  = document.getElementById("groupinit").value;	
	let groupname  = document.getElementById("groupname").value;	
	let groupschool  = document.getElementById("groupschool").value;	
	let groupschoolacn  = document.getElementById("groupschoolacn").value;	
	let groupvisible  = document.getElementById("groupvisible").value;
	let groupcookieset  = document.getElementById("groupcookieset").value;
	
	var rcbutton = document.getElementById("submitgroupform");
    rcbutton.setAttribute("disabled", "");
    rcbutton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';	
	
	$.ajax({
		type: "POST",
		url: "./saintmophines/api/", 
		dataType: "json",
		data: {groupinit: groupinit, groupxxxd: groupxxxd, groupname: groupname, groupschool: groupschool, groupschoolacn: groupschoolacn, groupvisible: groupvisible, groupcookieset: groupcookieset},
		success: function(data){

		var slf = data;
		if(slf.ErrorNote == "none"){
			showToast('The form has been successfully submitted.', 'success');
			resetFormFields();
			groupslisting();
			rcbutton.removeAttribute("disabled", "");
            rcbutton.innerHTML = `<i class="fas fa-paper-plane"></i> <span>Submit</span>`;
        }else{
			showToast(slf.ErrorNoteMsg, 'error');
            rcbutton.removeAttribute("disabled", "");
            rcbutton.innerHTML = `<i class="fas fa-paper-plane"></i> <span>Submit</span>`;
        }
		},error : function(jqXHR, textStatus, errorThrown) {
			showToast('Please Refresh. An error occured', 'error');
			rcbutton.removeAttribute("disabled", "");
            rcbutton.innerHTML = `<i class="fas fa-paper-plane"></i> <span>Submit</span>`;
		}
  });
}



/***************************LIST & SEARCH FUNCTION**************************/
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

/******************************EDITING FUNCTION*******************************/
function clickingFocusGroup(){
	let quickAccessCard = document.querySelectorAll('.quick-access-card');

quickAccessCard.forEach((item, index) => {
	item.addEventListener('click', function() {
		const focusgroupdid = item.dataset.groupId;
		let groupSingle = allgroups.find(game => game.groupFxix == focusgroupdid);
		addressClickedDiv(groupSingle)
		//console.log(focusgroupdid);
	});
});
}

function addressClickedDiv(groupArray){
	groupFormType.value = "update";
	groupIxv.value = groupArray.groupFxix;
	groupnameInput.value = groupArray.groupFname;
	groupschoolInput.value = groupArray.groupFschoolname;
	groupschoolacnInput.value = groupArray.groupFschoolacn;
	groupvisibleSelect.value = groupArray.groupFgroupkey;
	
	let WORD = `
	<div class="form-group">
						<label class="form-label" for="firstcookie">First Cookie</label>
						<input type="text" name="firstcookie" id="firstcookie" class="form-textarea" placeholder="First Cookie..."  disabled="disabled" value="${groupArray.groupFcFirst}">
					</div>
					<div class="form-group">
						<label class="form-label" for="secondcookie">Second Cookie</label>
						<input type="text" name="secondcookie" id="secondcookie" class="form-textarea" placeholder="Second Cookie..."  disabled="disabled"  value="${groupArray.groupFcSecond}">
					</div>
					
					<div class="form-group">
                        <label for="setnewcookies" class="form-label">Update Cookies</label>
                        <select name="setnewcookies" id="setnewcookies" class="form-select" required>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
	`;
	document.getElementById('additionOnUpdate').innerHTML = WORD;
	let divsetnewcookies = document.getElementById('setnewcookies');
	divsetnewcookies.addEventListener('change', function() {
		let settingcookies = divsetnewcookies.value;
		if(settingcookies == "yes"){
			groupGLcookieset.value = "yes";
		}else if(settingcookies == "no"){
			groupGLcookieset.value = "no";
		}
	});
}

/*************************HELPER FUNCTION****************************************/
function randomString(params){
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let cookieValue = '';
	for (let i = 0; i < params; i++) {
		cookieValue += chars.charAt(Math.floor(Math.random() * chars.length));
	}
    return cookieValue
}

function randomNumber(params){
const chars = '0123456789';
	let cookieValue = '';
	for (let i = 0; i < params; i++) {
		cookieValue += chars.charAt(Math.floor(Math.random() * chars.length));
	}
    return cookieValue
}

/*
function randomNumber(min, max) {
  return Math.random() * (max - min + 1) + min;
}*/

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