// --- The Divine Intelligence: The Patient Law ---

const PUBLISHABLE_KEY = 'pk_test_c2ltcGxlLWZseS05OS5jbGVyay5hY2NvdW50cy5kZXYk';

const signInContainer = document.getElementById('sign-in-container');
const userButton = document.getElementById('user-button');
const appContent = document.getElementById('app-content');

// This function contains all logic that depends on Clerk
function startClerk() {
    const Clerk = window.Clerk;
    const clerk = new Clerk(PUBLISHABLE_KEY);

    clerk.load().then(() => {
        clerk.addListener(({ user }) => {
            if (user) {
                signInContainer.style.display = 'none';
                appContent.style.display = 'flex';
                clerk.mountUserButton(userButton);
                initializeRelevance(clerk);
            } else {
                appContent.style.display = 'none';
                signInContainer.style.display = 'flex';
                userButton.innerHTML = '';
                clerk.mountSignIn(signInContainer);
            }
        });
    }).catch(error => {
        console.error("Clerk failed to load:", error);
    });
}

// This waits for the entire page (including the async Clerk script) to load
window.onload = function() {
    // We will check every 100ms until the Clerk object is available
    const clerkInterval = setInterval(() => {
        if (window.Clerk) {
            clearInterval(clerkInterval);
            startClerk();
        }
    }, 100);
};

async function initializeRelevance(clerk) {
    try {
        const token = await clerk.session.getToken({ template: 'relevance-jwt' });
        
        if (window.relevance) {
            embedRelevance(token);
        } else {
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://embed.relevance.ai/embed.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'relevance-sdk'));

            window.addEventListener('relevance-ready', () => embedRelevance(token));
        }
    } catch (error) {
        console.error("Error initializing Relevance:", error);
    }
}

function embedRelevance(token) {
    window.relevance.embed({
        appId: "c3d65595-930e-4a8a-9049-6157531e1b7c",
        containerId: "relevance-embed",
        token: token
    });
}

// --- The Viceroy's Listening Post (Unchanged) ---
const messageList = document.getElementById('message-list');
const verdictPanel = document.getElementById('verdict-panel');
const verdictContent = document.getElementById('verdict-content');

window.addEventListener('message', function(event) {
    if (event.origin !== 'https://embed.relevance.ai') return;
    const { type, content, sender } = event.data;
    if (type === 'message') {
        if (sender === 'user') { addMessageToChat('user', content); }
        else if (sender === 'bot') {
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
        verdictItem.innerHTML = `<p><strong>Phrase:</strong> "${item.phrase}"</p><p><strong>Category:</strong> ${item.category}</p><p><strong>Sovereign Refactor:</strong> "${item.sovereignRefactor}"</p>`;
        verdictContent.appendChild(verdictItem);
    });
    verdictPanel.style.display = 'block';
}