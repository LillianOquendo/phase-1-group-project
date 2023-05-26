//Define the base URL for the API
const baseUrl = "http://localhost:3000"
//Create the URL for fetching the top 10 jokes by joining /top10 with the base URL
const top10Url = baseUrl + "/top10"
const favoritesUrl = baseUrl + "/favorites"
const top10 = document.getElementById("top10");


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

function fetchFavorites() {
  fetch(favoritesUrl)
    .then(resp => resp.json())
    .then(favoritesData => renderAllFavorites(favoritesData))
}
fetchFavorites()

function renderAllFavorites(favoritesData) {
  // Sort the favoritesData array in descending order based on the 'likes' property
  favoritesData.sort((a, b) => b.likes - a.likes);

  favoritesData.forEach(favorite => renderFavorites(favorite));
}

function renderFavorites(favorite) {
  const listItem = createJokeListItem(favorite.joke, favorite.id, favorite.likes);
  favoriteJokesList.appendChild(listItem);
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

function saveJoke() {
  if (jokeDisplay.textContent !== "") {
    // Save the joke to the db.json file
    fetch(favoritesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        joke: jokeDisplay.textContent,
        likes: 0,
      }),
    })
      .then((resp) => resp.json())
      .then((favorite) => {
        const listItem = createJokeListItem(favorite.joke, favorite.id, favorite.likes);
        favoriteJokesList.appendChild(listItem);

        // Random chance of adding the joke to the top 10 list
        if (Math.random() < 0.5) { // 50% chance
          const randomIndex = Math.floor(Math.random() * 10);
          addToTopTen(jokeDisplay.textContent, randomIndex);
        }
      });
  } else {
    alert("No joke to save. Please generate a joke first.");
  }
}



// Add createJokeListItem function
function createJokeListItem(jokeTextContent, id, initialLikes = 0) {
  const listItem = document.createElement("li");

  // Creating the like button (heart icon)
  const heart = document.createElement("i");
  heart.classList.add("fas", "fa-heart");
  heart.style.cursor = "pointer";
  heart.style.marginRight = "5px";
  listItem.appendChild(heart);

  // Creating the like count element
  const likeCount = document.createElement("span");
  likeCount.textContent = initialLikes;
  listItem.appendChild(likeCount);

  // Creating the remove button (poop icon)
  const removeButton = document.createElement("i");
  removeButton.classList.add("fas", "fa-poop");
  removeButton.style.cursor = "pointer";
  removeButton.style.marginLeft = "5px";
  listItem.appendChild(removeButton);

  const jokeText = document.createTextNode(" " + jokeTextContent);
  listItem.appendChild(jokeText);

  // Initializing the 'likes' property for the listItem
  listItem.likes = initialLikes;

  // Adding the click event listener to the like button (heart icon)
  heart.addEventListener("click", () => {
    // Increment the 'likes' property of the listItem
    listItem.likes++;

    // Update the like count displayed next to the button
    likeCount.textContent = listItem.likes;

    // Update the like count in the db.json file
    fetch(`${favoritesUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: listItem.likes }),
    });

    // Call the 'sortListItems()' function to sort the jokes based on their likes
    sortListItems();
  });

  // Adding the click event listener to the remove button (poop icon)
  removeButton.addEventListener("click", () => {
    listItem.remove();

    // Remove the joke from the db.json file
    fetch(`${favoritesUrl}/${id}`, {
      method: "DELETE",
    })
  });

  return listItem;
}

function sortListItems() {
  // Create an array of list items
  const listItems = Array.from(favoriteJokesList.children);

  // Sort the array in descending order based on the 'likes' property
  listItems.sort((a, b) => b.likes - a.likes);

  // Clear the 'favoriteJokesList'
  favoriteJokesList.innerHTML = "";

  // Re-append the sorted list items to the 'favoriteJokesList'
  listItems.forEach((item) => favoriteJokesList.appendChild(item));
}

function addToTopTen(joke, index) {
  const listItem = document.createElement('li');
  listItem.textContent = joke;

  if (top10.childElementCount === 0) {
    top10.appendChild(listItem);
  } else if (top10.childElementCount <= index) {
    top10.appendChild(listItem);
  } else {
    top10.insertBefore(listItem, top10.children[index]);
  }

  if (top10.childElementCount > 10) {
    top10.removeChild(top10.lastChild);
  }

  // Update the jokes array in the db.json file
  const jokes = Array.from(top10.children).map(item => item.textContent.replace(/^0/, ''));
  fetch(top10Url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jokes),
  });
}



function submitJoke(e) {
  e.preventDefault();
  const jokeInput = document.getElementById('jokeInput');
  const joke = jokeInput.value;
  if (joke.trim() !== '') {
    addToTopTen(joke, top10.childElementCount);
  }
  jokeInput.value = '';
}