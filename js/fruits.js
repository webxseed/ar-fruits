/**
 * AR Fruits Experience - Fruit Data Configuration
 * Contains all fruit definitions with their models, emojis, and descriptions
 */

const FRUITS = [
    {
        id: 'apple',
        name: 'Apple',
        emoji: '🍎',
        description: 'A crisp, sweet fruit perfect for any occasion',
        model: 'assets/models/apple.glb',
        color: '#ff6b6b'
    },
    {
        id: 'banana',
        name: 'Banana',
        emoji: '🍌',
        description: 'A tropical delight, rich in potassium',
        model: 'assets/models/banana.glb',
        color: '#ffd93d'
    },
    {
        id: 'orange',
        name: 'Orange',
        emoji: '🍊',
        description: 'Bursting with vitamin C and sunshine',
        model: 'assets/models/orange.glb',
        color: '#ff9f43'
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        emoji: '🍓',
        description: 'Sweet, juicy, and romantically red',
        model: 'assets/models/strawberry.glb',
        color: '#ee5a5a'
    },
    {
        id: 'pineapple',
        name: 'Pineapple',
        emoji: '🍍',
        description: 'The crown jewel of tropical fruits',
        model: 'assets/models/pineapple.glb',
        color: '#f8d56b'
    },
    {
        id: 'watermelon',
        name: 'Watermelon',
        emoji: '🍉',
        description: 'Summer\'s favorite refreshing treat',
        model: 'assets/models/watermelon.glb',
        color: '#26de81'
    },
    {
        id: 'grapes',
        name: 'Grapes',
        emoji: '🍇',
        description: 'Clusters of sweet, bite-sized perfection',
        model: 'assets/models/grapes.glb',
        color: '#a55eea'
    },
    {
        id: 'pear',
        name: 'Pear',
        emoji: '🍐',
        description: 'Elegantly shaped and delicately sweet',
        model: 'assets/models/pear.glb',
        color: '#c4e538'
    },
    {
        id: 'kiwi',
        name: 'Kiwi',
        emoji: '🥝',
        description: 'Fuzzy outside, tangy-sweet inside',
        model: 'assets/models/kiwi.glb',
        color: '#7bed9f'
    },
    {
        id: 'mango',
        name: 'Mango',
        emoji: '🥭',
        description: 'The king of fruits, lusciously tropical',
        model: 'assets/models/mango.glb',
        color: '#ffa502'
    }
];

/**
 * Get a random fruit from the list
 * @returns {Object} Random fruit object
 */
function getRandomFruit() {
    const randomIndex = Math.floor(Math.random() * FRUITS.length);
    return FRUITS[randomIndex];
}

/**
 * Get fruit by ID
 * @param {string} id - Fruit ID
 * @returns {Object|undefined} Fruit object or undefined
 */
function getFruitById(id) {
    return FRUITS.find(fruit => fruit.id === id);
}

/**
 * Session storage key for persisting fruit choice
 */
const FRUIT_SESSION_KEY = 'ar_fruit_session';

/**
 * Get or set the session fruit
 * On first load, picks random fruit and stores it
 * On subsequent loads within session, returns stored fruit
 * @returns {Object} The fruit for this session
 */
function getSessionFruit() {
    // Check if we have a stored fruit for this session
    const storedFruitId = sessionStorage.getItem(FRUIT_SESSION_KEY);
    
    if (storedFruitId) {
        const storedFruit = getFruitById(storedFruitId);
        if (storedFruit) {
            return storedFruit;
        }
    }
    
    // Pick a new random fruit
    const newFruit = getRandomFruit();
    sessionStorage.setItem(FRUIT_SESSION_KEY, newFruit.id);
    return newFruit;
}

/**
 * Get a new random fruit (for "try another" button)
 * Ensures the new fruit is different from current
 * @returns {Object} A new random fruit
 */
function getNewRandomFruit() {
    const currentFruitId = sessionStorage.getItem(FRUIT_SESSION_KEY);
    let newFruit;
    
    // Keep picking until we get a different fruit
    do {
        newFruit = getRandomFruit();
    } while (newFruit.id === currentFruitId && FRUITS.length > 1);
    
    // Store the new fruit
    sessionStorage.setItem(FRUIT_SESSION_KEY, newFruit.id);
    return newFruit;
}

// Export for use in app.js
window.FruitManager = {
    FRUITS,
    getRandomFruit,
    getFruitById,
    getSessionFruit,
    getNewRandomFruit
};
