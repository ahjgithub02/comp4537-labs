/**
 * Memory Button Game
 *
 * AI Acknowledgment:
 * ChatGPT (https://chat.openai.com/) was used as a reference tool to assist with
 * understanding object-oriented JavaScript structure, layout logic, and general
 * code documentation practices.
 *
 * Purpose of AI Use:
 * - Guidance on OOP design patterns in JavaScript
 * - Suggestions for layout algorithms and refactoring
 * - Assistance with writing JSDoc-style comments
 *
 * All implementation decisions, testing, debugging, and final integration were
 * completed by me, Andrew Hwang.
 * 
 * @author Andrew Hwang
 * @version 1.0
 */
import { STRINGS } from "../lang/messages/en/user.js";

/**
 * Controls application startup and coordinates major components.
 */
export class AppController {

    /**
     * @param {UserInterface} ui - User interface controller instance
     */
    constructor(ui) {
        this.ui = ui;
        this.validator = new FormValidator(3, 7);
        this.taskManager = new TaskManager();
        this.gameEngine = new GameEngine(this.taskManager, this.ui);
    }

    /**
     * Initializes the application and attaches event listeners.
     */
    start() {
        this.ui.setTitle();
        this.ui.createGoButtonTitle();
        this.ui.createGoButton();

        this.ui.goBtn.addEventListener("click", () => {
            const input = document.getElementById("memoryGameNumInput").value;

            if (!this.validator.validNumberRange(input)) {
                this.ui.showMsg(STRINGS.ERROR_MSG_NUM_INPUT);
                return;
            }

            this.gameEngine.startGame(Number(input));
        });
    }
}

/**
 * Handles all UI-related operations and DOM interactions.
 */
export class UserInterface {

    /**
     * @param {HTMLElement} rootElement - Element used for displaying messages
     */
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.goBtn = document.getElementById("memoryGameGoBtn");
        this.label = document.getElementById("memoryGameInputLabel");
        this.title = document.getElementById("labZeroTitle");
    }

    /**
     * Displays a message to the user.
     * @param {string} msg - Message to display
     */
    showMsg(msg) {
        this.rootElement.textContent = msg;
    }

    /**
     * Sets the application title.
     */
    setTitle() {
        this.title.textContent = STRINGS.APP_TITLE;
    }

    /**
     * Sets the label text for the number input.
     */
    createGoButtonTitle() {
        this.label.textContent = STRINGS.GO_BTN_TITLE;
    }

    /**
     * Sets the text for the Go button.
     */
    createGoButton() {
        this.goBtn.textContent = STRINGS.GO_BTN;
    }
}

/**
 * Manages game state and tracks button order.
 */
export class TaskManager {

    /**
     * Initializes task tracking data.
     */
    constructor() {
        this.amountOfButtons = [];
        this.currentIndex = 0;
    }

    /**
     * Increments the current index when the correct button is clicked.
     */
    correctButtonClicked() {
        this.currentIndex++;
    }

    /**
     * Adds a button to the internal tracking list.
     * @param {HTMLButtonElement} btn - Button element to track
     */
    addButton(btn) {
        this.amountOfButtons.push(btn);
    }

    /**
     * Resets all game tracking data.
     */
    resetGame() {
        this.amountOfButtons = [];
        this.currentIndex = 0;
    }

    /**
     * Determines whether all buttons have been correctly clicked.
     * @returns {boolean} True if the game is complete
     */
    isComplete() {
        return this.currentIndex === this.amountOfButtons.length;
    }
}

/**
 * Controls game logic, layout, animation, and user interaction.
 */
export class GameEngine {

    /**
     * @param {TaskManager} taskManager - Manages button order and progress
     * @param {UserInterface} ui - UI controller
     */
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.container = document.getElementById("boxGameArea");
        this.isClickable = false;
        this.scrambleCount = 0;
    }

    /**
     * Starts a new game with the given number of buttons.
     * @param {number} n - Number of buttons to generate
     */
    startGame(n) {
        this.reset();
        this.createButtons(n);
        this.layoutInRow();
        this.showInitialNumbers();

        setTimeout(() => {
            this.startScrambling(n);
        }, n * 1000);
    }

    /**
     * Resets the game state and clears all buttons.
     */
    reset() {
        this.taskManager.resetGame();
        this.isClickable = false;
        this.scrambleCount = 0;
        this.clearButtons();
    }

    /**
     * Dynamically creates buttons and appends them to the game area.
     * @param {number} n - Number of buttons to create
     */
    createButtons(n) {
        for (let i = 0; i < n; i++) {
            const btn = document.createElement("button");
            btn.classList.add("memory-btn");
            btn.style.backgroundColor = this.getRandomColor();
            btn.textContent = i + 1;
            btn.disabled = true;
            btn.dataset.order = i;
            this.container.appendChild(btn);
            this.taskManager.addButton(btn);
            btn.addEventListener("click", () => this.handleClick(btn));
        }
    }

    /**
     * Removes all buttons from the game area.
     */
    clearButtons() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    /**
     * Lays out buttons in rows and wraps to the next line if necessary.
     */
    layoutInRow() {
        let x = 0;
        let y = 10;
        const padding = 10;
        const containerWidth = this.container.clientWidth;

        this.taskManager.amountOfButtons.forEach(btn => {
            if (x + btn.offsetWidth > containerWidth) {
                x = 0;                           // reset to start of row
                y += btn.offsetHeight + padding; // move down to next row
            }

            btn.style.left = `${x}px`;
            btn.style.top = `${y}px`;
            x += btn.offsetWidth + 10;
        });
    }

    /**
     * Displays the initial button numbers.
     */
    showInitialNumbers() {
        this.taskManager.amountOfButtons.forEach((btn, index) => {
            btn.textContent = index + 1;
        });
    }

    /**
     * Begins scrambling buttons for the memory phase.
     * @param {number} n - Number of scramble iterations
     */
    startScrambling(n) {
        const interval = setInterval(() => {
            this.moveButtonsRandomly();
            this.scrambleCount++;

            if (this.scrambleCount === n) {
                clearInterval(interval);
                this.prepareForUserInput();
            }
        }, 2000);
    }

    /**
     * Randomly repositions buttons within the container bounds.
     */
    moveButtonsRandomly() {
        const areaRect = this.container.getBoundingClientRect();

        this.taskManager.amountOfButtons.forEach(btn => {
            const maxX = areaRect.width - btn.offsetWidth;
            const maxY = areaRect.height - btn.offsetHeight;

            const x = Math.random() * Math.max(0, maxX);
            const y = Math.random() * Math.max(0, maxY);

            btn.style.left = `${x}px`;
            btn.style.top = `${y}px`;
        });
    }

    /**
     * Enables user interaction after scrambling is complete.
     */
    prepareForUserInput() {
        this.hideAllNumbers();
        this.enableButtons();
        this.isClickable = true;
    }

    /**
     * Hides all button numbers.
     */
    hideAllNumbers() {
        this.taskManager.amountOfButtons.forEach(btn => {
            btn.textContent = "";
        });
    }

    /**
     * Enables all buttons for clicking.
     */
    enableButtons() {
        this.taskManager.amountOfButtons.forEach(btn => {
            btn.disabled = false;
        });
    }

    /**
     * Handles a button click and determines correctness.
     * @param {HTMLButtonElement} btn - The clicked button
     */
    handleClick(btn) {
        if (!this.isClickable) return;

        const expected = this.taskManager.currentIndex;
        const actual = Number(btn.dataset.order);

        if (actual === expected) {
            this.revealCorrect(btn);
            this.taskManager.correctButtonClicked();

            if (this.taskManager.isComplete()) {
                this.ui.showMsg(STRINGS.VICTORY_MSG);
                this.endGame();
            }
        } else {
            this.ui.showMsg(STRINGS.DEFEAT_MSG);
            this.revealAll();
            this.endGame();
        }
    }

    /**
     * Reveals the number on the correctly clicked button.
     * @param {HTMLButtonElement} btn - Button to reveal
     */
    revealCorrect(btn) {
        btn.textContent = Number(btn.dataset.order) + 1;
    }

    /**
     * Reveals all button numbers.
     */
    revealAll() {
        this.taskManager.amountOfButtons.forEach((btn, index) => {
            btn.textContent = index + 1;
        });
    }

    /**
     * Ends the game and disables all buttons.
     */
    endGame() {
        this.isClickable = false;
        this.taskManager.amountOfButtons.forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * Generates a random background color for buttons.
     * @returns {string} RGB color string
     */
    getRandomColor() {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

/**
 * Validates numeric input.
 */
export class FormValidator {
    constructor(minValue, maxValue) {
        this.minValue = minValue;
        this.maxValue = maxValue
    }

    validNumberRange(input) {
        const stringToNum = Number(input);
        return Number.isInteger(stringToNum) &&
            stringToNum >= this.minValue &&
            stringToNum <= this.maxValue;
    }
}

const ui = new UserInterface(document.getElementById("victoryDefeatMessage"));
const app = new AppController(ui);
app.start();