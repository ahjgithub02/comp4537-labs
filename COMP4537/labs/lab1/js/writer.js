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
import { Note } from "./note.js";

const STORAGE_KEY = "lab1_notes";

/**
 * Controls the writer page, allowing users to
 * create, remove, and save notes to localStorage.
 */
export class AppController {

    /**
     * @param {UserInterface} ui - The writer UI handler
     */
    constructor(ui) {
        this.ui = ui;
        this.notes = [];
        this.nextId = 0;
    }

    /**
     * Initializes the writer page and autosave behavior.
     */
    start() {
        this.ui.setStoredAt();
        this.ui.setGoBackHyperlink();
        this.ui.setAddButton(() => this.addNote());

        this.loadNotes();
        this.startAutoSave();
    }

    /**
     * Adds a new note to the page.
     * @param {string} content - Optional initial content
     */
    addNote(content = "") {
        const note = new Note(
            this.nextId++,
            content,
            this.ui.notesContainer,
            (id) => this.removeNote(id)
        );

        this.notes.push(note);
    }

    /**
     * Removes a note from the internal list and saves changes.
     * @param {number} id - ID of the note to remove
     */
    removeNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
    }

    /**
     * Saves all notes to localStorage.
     */
    saveNotes() {
        const data = this.notes.map(note => note.getData());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.ui.updateStoredTime();
    }

    /**
     * Loads saved notes from localStorage.
     */
    loadNotes() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return;

        const parsed = JSON.parse(raw);
        parsed.forEach(noteData => {
            this.addNote(noteData.content);
        });
    }

    /**
     * Automatically saves notes at a fixed interval.
     */
    startAutoSave() {
        setInterval(() => {
            this.saveNotes();
        }, 2000);
    }
}

/**
 * Handles DOM updates for the writer page.
 */
export class UserInterface {

    /**
     * Initializes writer UI elements.
     */
    constructor() {
        this.storedAt = document.getElementById("writerStoredAt");
        this.notesContainer = document.getElementById("notesContainer");
        this.addButton = document.getElementById("writerAddButton");
        this.goBackHyperlink = document.getElementById("writerBackButton");
    }

    /**
     * Sets the initial stored message.
     */
    setStoredAt() {
        this.storedAt.textContent = STRINGS.WRITER_LAST_STORED_MSG;
    }

    /**
     * Updates the last saved timestamp.
     */
    updateStoredTime() {
        const now = new Date().toLocaleTimeString();
        this.storedAt.textContent = `${STRINGS.WRITER_LAST_STORED_MSG} ${now}`
    }

    /**
     * Configures the add note button.
     * @param {Function} handler - Click handler function
     */
    setAddButton(handler) {
        this.addButton.textContent = STRINGS.ADD_NOTE_BTN;
        this.addButton.addEventListener("click", handler);
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
