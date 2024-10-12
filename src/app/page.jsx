"use client";

import { useState, useRef, useEffect } from "react";

import { FiGithub, FiCopy } from "react-icons/fi";
import LoadingOverlay from "./components/LoadingOverlay";
import FeedbackForm from "./components/FeedbackForm";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";

export default function Home() {
  const [inputRequest, setInputRequest] = useState("");
  const [responseStream, setResponseStream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [language, setLanguage] = useState("");

  const controllerRef = useRef(null);

  const handleOpenFeedbackForm = (e) => {
    setIsFeedbackFormOpen(!isFeedbackFormOpen);
  };

  const handleCloseFeedbackForm = () => {
    setIsFeedbackFormOpen(false);
  };

  const handleReset = () => {
    setInputRequest("");
    setResponseStream("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseStream("");

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputRequest,
        }),

        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data", response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";
      let detectedLanguage = ""; // To store detected language
      let isCodeSet = false; // To check if code has been set

      const handleStream = async () => {
        let done = false;
        setIsStreaming(true);

        try {
          while (!done) {
            const { value, done: doneReading } = await reader.read();

            done = doneReading;
            const chunkValue = decoder.decode(value);
            accumulatedResponse += chunkValue;

            if (!isCodeSet) {
              const match = accumulatedResponse.match(/```(\w+)\n/);
              if (match) {
                detectedLanguage = match[1]; // Extracted language
                setLanguage(detectedLanguage); // Update state with detected language
                isCodeSet = true; // Mark that we've detected the language
                setResponseStream((prev) => prev + accumulatedResponse);
              }
            } else {
              setResponseStream((prev) => prev + chunkValue);
            }
          }
          //   setResponseStream(responseStream.replace("```", ""));
        } catch (e) {
          console.error("Error: ", e);
        } finally {
          setIsStreaming(false);
        }
      };

      handleStream();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopStreaming = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const handleCopy = () => {
    console.log("Writing");
    if (responseStream != "") {
      navigator.clipboard.writeText(responseStream);
      toast.success("Response Copied!");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center w-full">
      <div className="border rounded border-white/0 xl:w-full max-w-full xl:px-96 px-8 xl:py-28 py-10 overflow-hidden">
        <h1 className="text-center text-2xl md:text-3xl font-bold bg-clip-text">
          Paste Your Code Snippet And Have A Sip!
        </h1>

        <form className="mt-6 flex flex-col gap-4 w-[100%] mx-auto">
          {/* INPUT FIELD */}
          <div>
            <CodeMirror
              value={inputRequest}
              theme={dracula}
              height="500px"
              width="100%"
              maxWidth="100%"
              onChange={(value, ViewUpdate) => {
                setInputRequest(value);
              }}
              placeholder="Paste Your Code Here..."
              extensions={[python()]}
            />
          </div>

          <div className="mx-auto mt-4">
            {isStreaming ? (
              <button
                type="button"
                className="resetBtn"
                onClick={handleStopStreaming}
              >
                Cancel
              </button>
            ) : (
              <button type="button" className="genBtn" onClick={handleSubmit}>
                Generate
              </button>
            )}
          </div>
        </form>

        <LoadingOverlay isLoading={isLoading} />

        {/* Output FIELD */}
        <div className="mt-8 relative w-[100%] mx-auto">
          <SyntaxHighlighter language={language} style={oneDark}>
            {responseStream}
          </SyntaxHighlighter>
          <FiCopy
            size={24}
            className="absolute cursor-pointer"
            onClick={handleCopy}
          />
        </div>

        <div className="mx-auto mt-4 text-center">
          <button onClick={handleOpenFeedbackForm} className="feedbackBtn">
            Feedback
          </button>

          <button onClick={handleReset} className="resetBtn">
            Reset
          </button>
        </div>

        {isFeedbackFormOpen && (
          <FeedbackForm
            onClose={handleCloseFeedbackForm}
            inputRequest={inputRequest}
            outputResponse={responseStream}
          />
        )}
      </div>
      <a
        className="bottom-full flex items-center gap-2 pb-2 font-mono text-sm text-neutral-950 transition hover:text-blue-800 sm:m-0"
        href="https://github.com/PhamVuThuNguyet"
        target="_blank"
      >
        <FiGithub size={16} />
        Built with Next.js / Tailwind / OpenAI
      </a>
    </div>
  );
}
