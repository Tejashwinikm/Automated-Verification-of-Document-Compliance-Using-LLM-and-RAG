"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ChatMessage = {
  id: number;
  question: string;
  answer: string;
};

export default function StudentVerification() {
  const [rulesFiles, setRulesFiles] = useState<File[]>([]);
  const [marksFiles, setMarksFiles] = useState<File[]>([]);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [uploadingRules, setUploadingRules] = useState(false);
  const [uploadingMarks, setUploadingMarks] = useState(false);
  const [asking, setAsking] = useState(false);

  // =====================================================
  // LOAD PREVIOUS CHAT HISTORY
  // =====================================================

  useEffect(() => {
    const savedChat = localStorage.getItem("document-ai-chat");

    if (savedChat) {
      try {
        setChatHistory(JSON.parse(savedChat));
      } catch {
        console.log("Could not load previous chat.");
      }
    }
  }, []);

  // =====================================================
  // SAVE CHAT HISTORY
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "document-ai-chat",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  // =====================================================
  // UPLOAD RULES
  // =====================================================

  const uploadRules = async () => {
    if (rulesFiles.length === 0) {
      alert("Please select Rules PDFs");
      return;
    }

    setUploadingRules(true);

    const formData = new FormData();

    rulesFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        alert("Rules uploaded successfully.");
      } else {
        alert("Upload failed.");
      }
    } catch {
      alert("Backend not running.");
    } finally {
      setUploadingRules(false);
    }
  };

  // =====================================================
  // UPLOAD MARKSHEETS
  // =====================================================

  const uploadMarks = async () => {
    if (marksFiles.length === 0) {
      alert("Please select Marksheets");
      return;
    }

    setUploadingMarks(true);

    const formData = new FormData();

    marksFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        alert("Marksheets uploaded successfully.");
      } else {
        alert("Upload failed.");
      }
    } catch {
      alert("Backend not running.");
    } finally {
      setUploadingMarks(false);
    }
  };

  // =====================================================
  // ASK QUESTION
  // =====================================================

  const askQuestion = async () => {
    const currentQuestion = question.trim();

    if (!currentQuestion || asking) {
      return;
    }

    setAsking(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Query failed");
      }

      const data = await res.json();

      const newMessage: ChatMessage = {
        id: Date.now(),
        question: currentQuestion,
        answer: data.answer || "No answer received.",
      };

      setChatHistory((previousHistory) => [
        ...previousHistory,
        newMessage,
      ]);

      setQuestion("");

    } catch {
      const errorMessage: ChatMessage = {
        id: Date.now(),
        question: currentQuestion,
        answer:
          "Server Error. Please check whether the backend is running.",
      };

      setChatHistory((previousHistory) => [
        ...previousHistory,
        errorMessage,
      ]);

      setQuestion("");

    } finally {
      setAsking(false);
    }
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all chat history?"
    );

    if (confirmed) {
      setChatHistory([]);

      localStorage.removeItem(
        "document-ai-chat"
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex h-screen bg-gray-100">

      {/* =================================================
          LEFT SIDEBAR
      ================================================= */}

      <div className="w-80 bg-white shadow-xl overflow-y-auto p-6">

        {/* BRAND */}

        <h1 className="text-3xl font-bold mb-6 text-purple-700">
          VeriQ AI
        </h1>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mb-8 space-y-3">

          {/* STUDENT */}

          <Link
            href="/student"
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition font-semibold text-gray-800"
          >

            <span className="text-xl">
              📄
            </span>

            <span>
              Student Verification
            </span>

          </Link>


          {/* ASSIGNMENT */}

          <Link
            href="/assignments"
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition font-semibold text-gray-800"
          >

            <span className="text-xl">
              📝
            </span>

            <span>
              Assignment Verification
            </span>

          </Link>

        </div>


        {/* =================================================
            RULES DOCUMENTS
        ================================================= */}

        <h2 className="font-semibold mb-3">
          Rules Documents
        </h2>

        <label className="cursor-pointer block border-2 border-dashed border-purple-300 rounded-xl p-5 text-center bg-purple-50 hover:bg-purple-100 transition">

          <p className="font-semibold">
            📄 Choose Rules PDFs
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Maximum 6 PDFs
          </p>

          <input
            hidden
            multiple
            accept=".pdf"
            type="file"
            onChange={(e) => {

              if (!e.target.files) return;

              setRulesFiles(
                Array.from(e.target.files).slice(0, 6)
              );

            }}
          />

        </label>


        <div className="mt-4 space-y-2">

          {rulesFiles.length === 0 ? (

            <p className="text-sm text-gray-500">
              No files selected
            </p>

          ) : (

            rulesFiles.map((file) => (

              <div
                key={file.name}
                className="bg-purple-100 rounded-lg p-2 text-sm"
              >
                📄 {file.name}
              </div>

            ))

          )}

        </div>


        <button
          onClick={uploadRules}
          disabled={
            rulesFiles.length === 0 ||
            uploadingRules
          }
          className={`w-full mt-5 py-3 rounded-xl text-white font-semibold transition ${
            rulesFiles.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >

          {uploadingRules
            ? "Uploading..."
            : "Upload Rules"}

        </button>


        {/* =================================================
            STUDENT MARKSHEETS
        ================================================= */}

        <div className="mt-10"></div>

        <h2 className="font-semibold mb-3">
          Student Marksheets
        </h2>


        <label className="cursor-pointer block border-2 border-dashed border-green-300 rounded-xl p-5 text-center bg-green-50 hover:bg-green-100 transition">

          <p className="font-semibold">
            📄 Choose Marksheets
          </p>

          <p className="text-sm text-gray-500 mt-2">
            PDF, Excel (.xlsx, .xls) or Images
          </p>

          <p className="text-sm text-gray-500">
            Maximum 6 files
          </p>

          <input
            hidden
            multiple
            accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
            type="file"
            onChange={(e) => {

              if (!e.target.files) return;

              setMarksFiles(
                Array.from(e.target.files).slice(0, 6)
              );

            }}
          />

        </label>


        <div className="mt-4 space-y-2">

          {marksFiles.length === 0 ? (

            <p className="text-sm text-gray-500">
              No files selected
            </p>

          ) : (

            marksFiles.map((file) => (

              <div
                key={file.name}
                className="bg-green-100 rounded-lg p-2 text-sm"
              >
                📄 {file.name}
              </div>

            ))

          )}

        </div>


        <button
          onClick={uploadMarks}
          disabled={
            marksFiles.length === 0 ||
            uploadingMarks
          }
          className={`w-full mt-5 py-3 rounded-xl text-white font-semibold transition ${
            marksFiles.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >

          {uploadingMarks
            ? "Uploading..."
            : "Upload Marks"}

        </button>

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div
        className="flex-1 relative flex flex-col"
        style={{
          background:
            "linear-gradient(135deg,#ede9fe,#fdf2f8,#f8fafc)",
        }}
      >

        {/* HEADER */}

        <div className="text-center pt-10 pb-5">

          <h1 className="text-5xl font-bold text-gray-800">
            Student Eligibility Verification
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Upload Scheme Documents & Student Marksheets,
            then ask questions.
          </p>

        </div>


        {/* CHAT HISTORY */}

        <div className="flex-1 overflow-y-auto px-10 pb-6">

          <div className="max-w-5xl mx-auto space-y-6">

            {chatHistory.map((chat) => (

              <div
                key={chat.id}
                className="space-y-4"
              >

                {/* QUESTION */}

                <div className="flex justify-end">

                  <div className="max-w-[75%]">

                    <div className="bg-purple-600 text-white rounded-2xl rounded-br-md px-6 py-4 shadow-md">

                      <p className="font-medium whitespace-pre-wrap">
                        {chat.question}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ANSWER */}

                <div className="flex justify-start">

                  <div className="max-w-[80%]">

                    <div className="bg-white rounded-2xl rounded-bl-md shadow-lg border px-7 py-5">

                      <div className="flex items-center gap-2 mb-3">

                        <span className="text-purple-600 font-bold">
                          VeriQ AI
                        </span>

                      </div>

                      <div className="text-gray-700 whitespace-pre-wrap leading-7">
                        {chat.answer}
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* CLEAR CHAT */}

        {chatHistory.length > 0 && (

          <div className="flex justify-end max-w-5xl w-full mx-auto px-4 pb-2">

            <button
              onClick={clearChat}
              className="text-sm text-red-500 hover:text-red-700"
            >
              🗑 Clear Chat History
            </button>

          </div>

        )}


        {/* QUESTION INPUT */}

        <div className="w-full flex justify-center pb-8 px-8">

          <div className="w-full max-w-5xl flex gap-4">

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ask a question about your uploaded documents..."
              rows={2}
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {

                  e.preventDefault();

                  askQuestion();

                }

              }}
              className="flex-1 resize-none rounded-3xl border border-gray-300 bg-white px-6 py-4 text-lg shadow-lg outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={askQuestion}
              disabled={
                asking ||
                question.trim() === ""
              }
              className={`px-10 rounded-full text-white font-bold transition ${
                asking ||
                question.trim() === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >

              {asking
                ? "Thinking..."
                : "Ask"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}