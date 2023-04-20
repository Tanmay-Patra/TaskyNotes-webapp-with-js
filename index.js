const state = {
    taskList: [],
};

// DOM Operations
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

// console.log(taskContents);
// console.log(taskModal);

// Template for the card on screen
// All html code below so use `` but can use {}

const htmlTaskContent = ({ id, title, description, type, url }) => `
	<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
    	<div class='card shadow-lg task__card'>
			<div class='card-header d-flex justify-content-end task__card__header'>
        		<button 
				type='button' 
				class='btn btn-outline-primary mr-1.5' 
				name=${id}
				onclick='editTask.apply(this,arguments)'
				>
            		<i class='fas fa-pencil-alt name=${id}'></i>
          		</button>
          		<button 
				type='button' 
				class='btn btn-outline-danger mr-1.5' 
				name=${id} 
				onclick='deleteTask.apply(this,arguments)'
				>
            		<i class='fas fa-trash-alt name=${id}'></i>
        		</button>
    		</div>

    		<div class='card-body'>

        		${
					//all js inside the brackets
    	        	url ?
					//Now HTML inside this bracket
            		`<img width='100%' src=${url} alt='Card Image' class='card-img-top md-3 rounded-2' />`
					:
					`<img width='100%' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAABzCAMAAAA/mWlXAAAAMFBMVEXp7vG6vsHt8vW3u77m6+7Q1di+wsXe4+bBxcjGys3V2t3c4OO0uLvIzdDk6OvZ3eBIpazrAAAB4klEQVR4nO2a2ZKDIBBFBVwAcfz/vx23JIgmA8yMl1TuectieerSdmNMVRFCCCGEEEIIIYQQQgi5GpkDxLRrMrAdwHRwKgtzdbBSKJGH0hebNrNpRqbTUW681tVMosaml6qeXC8ugemUqs5oAN2UqwaoZhyHVk3olmDVehyjuyVSVdbaOeVEE3d+oKrstgarhqjjkKneW7sbYwxwqusoWGljOgJQdXioqpNr6yt8A6iqveHeh1+SvbOBFlDViOepylEJFbiWUasiWO1liAq1v9qAHaB+hBp01mn1T95H9lW7xara/Rdkf8t7lyt0WvXzJlQ5s//8luni6tUrdA8gKzuY5itcff8mwXMFb1eON6J7U78G0JvAEH/1g1wLUw0z9XMtQfVx+mOmXq4FqEortpfzjDpjdcWrzu11baxnq+/VAFxV2nnNl0l7uvorpgDV28hq6+eZlqHqDdcndVqK6t10ln1hilf1TV+DVl2vqHdQjc8UrppgilbVPxsWourfBlL1A1VTalWBVU0bz4BVrVOo0HuAJN5HFfWEpU8/5TKHL1YdEppU2AkiHxv8EbKL3k8dVQ+/D/+za8o+ZYfLqJtfuvZtlqnuAP9ekGlNdQP0PwtCCCGEEEIIIYQQQgj5YL4BEqkXWU54BJwAAAAASUVORK5CYII="
					alt='Card Image' class='card-img-top md-3 rounded-2' />`
          		}

	        	<h4 class='card-title task__card__title'>${title}</h4>
    	      	<p class='description trim-3-lines text-muted'>${description}</p>
        	  	<div class='tags text-white d-flex flex-wrap'>
            		<span class='badge bg-primary m-1'>${type}</span>
        		</div>
	      	</div>

    		<div class='card-footer'>
        		<button 
				type='button' 
				class='btn btn-outline-primary float-right' 
				data-bs-toggle="modal" 
				data-bs-target="#showTask"
				onclick='openTask.apply(this,arguments)'
                id=${id}
				>
					Open Task
				</button>
	    	</div>
    	</div>
	</div>
`;

// Large modal Body on the click of Open Task
const htmlModalContent = ({ id, title, description, url }) => {
	const date = new Date(parseInt(id));
	return `
	<div id=${id}>
    	${
    		url ?
            `<img width='100%' src=${url} alt='Card Image' class='card-img-top md-3 rounded-2' />`
			:
			`<img width='100%' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAABzCAMAAAA/mWlXAAAAMFBMVEXp7vG6vsHt8vW3u77m6+7Q1di+wsXe4+bBxcjGys3V2t3c4OO0uLvIzdDk6OvZ3eBIpazrAAAB4klEQVR4nO2a2ZKDIBBFBVwAcfz/vx23JIgmA8yMl1TuectieerSdmNMVRFCCCGEEEIIIYQQQgi5GpkDxLRrMrAdwHRwKgtzdbBSKJGH0hebNrNpRqbTUW681tVMosaml6qeXC8ugemUqs5oAN2UqwaoZhyHVk3olmDVehyjuyVSVdbaOeVEE3d+oKrstgarhqjjkKneW7sbYwxwqusoWGljOgJQdXioqpNr6yt8A6iqveHeh1+SvbOBFlDViOepylEJFbiWUasiWO1liAq1v9qAHaB+hBp01mn1T95H9lW7xara/Rdkf8t7lyt0WvXzJlQ5s//8luni6tUrdA8gKzuY5itcff8mwXMFb1eON6J7U78G0JvAEH/1g1wLUw0z9XMtQfVx+mOmXq4FqEortpfzjDpjdcWrzu11baxnq+/VAFxV2nnNl0l7uvorpgDV28hq6+eZlqHqDdcndVqK6t10ln1hilf1TV+DVl2vqHdQjc8UrppgilbVPxsWourfBlL1A1VTalWBVU0bz4BVrVOo0HuAJN5HFfWEpU8/5TKHL1YdEppU2AkiHxv8EbKL3k8dVQ+/D/+za8o+ZYfLqJtfuvZtlqnuAP9ekGlNdQP0PwtCCCGEEEIIIYQQQgj5YL4BEqkXWU54BJwAAAAASUVORK5CYII="
			alt='Card Image' class='card-img-top md-3 rounded-2' />`
    	}
    	<b class='text-muted text-sm'>Created on: ${date.toDateString()}</b>
     	<h2 class='my-3'>${title}</h2>
     	<p class='text-muted'>${description}</p>
  	</div>
  	`;
};

// Here we convert json to string for local storage
const updateLocalStorage = () => {
	localStorage.setItem(
    	"task",
    	JSON.stringify({
    		tasks: state.taskList,
    	})
  	);
};

// Here we convert string to json to render the cards on screen
const loadInitialData = () => {
	const localStorageCopy = JSON.parse(localStorage.task);

	if (localStorageCopy) state.taskList = localStorageCopy.tasks;

	state.taskList.map((cardDate) => {
    	taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
	});
};

// To save when we edit the card
const handleSubmit = (event) => {
	const id = `${Date.now()}`;

	// Getting things from screen to js file
	const input = {
		// Now below line is stored in input.url
    	url: document.getElementById("imageUrl").value,
    	title: document.getElementById("taskTitle").value,
	    type: document.getElementById("tags").value,
    	description: document.getElementById("taskDescription").value,
  	};

	if (input.title === "" || input.tags === "" || input.Description === "") {
    	return alert("Please fill all the necessary fields");
  	}

	// Things displayed on screen
	taskContents.insertAdjacentHTML(
    	"beforeend",
    	htmlTaskContent({ ...input, id })
  	);

	// Storing in the array
  	state.taskList.push({ ...input, id });
	
  	updateLocalStorage();
};

// Open task
const openTask = (e) => {
	if (!e) e = window.event;

	const getTask = state.taskList.find(({ id }) => id === e.target.id);
	taskModal.innerHTML = htmlModalContent(getTask);
};

// delete task
const deleteTask = (e) => {
	if (!e) e = window.event;

	const targetId = e.target.getAttribute("name");
	const type = e.target.tagName;
	const removeTask = state.taskList.filter(({ id }) => id !== targetId);
	updateLocalStorage();
	
	if (type === "BUTTON") {
		return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
			e.target.parentNode.parentNode.parentNode
		);
	}
	return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
		e.target.parentNode.parentNode.parentNode.parentNode
	);
};

// Edit task
const editTask = (e) => {
	if (!e) e = window.event;
	const targetId = e.target.id;
	const type = e.target.tagName;
	
	let parentNode;
	let taskTitle;
	let taskDescription;
	let taskType;
	let submitButton;
	
	if (type === "BUTTON"){
	  	parentNode = e.target.parentNode.parentNode;
	}
	else{
	  	parentNode = e.target.parentNode.parentNode.parentNode;
	}
	
	taskTitle = parentNode.childNodes[3].childNodes[3];
	taskDescription = parentNode.childNodes[3].childNodes[5];
	taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
	submitButton = parentNode.childNodes[5].childNodes[1];
	
	taskTitle.setAttribute("contenteditable", "true");
	taskDescription.setAttribute("contenteditable", "true");
	taskType.setAttribute("contenteditable", "true");
	
	submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
	submitButton.removeAttribute("data-bs-toggle");
	submitButton.removeAttribute("data-bs-target");
	submitButton.innerHTML = "Save Changes";
};

// Save the edit
const saveEdit = (e) => {
	if (!e) e = window.event;
	const targetId = e.target.id;
	const parentNode = e.target.parentNode.parentNode;
	
	const taskTitle = parentNode.childNodes[3].childNodes[3];
	const taskDescription = parentNode.childNodes[3].childNodes[5];
	const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
	const submitButton = parentNode.childNodes[5].childNodes[1];

	const updateData = {
	taskTitle: taskTitle.innerHTML,
	taskDescription: taskDescription.innerHTML,
	taskType: taskType.innerHTML,
};

let stateCopy = state.taskList;

	stateCopy = stateCopy.map((task) =>
	  	task.id === targetId
		? {
			id: task.id,
			title: updateData.taskTitle,
			description: updateData.taskDescription,
			type: updateData.taskType,
			url: task.url,
		}
		: task
	);
	state.taskList = stateCopy;
	updateLocalStorage();
	
	taskTitle.setAttribute("contenteditable", "false");
	taskDescription.setAttribute("contenteditable", "false");
	taskType.setAttribute("contenteditable", "false");
	
	submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
	submitButton.setAttribute("data-bs-toggle", "modal");
	submitButton.setAttribute("data-bs-target", "#showTask");
	submitButton.innerHTML = "Open Task";
};

// Search
const searchTask = (e) => {
	if (!e) e = window.event;

	while (taskContents.firstChild) {
	  	taskContents.removeChild(taskContents.firstChild);
	}
	const resultData = state.taskList.filter(({ title }) =>
	  	title.toLowerCase().includes(e.target.value.toLowerCase())
	);
	
	resultData.map(
	  	(cardData) =>
		taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))

		// For large cards while searching
		// taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardData))
	);
};