/**
 * AI Usage Acknowledgment
 * I used generative AI (ChatGPT-5.2 (https://chat.openai.com/)) to:
 * - Assist with understanding JavaScript concepts
 *      > Clarifying how localStorage works with JSON.stringify and JSON.parse
 *      > Understanding the difference between DOM manipulation and application state
 *          ~ DOM manipulation changes what the user sees. Application state is the 
 *            underlying data your app uses to decide what to show. 
 * - Debugging issues related to localStorage behavior
 * - Improving code documentation using Javadoc-style comments. 
 * 
 * All code was written and implemented by me, and AI was used as 
 * a learning and support tool rather than a source of direct solutions.
 * 
 * @author Andrew Hwang
 * @version 1.0
 */
import { STRINGS } from "../lang/messages/en/user.js";

const STORAGE_KEY = "lab1_notes";

/**
 * Controls the reader page, which displays notes
 * stored in localStorage in read-only mode.
 */
export class AppController {

    /**
     * @param {UserInterface} ui - The reader UI handler
     */
    constructor(ui) {
        this.ui = ui;
    }

    /**
     * Initializes the reader view and starts auto-retrieval.
     */
    start() {
        this.ui.setGoBackHyperlink();
        this.loadNotes();
        this.startAutoRetrieve();
    }

    /**
     * Loads notes from localStorage and displays them.
     */
    loadNotes() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            this.ui.clearNotes();
            return;
        }

        const notes = JSON.parse(raw);
        this.ui.displayNotes(notes);
        this.ui.updateRetrievedTime();
    }

    /**
     * Periodically refreshes notes from localStorage.
     */
    startAutoRetrieve() {
        setInterval(() => {
            this.loadNotes();
        }, 2000);
    }
}

/**
 * Handles DOM updates for the reader page.
 */
export class UserInterface {

    /**
     * Initializes reader UI elements.
     */
    constructor() {
        this.updatedAt = document.getElementById("readerUpdatedAt");
        this.notesContainer = document.getElementById("readerNotesContainer");
        this.goBackHyperlink = document.getElementById("readerBackButton");
    }

    /**
     * Displays notes in read-only textareas.
     * @param {Array} notes - Array of stored note objects
     */
    displayNotes(notes) {
        this.clearNotes();

        notes.forEach(note => {
            const textarea = document.createElement("textarea");
            textarea.value = note.content;
            textarea.readOnly = true;
            this.notesContainer.appendChild(textarea);
        });
    }

    /**
     * Clears all displayed notes.
     */
    clearNotes() {
        this.notesContainer.innerHTML = "";
    }

    /**
     * Updates the last retrieved timestamp.
     */
    updateRetrievedTime() {
        const now = new Date().toLocaleTimeString();
        this.updatedAt.textContent = `${STRINGS.READER_UPDATED_MSG} ${now}`;
    }

    /**
     * Sets the back navigation link text.
     */
    setGoBackHyperlink() {
        this.goBackHyperlink.textContent = STRINGS.BACK_BTN;
    }
}

const ui = new UserInterface();
const app = new AppController(ui);
app.start();