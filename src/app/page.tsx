"use client";

import { postMessage, Style } from "@/action/ai";
import { useState } from "react";

type Message = {
  message: string;
  type: "in" | "out";
};

const defaultStyle: Style = {
  outputMessages: {
    backgroundColor: "#f0f8ff",
    borderRadius: "8px",
    borderColor: "#d1d5db",
    color: "#333333",
    padding: "12px",
    borderWidth: "1px",
  },
  inputMessages: {
    backgroundColor: "#e0f7fa",
    borderRadius: "8px",
    borderColor: "#b2ebf2",
    color: "#333333",
    padding: "12px",
    borderWidth: "1px",
  },
  inputBox: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    borderColor: "#d1d5db",
    color: "#333333",
    padding: "10px",
    borderWidth: "1px",
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: "8px",
    borderColor: "#0056b3",
    color: "#ffffff",
    padding: "10px 15px",
    borderWidth: "1px",
    cursor: "pointer",
  },
  background: {
    backgroundColor: "#f9fafb",
  },
  chatBox: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    borderColor: "#d1d5db",
    borderWidth: "1px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    backgroundColor: "transparent",
    borderRadius: "8px",
    borderColor: "transparent",
    color: "#007bff",
    padding: "10px",
    borderWidth: "0px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default function Home() {
  const [style, setStyle] = useState<Style>(defaultStyle);

  const helloMessage = "hello! I am a chatbot. How can I help you today?";

  const initMsgs: Message[] = [{ message: helloMessage, type: "out" }];

  const [messages, setMessages] = useState<Message[]>(initMsgs);

  const [input, setInput] = useState("");

  const [loadingOutput, setLoadingOutput] = useState(false);

  const sendMessage = async () => {
    if (input === "") return;

    setLoadingOutput(true);

    const newMessages = [...messages, { message: input, type: "in" }];

    setMessages(newMessages as Message[]);

    setInput("");

    const { error, message, styles } = await postMessage(input);

    if (error || !styles) {
      setMessages((msgs) => [...msgs, { message: "ERROR", type: "out" }]);
      setLoadingOutput(false);
      return;
    }

    console.log({ styles });

    setStyle((prev) => ({ ...prev, ...styles }));
    setMessages((msgs) => [...msgs, { message, type: "out" } as Message]);
    setLoadingOutput(false);
  };

  return (
    <html lang="en">
      <body
        style={style?.background}
        className="flex flex-col items-center w-screen"
      >
        <div className="overflow-hidden !h-screen max-w-[950px] w-full  !box-border flex flex-col justify-between items-center !p-4 gap-4">
          <div style={style?.title}>UI Chat generator</div>
          <div
            className="flex flex-col gap-1 h-full w-full overflow-auto "
            style={style?.chatBox}
          >
            {messages.map((msg, i) => (
              <div
                style={
                  msg.type === "in"
                    ? style?.inputMessages
                    : style?.outputMessages
                }
                className={`!w-fit !max-w-[90%]  ${
                  msg.type === "in" ? "self-end" : "self-start"
                }`}
                key={i}
              >
                {msg.message}
              </div>
            ))}
            {loadingOutput && (
              <div style={style?.outputMessages} className="!w-fit">
                ...
              </div>
            )}
          </div>
          <div className="w-full flex gap-2 justify-center">
            <input
              style={style?.inputBox}
              className="w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              onKeyUp={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              type="submit"
              onClick={sendMessage}
              style={style?.sendButton}
            >
              send
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
