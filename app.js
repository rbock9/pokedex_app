// DOM Objects //
// grab the main screen to add/remove 'hide' class after API data loads
const mainScreen = document.querySelector('.main-screen');
// grab HTML span with Pokemon's Name
const pokeName = document.querySelector('.poke-name');
// grab HTML span with Pokemon's ID
const pokeId = document.querySelector('.poke-id');
// grab HTML img tag with Pokemon's Front Image
const pokeFrontImage = document.querySelector('.poke-front-image');
// grab HTML img tag with Pokemon's Back Image
const pokeBackImage = document.querySelector('.poke-back-image');
// grab HTML span with Pokemon's First Type
const pokeTypeOne = document.querySelector('.poke-type-one');
// grab HTML span with Pokemon's Second Type
const pokeTypeTwo = document.querySelector('.poke-type-two');
// grab HTML span with Pokemon's Weight
const pokeWeight = document.querySelector('.poke-weight');
// grab HTML span with Pokemon's Height
const pokeHeight = document.querySelector('.poke-height');
// grab all Poke List Items for right side of screen
const pokeListItems = document.querySelectorAll('.list-item');
// Prev button on right side of screen
const leftButton = document.querySelector('.left-button');
// Next button on right side of screen
const rightButton = document.querySelector('.right-button');

// Constants and Variables //
// An array of all types to assist with resetScreen function
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;


// Functions //
// Function to capitalize words and names
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

// Function to clear background color and to remove pokemon type colors
const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type)
    }
}

// Function to get poke list data for right side of screen
const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        // destructure property from data object using ES6
        // (old way: const results = data['results'])
        const { results, previous, next } = data
        prevUrl = previous;
        nextUrl = next;
        // using a for loop so we can access the index of PokeListItems array
        for (let i = 0; i < pokeListItems.length; i++) {
            const pokeListItem = pokeListItems[i]
            const resultData = results[i]

            if (resultData) {
                const { name, url } = resultData
                const urlArray = url.split('/')
                const id = urlArray[urlArray.length - 2]
                pokeListItem.textContent = id + '. ' + capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        }
    })
}

// Function to get individual Pokemon data for left side of screen
const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            resetScreen()
            const dataTypes = data['types'];
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            pokeTypeOne.textContent = capitalize(dataFirstType['type']['name'])
            if(dataSecondType) {
                pokeTypeTwo.classList.remove('hide')
                pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name'])
            } else {
                pokeTypeTwo.classList.add('hide')
                pokeTypeTwo.textContent = ''
            }
            // update background color to match pokemon's first type color
            mainScreen.classList.add(dataFirstType['type']['name'])
            // using capitalize function on pokemon's name
            pokeName.textContent = capitalize(data['name']);
            // padding pokemon's number ID so it is always 3 digits
            pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
            pokeWeight.textContent = (data['weight'] / 10).toFixed(1) + ' kg';
            pokeHeight.textContent = (data['height'] / 10).toFixed(1) + ' m';
            pokeFrontImage.src = data['sprites']['front_default'] || '';
            pokeBackImage.src = data['sprites']['back_default'] || '';
        })
}

// Function to handle 'Next' button click
const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
}

// Function to handle 'Prev' button click
const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
}

// Function to handle individual Pokemon buttons on right side of screen
const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0]
    fetchPokeData(id)
}

// Adding event listeners for buttons
leftButton.addEventListener('click', handleLeftButtonClick)
rightButton.addEventListener('click', handleRightButtonClick)
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}

// Initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')



// Special thanks to Justin Kim's Youtube channel for the backbone code!