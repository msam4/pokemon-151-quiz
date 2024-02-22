// 1) Get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.querySelector(".container");
const loadingContainer = document.getElementById("loadingContainer");

// 8) Initialize variables
let usedPokemonId = [];
let count = 0; // 15.3

// 2) Create function to fetch one Pokemon with an ID
async function fetchPokemonById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// 3) Create a test function to see the results from step 2
// async function testFetch() {
//   const pokemon = await fetchPokemonById(getRandomPokemonId());
//   console.log(pokemon)
// }

// 4) Call test function
// testFetch();

// 6) Function to load question with options
async function loadQuestionWithOptions() {
  // 7) Fetch the correct answer first
  let pokemonId = getRandomPokemonId();

  // 8.2) Check if current question has already been used
  while (usedPokemonId.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }

  // 8.3) If pokemon has not been display yet, it is added to usedPokemonIds. And it is set as a new const pokemon.
  usedPokemonId.push(pokemonId);
  const pokemon = await fetchPokemonById(pokemonId);

  // 9) Create options array
  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  // 10) Fetch additional random Pokemon names to use as options
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();
    // 10.1) Ensure fetched option does not exist in the option list. Creates a new random id until it does not exist in optionsIds.
    while (optionsIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    };
    optionsIds.push(randomPokemonId);

    // 10.2) Fetching a random pokemon with the newly made ID, and adding it to the option array.
    const randomPokemon = await fetchPokemonById(randomPokemonId);
    const randomOption = randomPokemon.name;
    options.push(randomOption);

    // 10.3) Test
    console.log(options);
    console.log(optionsIds);
  }

  // 12) Shuffle the options around
  shuffleArray(options);

  // 13) Clear any previous result and update pokemon image to fetched image URL from the sprites
  resultElement.textContent = "Who's that Pokemon?";
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

  // 14) Create options HTML elements from options array in the DOM
  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === pokemon.name, event);
    optionsContainer.appendChild(button);
  });
}

// 15) Create check answer function
function checkAnswer(isCorrect, event) {
  // 15.1) Checks if any button is already selected, if falsy no element => null
  const selectedButton = document.querySelector(".selected");

  // 15.2) If a button is already selected, do nothing, exit function
  if (selectedButton) {
    return;
  }

  // 15.4) Else mark the clicked button as slected and increase the count by 1.
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;
}

// 11) Inital load
loadQuestionWithOptions();

// --- UTILITY FUNCTIONS ---

// 5) Function to randomize the pokemon ID
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

//12.1) Shuffle the array when we send it
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
};


// 15.5) Function to update result text and class name
