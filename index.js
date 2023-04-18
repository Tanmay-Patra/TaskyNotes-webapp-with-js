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
        		<button type='button' class='btn btn-outline-primary mr-1.5' name=${id}>
            		<i class='fas fa-pencil-alt name=${id}'></i>
          		</button>
          		<button type='button' class='btn btn-outline-danger mr-1.5' name=${id}>
            		<i class='fas fa-trash-alt name=${id}'></i>
        		</button>
    		</div>

    		<div class='card-body'>

        		${
					//all js inside the brackets
    	        	url &&
					//Now HTML inside this bracket
            		`<img width='100%' src=${url} alt='Card Image' class='card-img-top md-3 rounded-2' />`
          		}

	        	<h4 class='card-title task__card__title'>${title}</h4>
    	      	<p class='description trim-3-lines text-muted'>${description}</p>
        	  	<div class='tags text-white d-flex flex-wrap'>
            		<span> class='badge bg-primary m-1'${type}</span>
        		</div>
	      	</div>

    		<div class='card-footer'>
        		<button 
				type='button' 
				class='btn btn-outline-primary float-right' 
				data-bs-toggle="modal" 
				data-bs-target="#showTask"
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
    		url &&
    		`<img width='100%' src=${url} alt='Card Image' class='img-fluid place__holder__image mb-3' />`
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

	if (input.title === "" || input.tags === "" || input.taskDescription === "") {
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
