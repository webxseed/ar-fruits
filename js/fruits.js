/**
 * AR Fruits Experience - Fruit Data Configuration
 * Contains all fruit definitions with their models, emojis, and descriptions
 */

const FRUITS = [
    {
        id: 'shift',
        name: 'Shift',
        emoji: '📦',
        description: 'Shift 3D model',
        model: 'assets/models/shift.glb',
        color: '#667eea'
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
