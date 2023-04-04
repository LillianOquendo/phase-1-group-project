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