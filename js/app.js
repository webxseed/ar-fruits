/**
 * AR Fruits Experience - Main Application
 * Handles model loading, AR detection, and UI interactions
 */

(function () {
    'use strict';

    // DOM Elements
    const elements = {
        loadingScreen: document.getElementById('loading-screen'),
        app: document.getElementById('app'),
        fruitViewer: document.getElementById('fruit-viewer'),
        arButton: document.getElementById('ar-button'),
        arFallback: document.getElementById('ar-fallback'),
        fruitIcon: document.getElementById('fruit-icon'),
        fruitBadge: document.getElementById('fruit-badge'),
        fruitName: document.getElementById('fruit-name'),
        fruitEmoji: document.getElementById('fruit-emoji'),
        fruitDisplayName: document.getElementById('fruit-display-name'),
        fruitDescription: document.getElementById('fruit-description'),
        newFruitBtn: document.getElementById('new-fruit-btn'),
        spinningFruit: document.querySelector('.spinning-fruit')
    };

    // Current fruit
    let currentFruit = null;

    /**
     * Initialize the application
     */
    function init() {
        // Check AR support FIRST to show/hide button immediately
        checkARSupport();

        // Get session fruit
        currentFruit = window.FruitManager.getSessionFruit();

        // Update loading screen fruit
        if (elements.spinningFruit) {
            elements.spinningFruit.textContent = currentFruit.emoji;
        }

        // Setup event listeners
        setupEventListeners();

        // Load the fruit model
        loadFruitModel(currentFruit);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Model viewer events
        elements.fruitViewer.addEventListener('load', onModelLoaded);
        elements.fruitViewer.addEventListener('error', onModelError);
        elements.fruitViewer.addEventListener('progress', onModelProgress);
        elements.fruitViewer.addEventListener('ar-status', onARStatus);

        // New fruit button
        elements.newFruitBtn.addEventListener('click', handleNewFruit);

        // AR button click tracking
        elements.arButton.addEventListener('click', activateAR);
    }

    /**
     * Load a fruit model
     * @param {Object} fruit - Fruit object to load
     */
    function loadFruitModel(fruit) {
        console.log('Loading fruit model:', fruit.name);

        // Update UI with fruit info
        updateFruitUI(fruit);

        // Set model source
        elements.fruitViewer.src = fruit.model;
        elements.fruitViewer.alt = `3D ${fruit.name} Model`;
    }

    /**
     * Update all UI elements with fruit info
     * @param {Object} fruit - Fruit object
     */
    function updateFruitUI(fruit) {
        // Header
        elements.fruitIcon.textContent = fruit.emoji;
        elements.fruitName.textContent = fruit.name;

        // Info card
        elements.fruitEmoji.textContent = fruit.emoji;
        elements.fruitDisplayName.textContent = fruit.name;
        elements.fruitDescription.textContent = fruit.description;

        // Update page title
        document.title = `AR ${fruit.name} Experience | View in Your Space`;
    }

    /**
     * Handle model loaded event
     */
    function onModelLoaded() {
        console.log('Model loaded successfully');

        // Hide loading screen with animation
        setTimeout(() => {
            elements.loadingScreen.classList.add('fade-out');
            elements.app.classList.remove('hidden');

            // Remove loading screen after animation
            setTimeout(() => {
                elements.loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }

    /**
     * Handle model loading error
     * @param {Event} event - Error event
     */
    function onModelError(event) {
        console.error('Error loading model:', event);

        // Still show the app with a message
        elements.loadingScreen.classList.add('fade-out');
        elements.app.classList.remove('hidden');

        // Show fallback message
        elements.arFallback.classList.remove('hidden');
        elements.arFallback.innerHTML = `
            <div class="fallback-icon">⚠️</div>
            <h3>Model Not Found</h3>
            <p>Could not load the 3D model. Please check if the model file exists.</p>
            <p class="fallback-hint">Path: ${currentFruit.model}</p>
        `;
    }

    /**
     * Handle model loading progress
     * @param {Event} event - Progress event
     */
    function onModelProgress(event) {
        const progress = event.detail.totalProgress * 100;
        const progressBar = document.querySelector('.model-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update loading progress bar
        const loadingProgress = document.querySelector('.loading-progress');
        if (loadingProgress) {
            loadingProgress.style.width = `${progress}%`;
        }
    }

    /**
     * Handle AR status changes
     * @param {Event} event - AR status event
     */
    function onARStatus(event) {
        console.log('AR Status:', event.detail.status);

        if (event.detail.status === 'failed') {
            console.log('AR session failed');
        } else if (event.detail.status === 'session-started') {
            console.log('AR session started');
        }
    }

    /**
     * Check if AR is supported on this device
     */
    async function checkARSupport() {
        // Improved mobile detection (includes modern iPads that report as Macintosh)
        const ua = navigator.userAgent;
        const isAndroid = /android/i.test(ua);
        const isIOS = /iPad|iPhone|iPod/.test(ua) ||
            (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
        const isMobile = isAndroid || isIOS || navigator.maxTouchPoints > 0;

        console.log('AR Support Check:', {
            userAgent: ua,
            isAndroid,
            isIOS,
            isMobile,
            maxTouchPoints: navigator.maxTouchPoints
        });

        // ALWAYS show the button on mobile devices
        if (isMobile) {
            elements.arButton.style.display = 'flex';
            elements.arFallback.classList.add('hidden');
            console.log('Mobile device detected - showing AR button');
        } else {
            // Desktop - hide button, show fallback
            elements.arButton.style.display = 'none';
            elements.arFallback.classList.remove('hidden');
            console.log('Desktop detected - hiding AR button');
        }
    }

    /**
     * Activate AR mode
     */
    function activateAR() {
        console.log('Activating AR for:', currentFruit.name);

        // Use model-viewer's built-in AR activation
        if (elements.fruitViewer.canActivateAR) {
            elements.fruitViewer.activateAR();
        } else {
            // Fallback: try to activate anyway (Scene Viewer / Quick Look might work)
            try {
                elements.fruitViewer.activateAR();
            } catch (e) {
                console.log('AR activation failed:', e);
                alert('AR is not available on this device. Please try on a mobile device with AR support.');
            }
        }
    }

    /**
     * Handle "Try Another Fruit" button click
     */
    function handleNewFruit() {
        // Get new random fruit
        const newFruit = window.FruitManager.getNewRandomFruit();
        currentFruit = newFruit;

        // Add loading state
        elements.newFruitBtn.disabled = true;
        elements.newFruitBtn.innerHTML = `
            <span class="refresh-icon" style="animation: spinner 1s linear infinite;">🔄</span>
            <span>Loading...</span>
        `;

        // Load new model
        loadFruitModel(newFruit);

        // Reset button after model loads
        elements.fruitViewer.addEventListener('load', function resetButton() {
            elements.newFruitBtn.disabled = false;
            elements.newFruitBtn.innerHTML = `
                <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 4V10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1 20V14H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.51 9.00001C4.01717 7.56679 4.87913 6.2854 6.01547 5.27543C7.1518 4.26545 8.52547 3.55977 10.0083 3.22427C11.4911 2.88878 13.0348 2.93436 14.4952 3.35679C15.9556 3.77922 17.2853 4.56473 18.36 5.64001L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1112 13.9917 20.7758C15.4745 20.4403 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Try Another Fruit</span>
            `;
            elements.fruitViewer.removeEventListener('load', resetButton);
        }, { once: true });

        // Scroll to top to see the model
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
