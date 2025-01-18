import dotenv from "dotenv"
require("dotenv").config();
import React, { useState, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import './App.css'; // Import your CSS file



const client = new HfInference(process.env.TOKKEN); // Replace with your actual HF token

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input field immediately

    setLoading(true); // Set loading to true before fetching
    try {
      const chatCompletion = await client.chatCompletion({
        model: "Qwen/QwQ-32B-Preview",
        messages: [...messages, userMessage],
        max_tokens: 500,
      });

      const botMessage = {
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate an answer.", // Access content property
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className="h-96 overflow-y-scroll border-b border-gray-200 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <p
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {message.content} {/* Access the content property here */}
              </p>
            </div>
          ))}
          {loading && <p>Loading...</p>} {/* Display loading message */}
        </div>
        <div className="flex cent">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;