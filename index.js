//Define the base URL for the API
const baseUrl = "http://localhost:3000"
//Create the URL for fetching the top 10 jokes by joining /top10 with the base URL
const top10Url = baseUrl + "/top10"

//Define the fetchTop10 function
function fetchTop10() {
    //Fetch data from the top10Url
    fetch(top10Url)
    .then(resp => resp.json()) // Convert the response to Json
    .then(jokeData => renderAllJokes(jokeData)) //Call renderAllJokes with the joke data
}
fetchTop10()

function renderAllJokes(jokeData) {
    jokeData.forEach(joke => renderJokeInfo(joke))
}

function renderJokeInfo(joke) {
    const top10List = document.getElementById("top10");
    const listItem = document.createElement("li");
    listItem.textContent = joke.joke;
    top10List.appendChild(listItem);
}

//get references to html elements
const generateJokeBtn = document.getElementById('generateJokeBtn');
const jokeDisplay = document.getElementById('jokeDisplay');
const submitJokeForm = document.getElementById('submitJokeForm');
const jokeInput = document.getElementById('jokeInput');

//add a click event listener to the "Generate Joke" button
generateJokeBtn.addEventListener('click', getDadJoke);

//Define getDadeJoke Function
function getDadJoke() {
  //Fetch data from the API
  fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    //Check if the response is ok then return JSON data
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch joke');
    }
  })
  .then(data => {
    //Update the jokeDisplay with the fetched joke
    jokeDisplay.innerHTML = data.joke;
  })
  .catch(error => {
    //Display an error message if theres an issue fetching the joke
    jokeDisplay.innerHTML = 'Oops! Something went wrong. Please try again.';
    console.error(error);
  });
}

submitJokeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  jokeDisplay.innerHTML = jokeInput.value;
  jokeInput.value = '';
});


//save joke button listener
const saveJokeBtn = document.getElementById('saveJokeBtn');
const favoriteJokesList = document.getElementById('favorites');

//Add a click event listener to the "Save Joke" button
saveJokeBtn.addEventListener('click', saveJoke);

//Define the saveJoke function
function saveJoke() {
  //Check if there a joke displayed, then save it
  if (jokeDisplay.textContent !== '') {
    const listItem = document.createElement('li');
    listItem.textContent = jokeDisplay.textContent;
    favoriteJokesList.appendChild(listItem);
  } else {
    //Alert the user if theres no joke to save
    alert('No joke to save. Please generate a joke first.');
  }
}


