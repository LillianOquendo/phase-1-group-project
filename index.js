const baseUrl = "http://localhost:3000"
const top10Url = baseUrl + "/top10"

function fetchTop10() {
    fetch(top10Url)
    .then(resp => resp.json())
    .then(jokeData => renderAllJokes(jokeData))
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
const generateJokeBtn = document.getElementById('generateJokeBtn');
const jokeDisplay = document.getElementById('jokeDisplay');
const submitJokeForm = document.getElementById('submitJokeForm');
const jokeInput = document.getElementById('jokeInput');

generateJokeBtn.addEventListener('click', getDadJoke);

function getDadJoke() {
  fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch joke');
    }
  })
  .then(data => {
    jokeDisplay.innerHTML = data.joke;
  })
  .catch(error => {
    jokeDisplay.innerHTML = 'Oops! Something went wrong. Please try again.';
    console.error(error);
  });
}

submitJokeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  jokeDisplay.innerHTML = jokeInput.value;
  jokeInput.value = '';
});


