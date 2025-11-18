// --- The Divine Intelligence (Upgraded) ---

// STEP 1: Your existing Relevance Embed Code
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://embed.relevance.ai/embed.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'relevance-sdk'));

window.addEventListener('relevance-ready', function () {
    window.relevance.embed({
        appId: "c3d65595-930e-4a8a-9049-6157531e1b7c", // Your App ID
        containerId: "relevance-embed"
    });
});

// STEP 2: The Viceroy's Listening Post (NEW LOGIC)
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
            // The Bridge Logic: Handles both old and new agent formats
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