// --- The Divine Intelligence: The Unified Law ---

const publishableKey = 'pk_test_c2ltcGxlLWZseS05OS5jbGVyay5hY2NvdW50cy5kZXYk'; // Your Clerk Key

const signInContainer = document.getElementById('sign-in-container');
const userButton = document.getElementById('user-button');
const appContent = document.getElementById('app-content');

const Clerk = window.Clerk;
const clerk = new Clerk(publishableKey);

clerk.load();

clerk.addListener(({ user }) => {
    if (user) {
        // User is signed in
        signInContainer.style.display = 'none';
        appContent.style.display = 'flex'; // Reveal the Citadel
        clerk.mountUserButton(userButton);
        initializeRelevance();
    } else {
        // User is signed out
        appContent.style.display = 'none';
        signInContainer.style.display = 'flex';
        clerk.mountSignIn(signInContainer);
    }
});

async function initializeRelevance() {
    try {
        const token = await clerk.session.getToken({ template: 'relevance-jwt' });
        
        // Load the Relevance SDK
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                // If SDK already exists, just embed
                window.relevance.embed({
                    appId: "c3d65595-930e-4a8a-9049-6157531e1b7c",
                    containerId: "relevance-embed",
                    token: token
                });
                return;
            }
            js = d.createElement(s); js.id = id;
            js.src = "https://embed.relevance.ai/embed.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'relevance-sdk'));

        // Embed the agent once the SDK is ready
        window.addEventListener('relevance-ready', function () {
            window.relevance.embed({
                appId: "c3d65595-930e-4a8a-9049-6157531e1b7c",
                containerId: "relevance-embed",
                token: token
            });
        });

    } catch (error) {
        console.error("Error initializing Relevance:", error);
    }
}

// --- The Viceroy's Listening Post ---
const messageList = document.getElementById('message-list');
const verdictPanel = document.getElementById('verdict-panel');
const verdictContent = document.getElementById('verdict-content');

window.addEventListener('message', function(event) {
    if (event.origin !== 'https://embed.relevance.ai') return;

    const { type, content, sender } = event.data;

    if (type === 'message') {
        if (sender === 'user') {
            addMessageToChat('user', content);
        } else if (sender === 'bot') {
            try {
                const data = JSON.parse(content);
                addMessageToChat('aura', data.aiResponse);
                displayVerdict(data.linguisticVerdict);
            } catch (error) {
                addMessageToChat('aura', content);
                verdictPanel.style.display = 'none';
            }
        }
    }
});

function addMessageToChat(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    messageList.appendChild(messageDiv);
    messageList.scrollTop = messageList.scrollHeight;
}

function displayVerdict(verdict) {
    if (!verdict || !verdict.phrasesFound || verdict.phrasesFound.length === 0) {
        verdictPanel.style.display = 'none';
        return;
    }
    verdictContent.innerHTML = '';
    verdict.phrasesFound.forEach(item => {
        const verdictItem = document.createElement('div');
        verdictItem.classList.add('verdict-item');
        verdictItem.innerHTML = `
            <p><strong>Phrase:</strong> "${item.phrase}"</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Sovereign Refactor:</strong> "${item.sovereignRefactor}"</p>
        `;
        verdictContent.appendChild(verdictItem);
    });
    verdictPanel.style.display = 'block';
}