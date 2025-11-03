/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// URL of Cloudflare Worker
const workerURL = "https://loreal-worker.dark-gate5480.workers.dev/";

// System prompt: Only answer L'Oréal product and routine questions
const systemPrompt = "You are a helpful assistant for L'Oréal. Only answer questions about L'Oréal products, routines, and beauty advice. Politely refuse unrelated questions.";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the form from reloading the page

  // Get the user's message from the input field
  const userMessage = userInput.value.trim();
  if (!userMessage) return; // Do nothing if input is empty

  // Show the user's message in the chat window
  chatWindow.innerHTML = `<b>You:</b> ${userMessage}<br><i>Thinking...</i>`;

  // Create the messages array for the API
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  try {
    // Send a POST request to the Cloudflare Worker
    const response = await fetch(workerURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    // Parse the JSON response
    const data = await response.json();

    // Get the assistant's reply from the response
    const botReply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content
      : "Sorry, I couldn't get a response.";

    // Show both user and bot messages in the chat window
    chatWindow.innerHTML = `<b>You:</b> ${userMessage}<br><b>L'Oréal Assistant:</b> ${botReply}`;
  } catch (error) {
    // Show an error message if something goes wrong
    chatWindow.innerHTML = `<b>You:</b> ${userMessage}<br><b>Error:</b> Could not connect to the assistant.`;
  }

  // Clear the input field
  userInput.value = "";
});
