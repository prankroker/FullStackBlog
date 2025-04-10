import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function ChatbotPage() {
  const [responses, setResponses] = useState([]);
  const inputRef = useRef("");
  const handleSubmit = () => {
    const userText = inputRef.current.value.trim();
    if (!userText) return;

    const updatedMessages = [...responses, { role: "user", text: userText }];

    setResponses(updatedMessages);
    inputRef.current.value = "";

    const payload = {
      model: "llama3.2",
      messages: updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      })),
      stream: false,
    };

    try {
      axios
        .post("http://localhost:11434/api/chat", payload)
        .then((response) => {
          setResponses([
            ...updatedMessages,
            { role: "assistant", text: response.data.message.content },
          ]);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1>What can I help you with:</h1>
      <div className="chatix">
        <div className="response">
          {responses.map((item) => {
            return <div className={item.role}>{item.text}</div>;
          })}
        </div>
        <div className="controls">
          <input
            type="text"
            placeholder="Ask anything: "
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          ></input>
          <button className="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatbotPage;
