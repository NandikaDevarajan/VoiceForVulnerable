<script>
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const readResultBtn = document.getElementById('read-result-btn');
    let lastBotResponse = ''; // To store the latest bot response for reading
    let speechSynthesisActive = false; // Track whether speech is ongoing

    // Handle send button click
    sendBtn.addEventListener('click', () =>
    {
        let question = userInput.value;
        if (question)
        {
			addUserMessageToChat(question);
            queryApi(question);
        }
    });

    // Handle voice input (Speech recognition)
    voiceBtn.addEventListener('click', () =>
    {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = function (event)
        {
            const speechToText = event.results[0][0].transcript;
            userInput.value = speechToText;
			addUserMessageToChat(speechToText);
            queryApi(speechToText);
        }
    });

    // Function to add messages to the chat box
    function addUserMessageToChat(message)
    {
		const chatMessage= `<div class="msg left-msg"><div class="msg-img" style="background-image: url(../asset/images/avathar.web)"></div><div class="msg-bubble"><div class="msg-info"><div class="msg-info-name">User</div></div><div class="msg-text">{:$message}</div></div></div>`;
        chatBox.innerHTML += chatMessage;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }

    function addBotMessageToChat(message)
    {
		const chatMessage= `<div class="msg right-msg"><div class="msg-img" style="background-image: url(../asset/images/probot-chat.webp)"></div><div class="msg-bubble"><div class="msg-info"><div class="msg-info-name">PrepBot:</div></div><div class="msg-text">{:$message}</div></div></div>`;
        chatBox.innerHTML += chatMessage;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }


    // Function to query your API
    function queryApi(question)
    {
        fetch('/Home/GetResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        })
            .then(response => response.json())
            .then(data =>
            {
				addBotMessageToChat(data.Response);
                lastBotResponse = data.response; // Store the last bot response for reading
            })
            .catch(error =>
            {
				addBotMessageToChat('An error occurred. Please try again.');
            });
    }

    // Handle read result button click (Text-to-Speech)
    readResultBtn.addEventListener('click', () =>
    {
        const synth = window.speechSynthesis;
        if (speechSynthesisActive)
        {
            // Stop the speech if it's already playing
            synth.cancel();
            speechSynthesisActive = false;
        } else if (lastBotResponse)
        {
            // Speak the bot's response if not already active
            const utterance = new SpeechSynthesisUtterance(lastBotResponse);
            synth.speak(utterance);
            speechSynthesisActive = true;

            utterance.onend = () =>
            {
                speechSynthesisActive = false; // Reset the flag when speech ends
            };
        }
    });
</script>
