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
 * Controls the main index page of the application.
 * Responsible for initializing the UI and setting
 * page title and navigation links.
 */
export class AppController {

    /**
     * @param {UserInterface} ui - The UI handler for the index page
     */
    constructor(ui) {
        this.ui = ui;
    }

    /**
     * Starts the application by initializing UI elements.
     */
    start() {
        this.ui.setTitle();
        this.ui.setWriterHyperlink();
        this.ui.setReaderHyperlink();
    }
}

/**
 * Handles DOM manipulation for the index page.
 */
export class UserInterface {

    /**
     * Initializes references to DOM elements.
     */
    constructor() {
        this.title = document.getElementById("labOneTitle");
        this.writerHyperlink = document.getElementById("writerHyperlinkLabel");
        this.readerHyperlink = document.getElementById("readerHyperlinkLabel");
    }

    /**
     * Sets the application title with student information.
     */
    setTitle() {
        this.title.textContent = `${STRINGS.APP_TITLE} - ${STRINGS.STUDENT_NAME} (${STRINGS.STUDENT_ID})`;
    }

    /**
     * Sets the writer page hyperlink label.
     */
    setWriterHyperlink() {
        this.writerHyperlink.textContent = STRINGS.WRITER_HYPERLINK;
    }

    /**
     * Sets the reader page hyperlink label.
     */
    setReaderHyperlink() {
        this.readerHyperlink.textContent = STRINGS.READER_HYPERLINK;
    }
}

const ui = new UserInterface();
const app = new AppController(ui);
app.start();