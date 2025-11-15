// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary HTML elements
    const iframeContainer = document.getElementById('iframe-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorContainer = document.getElementById('error-container');
    const clearConversationBtn = document.getElementById('clear-conversation-btn');

    /**
     * Gets a unique conversation ID from local storage.
     * If one doesn't exist, it creates and saves a new one.
     */
    function getOrCreateConversationId() {
        const storageKey = 'relevanceAiConversationId_App2'; // Using the unique key for this app
        let conversationId = localStorage.getItem(storageKey);
        if (!conversationId) {
            conversationId = crypto.randomUUID();
            localStorage.setItem(storageKey, conversationId);
        }
        return conversationId;
    }

    /**
     * Fetches the embed URL, appends the conversation ID, and loads the iframe.
     * Manages the visibility of the loading spinner and error messages.
     */
    async function loadEmbed() {
        // Reset UI: show spinner, hide previous errors
        loadingSpinner.style.display = 'block';
        errorContainer.style.display = 'none';
        iframeContainer.innerHTML = ''; // Clear any old iframes or error messages

        try {
            const response = await fetch('/api/embed-url');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.url) {
                const conversationId = getOrCreateConversationId();
                const personalizedUrl = `${data.url}&conversation_id=${conversationId}`;
                
                const iframe = document.createElement('iframe');
                iframe.src = personalizedUrl;
                
                // Hide spinner and add the iframe to the container
                loadingSpinner.style.display = 'none';
                iframeContainer.appendChild(iframe);
            } else {
                throw new Error('Embed URL was not provided by the server.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message and hide spinner
            loadingSpinner.style.display = 'none';
            errorContainer.style.display = 'block';
            // Add the error message and a retry button inside the error container
            errorContainer.innerHTML = `
                <p>Error: Could not load the conversation.</p>
                <button id="retry-btn">Try Again</button>
            `;
            // Add an event listener to the new retry button
            document.getElementById('retry-btn').addEventListener('click', loadEmbed);
        }
    }

    /**
     * Handles the "Clear Conversation" button click.
     * Removes the ID from storage and reloads the page to start a fresh session.
     */
    function handleClearConversation() {
        const storageKey = 'relevanceAiConversationId_App2';
        localStorage.removeItem(storageKey);
        window.location.reload();
    }

    // Attach the event listener to the clear button
    clearConversationBtn.addEventListener('click', handleClearConversation);

    // Initial load of the embedded application
    loadEmbed();
});
