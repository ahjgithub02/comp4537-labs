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

/**
 * Represents a single note in the writer view.
 * Each note contains a textarea and a remove button.
 */
export class Note {
    
    /**
     * @param {number} id - Unique identifier for the note
     * @param {string} content - Initial text content
     * @param {HTMLElement} parentContainer - Container to append the note to
     * @param {Function} onRemoveCallback - Callback executed when note is removed
     */  
    constructor(id, content, parentContainer, onRemoveCallback) {
        this.id = id;
        this.parentContainer = parentContainer;
        this.onRemoveCallback = onRemoveCallback;

        this.textarea = document.createElement("textarea");
        this.textarea.value = content || "";

        this.removeButton = document.createElement("button");
        this.removeButton.textContent = STRINGS.REMOVE_NOTE_BTN;

        this.removeButton.addEventListener("click", () => {
            this.remove();
        });

        this.parentContainer.appendChild(this.textarea);
        this.parentContainer.appendChild(this.removeButton);
    }

    /**
     * Returns the note data in a serializable format.
     * @returns {{id: number, content: string}}
     */
    getData() {
        return {
            id: this.id,
            content: this.textarea.value
        };
    }

    /**
     * Removes the note from the DOM and notifies the controller.
     */
    remove() {
        this.textarea.remove();
        this.removeButton.remove();
        this.onRemoveCallback(this.id);
    }
}