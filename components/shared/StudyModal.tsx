/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { FileText, Send, Sparkles, X, Loader2 } from "lucide-react";
import { DialogOverlay } from "@radix-ui/react-dialog";
import SelectCourse from "../study-modal/SelectCourse";
import SelectLesson from "../study-modal/SelectLesson";

// Document Viewer
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface StudyModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  initialCourseCode?: string;
  activeCourse?: any;
  activeLesson?: any;
}

const StudyModal = ({
  openModal,
  setOpenModal,
  initialCourseCode,
  activeCourse,
  activeLesson,
}: StudyModalProps) => {
  const [step, setStep] = useState<"SELECT_COURSE" | "SELECT_LESSON" | "STUDY">("SELECT_COURSE");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [isBotLoading, setIsBotLoading] = useState(false);

  const currentLesson = selectedLesson || activeLesson;

  /** 🔹 Fetch file URL from Convex */
  const fileUrl = useQuery(
    api.courses.getFileUrl,
    currentLesson?.storageId ? { storageId: currentLesson.storageId } : "skip"
  );

  const docs = useMemo(() => {
    // If fileUrl is null or the query hasn't finished, return an empty array
    if (!fileUrl) return [];

    const extension = currentLesson?.format?.toLowerCase().replace('.', '') || "pdf";

    return [{
      uri: fileUrl,
      fileName: currentLesson?.title || "Lesson Material",
      fileType: extension
    }];
  }, [fileUrl, currentLesson]);

  /** 🔹 Step synchronization */
  useEffect(() => {
    if (!openModal) return;
    const effectiveCourse = activeCourse || selectedCourse;
    const effectiveLesson = activeLesson || selectedLesson;

    if (!effectiveCourse) setStep("SELECT_COURSE");
    else if (!effectiveLesson) setStep("SELECT_LESSON");
    else setStep("STUDY");
  }, [openModal, selectedCourse, selectedLesson, activeCourse, activeLesson]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I've loaded the materials. What part should we dive into first?",
    },
  ]);

  /** 🔹 Chat Logic with your Custom Endpoint */
  const handleSend = async () => {
    if (!inputValue.trim() || isBotLoading) return;

    const userQuery = inputValue.trim();
    const newMessages = [...messages, { role: "user", content: userQuery }];

    setMessages(newMessages);
    setInputValue("");
    setIsBotLoading(true);

    try {
      const response = await fetch("https://jerold-unsuperior-fonda.ngrok-free.dev/bot/lecture-chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuery,
          lecture_id: currentLesson?.lecture_id // Ensure this field exists in your lesson object
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Adjust 'data.response' based on your exact API response structure
      setMessages([...newMessages, { role: "assistant", content: data.response || data.answer || "I've processed that request." }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again!" }]);
    } finally {
      setIsBotLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/60" />

      <DialogContent
        className={`${step === "STUDY" ? "max-w-[100vw]! w-screen h-screen" : "max-w-md"
          } p-0 gap-0 border-none outline-none overflow-hidden transition-all duration-300`}
      >
        {step === "SELECT_COURSE" && (
          <div className="bg-white p-6 rounded-3xl">
            <DialogTitle className="text-2xl font-black text-[#002147] mb-4">Select a Course</DialogTitle>
            <SelectCourse selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
          </div>
        )}

        {step === "SELECT_LESSON" && (
          <div className="bg-white p-6 rounded-3xl">
            <DialogTitle className="text-2xl font-black text-[#002147] mb-4">Select a Lesson</DialogTitle>
            <SelectLesson
              courseId={activeCourse?._id || selectedCourse?._id || selectedCourse?.id}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
            />
          </div>
        )}

        {step === "STUDY" && (
          <div className="flex h-full w-full overflow-hidden bg-white">
            <DialogTitle className="sr-only">Studying {currentLesson?.title}</DialogTitle>

            {/* ========= LEFT: DOCUMENT VIEWER ========= */}
            <div className="flex-[1.5] bg-[#f8fafc] flex flex-col border-r border-slate-200">
              <div className="bg-white border-b px-6 py-3 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileText className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#002147] text-sm">{currentLesson?.title}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Week {currentLesson?.week} • {initialCourseCode || activeCourse?.courseCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  <DialogClose className="flex items-center text-[12px] gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full font-bold cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors uppercase">
                    Exit <X size={16} />
                  </DialogClose>
                </div>
              </div>

              <div className="flex-1 relative h-full">
                {!fileUrl ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin mb-2 text-[#002147]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[#002147] opacity-50">Loading Document...</p>
                  </div>
                ) : (
                  <DocViewer
                    key={fileUrl}
                    documents={docs}
                    pluginRenderers={DocViewerRenderers}
                    className="h-[500px] w-full"
                    config={{ header: { disableHeader: true } }}
                    theme={{ primary: "#002147", textPrimary: "#002147" }}
                  />
                )}
              </div>
            </div>

            {/* ========= RIGHT: AI CHAT ========= */}
            <div className="flex-1 bg-white flex flex-col shadow-xl z-10">
              <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#002147] p-2 rounded-lg">
                    <Sparkles size={18} className="text-[#fdb813]" />
                  </div>
                  <p className="font-black text-sm text-[#002147]">Study Assistant</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isBotLoading ? 'bg-orange-400' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isBotLoading ? 'Thinking...' : 'AI Online'}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user" ? "bg-[#002147] text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isBotLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 className="animate-spin text-slate-400" size={16} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    disabled={isBotLoading}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask a question about this lesson..."
                    className="w-full p-4 pr-12 bg-slate-100 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-[#fdb813] disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isBotLoading}
                    className="absolute right-2 p-2 bg-[#002147] text-[#fdb813] rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyModal;