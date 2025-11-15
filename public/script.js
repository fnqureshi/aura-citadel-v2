// This key will be replaced by Vercel during the build process
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
}

// Create a new script element to load Clerk.js
const clerkScript = document.createElement('script');
clerkScript.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
clerkScript.async = true;
clerkScript.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
clerkScript.crossOrigin = "anonymous";

// Add a listener to run code once Clerk.js is loaded
clerkScript.addEventListener('load', async function () {
    await window.Clerk.load();

    // Get references to all the necessary HTML elements
    const userButtonDiv = document.getElementById('user-button');
    const appContent = document.getElementById('app-content');
    const signInContainer = document.getElementById('sign-in-container');
    const iframeContainer = document.getElementById('iframe-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorContainer = document.getElementById('error-container');

    // Mount Clerk's pre-built components
    window.Clerk.mountUserButton(userButtonDiv);

    // Add a listener to react to authentication state changes
    window.Clerk.addListener(({ user }) => {
        if (user) {
            // User is signed in
            signInContainer.style.display = 'none';
            appContent.style.display = 'block';
            loadEmbed(user.id); // Pass the stable user ID to the embed function
        } else {
            // User is signed out
            appContent.style.display = 'none';
            signInContainer.style.display = 'block';
            // Mount the sign-in button if the user is logged out
            window.Clerk.mountSignIn(signInContainer);
        }
    });

    /**
     * Fetches the embed URL and appends the user's stable ID as the conversation ID.
     * @param {string} userId - The stable user ID from Clerk.
     */
    async function loadEmbed(userId) {
        loadingSpinner.style.display = 'block';
        errorContainer.style.display = 'none';
        iframeContainer.innerHTML = ''; // Clear old content

        try {
            const response = await fetch('/api/embed-url');
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
            
            const data = await response.json();
            if (data.url) {
                // Use the stable user ID for session persistence
                const personalizedUrl = `${data.url}&conversation_id=${userId}`;
                
                const iframe = document.createElement('iframe');
                iframe.src = personalizedUrl;
                
                loadingSpinner.style.display = 'none';
                iframeContainer.appendChild(iframe);
            } else {
                throw new Error('Embed URL was not provided by the server.');
            }
        } catch (error) {
            console.error('Error:', error);
            loadingSpinner.style.display = 'none';
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = `<p>Error: Could not load the conversation.</p>`;
        }
    }
});

// Append the script to the document head to start loading Clerk
document.head.appendChild(clerkScript);
