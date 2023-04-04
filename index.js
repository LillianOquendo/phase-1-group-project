
const baseUrl = "https://icanhazdadjoke.com/"
const jokeButton = document.getElementById("jokeButton")
const paragraph = document.getElementById("paragraph")

//declare your fetchJoke function using an arrow

const fetchJoke= () => {

    //fetch the baseUrl
    fetch(baseUrl, {

        //the original api is an HTML so we need to tell it we only want a json
    //do this using headers and an accept

    headers:{
Accept: 'application/json' 
}
})

//connect to the json() using responses and an arrow 
    //remember json is a funciton else no jokes will appear
    
    .then (response => response.json())
    
    //connect the data into your paragraph.Remember that the jokes
    //are stored in an object so you must call its key! use an arrow
    
    .then(data => paragraph.textContent = data['joke'])


}

//create a button with a click eventlistener and an arrow calling back to fetchJoke()

jokeButton.addEventListener('click', () => fetchJoke())
