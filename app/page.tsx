"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Zap,
  Send,
  Upload,
  CheckCircle,
  Loader2,
  Menu,
  Sparkles,
  Brain,
  Shield,
  FileText,
  Clock,
  ChevronRight,
  X,
  Copy,
  Check,
  Maximize2,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function BidWizDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setIsSending] = useState(false);
  const [rfpInput, setRfpInput] = useState("");
  const [proposalOutput, setProposalOutput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [training, setTraining] = useState(false);
  const [knowledgeLoaded, setKnowledgeLoaded] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Health check
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/status`);
      setIsOnline(response.ok);
    } catch {
      setIsOnline(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`✓ ${file.name} uploaded successfully!`);
      } else {
        setSuccessMessage(`⚠️ Upload failed: ${data.detail}`);
      }
    } catch (err) {
      setSuccessMessage(`⚠️ Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleTrain = async () => {
    if (!uploadedFile) {
      setSuccessMessage("⚠️ Upload a PDF first to train!");
      return;
    }

    setTraining(true);
    setSuccessMessage("📚 Training knowledge base...");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(`${API_BASE}/api/train`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`✅ Knowledge base loaded successfully!`);
        setKnowledgeLoaded(true);
      } else {
        setSuccessMessage(`⚠️ Training failed: ${data.detail}`);
      }
    } catch (err) {
      setSuccessMessage(`⚠️ Training failed: ${(err as Error).message}`);
    } finally {
      setTraining(false);
    }
  };

  const handleGenerate = async () => {
    if (!rfpInput.trim()) return;

    setGenerating(true);
    setProposalOutput("🧠 Analyzing requirements...");

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: rfpInput, tone: "Professional" }),
      });
      const data = await response.json();
      setProposalOutput(data.response);
    } catch (err) {
      setProposalOutput(`⚠️ Error: ${(err as Error).message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendProposal = async () => {
    if (!emailInput.trim() || !proposalOutput) return;
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/api/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          responses: [[rfpInput, proposalOutput]],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`✓ Proposal sent to ${emailInput}!`);
        setEmailInput("");
      } else {
        setSuccessMessage(`⚠️ Sending failed: ${data.detail}`);
      }
    } catch (err) {
      setSuccessMessage(`⚠️ Sending failed: ${(err as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    if (proposalOutput) {
      navigator.clipboard
        .writeText(proposalOutput)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setSuccessMessage("Proposal copied!");
        })
        .catch((err) => console.error("Copy failed:", err));
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 font-sans overflow-hidden">
      {/* Futuristic Sidebar */}
      <aside
        className={`relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white transition-all duration-500 flex flex-col ${
          isSidebarOpen ? "w-80" : "w-24"
        } border-r border-white/10 shadow-2xl`}
      >
        {/* Sidebar Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-6 pb-8 border-b border-white/10">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-lg opacity-70" />
                  <div className="relative p-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl shadow-lg">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    BidWiz AI
                  </h1>
                  <p className="text-xs text-gray-400">Proposal Intelligence</p>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <div className="p-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl">
                  <Brain className="w-6 h-6" />
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="relative z-10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOnline ? "bg-emerald-400" : "bg-rose-400"
                } ${isOnline ? "animate-pulse" : ""}`}
              />
              <div
                className={`absolute inset-0 ${
                  isOnline ? "bg-emerald-400" : "bg-rose-400"
                } blur-md opacity-30`}
              />
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Neural Engine</p>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">
                      Proposal Studio
                    </span>
                  </div>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    isOnline ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isOnline ? "Optimized" : "Offline"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {isSidebarOpen && (
          <nav className="relative z-10 px-4 py-2 flex-1">
            <div className="space-y-1">
              {[
                {
                  icon: <FileText className="w-4 h-4" />,
                  label: "Workspace",
                  active: true,
                },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    item.active
                      ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-l-4 border-violet-500 text-white"
                      : "hover:bg-white/5 text-gray-300 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.active && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            {/* Upload Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  disabled={uploading}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <div className="p-4 border-2 border-dashed border-white/20 hover:border-violet-400/50 rounded-xl transition-all duration-300 hover:bg-white/5 group">
                    {uploading ? (
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-violet-400" />
                        <p className="text-sm text-gray-300">Uploading...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10">
                          <Upload className="w-5 h-5 text-violet-400" />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">
                          Upload Documents
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs text-gray-200 truncate">
                        {uploadedFile.name}
                      </p>
                    </div>
                    <X
                      className="w-3 h-3 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => {
                        setUploadedFile(null);
                        setKnowledgeLoaded(false);
                      }}
                    />
                  </div>
                </div>
              )}

              {uploadedFile && !knowledgeLoaded && (
                <button
                  onClick={handleTrain}
                  disabled={training}
                  className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {training ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Training...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Train PDF</span>
                    </>
                  )}
                </button>
              )}
              
              {knowledgeLoaded && (
                 <div className="mt-3 w-full py-2 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold text-center border border-emerald-500/30">
                    AI Trained & Ready
                 </div>
              )}
            </div>
          </nav>
        )}

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Proposal Studio
              </h1>
              <p className="text-gray-500 mt-1">
                Transform RFPs into winning proposals with AI intelligence
              </p>
            </div>
          </div>
        </header>

        {/* Success Toast */}
        {successMessage && (
          <div className="mx-8 animate-in slide-in-from-top duration-500">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Workspace */}
        <div className="flex-1 overflow-hidden p-8 grid grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-lg">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    RFP Input
                  </h3>
                </div>
                <span className="text-xs font-medium px-3 py-1 bg-violet-100 text-violet-700 rounded-full">
                  AI Ready
                </span>
              </div>
              <textarea
                value={rfpInput}
                onChange={(e) => setRfpInput(e.target.value)}
                placeholder="Paste your RFP requirements, project brief, or proposal guidelines here..."
                className="w-full h-64 bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all duration-300"
              />
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>Characters: {rfpInput.length}</span>
                <span>AI will analyze your requirements</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !rfpInput.trim() || !knowledgeLoaded}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Proposal</span>
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                    <Brain className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Generated Proposal
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    title="Toggle fullscreen"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div
                ref={outputRef}
                className={`flex-1 bg-gradient-to-b from-gray-50 to-white border border-gray-300 rounded-xl p-6 overflow-y-auto transition-all duration-300 ${
                  isFullscreen ? "h-[500px]" : "h-64"
                }`}
              >
                {proposalOutput ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {proposalOutput}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-fuchsia-200 blur-xl rounded-full" />
                      <Sparkles className="w-12 h-12 text-violet-400 relative" />
                    </div>
                    <p className="text-lg font-medium text-gray-500">
                      Your AI-generated proposal will appear here
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Enter RFP requirements and click "Generate AI Proposal"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter recipient email address..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                  />
                  <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={handleSendProposal}
                  disabled={sending || !emailInput.trim() || !proposalOutput}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Proposal</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Encrypted Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Real-time Tracking
                  </span>
                </div>
                <span className="font-medium text-violet-600">
                  Powered by AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                System Status:{" "}
                {isOnline ? "All Systems Operational" : "Maintenance Required"}
              </span>
              <span>v2.1.4 • Proposal Studio</span>
            </div>
            <span>© 2024 BidWiz AI • Enterprise Grade Proposal Intelligence</span>
          </div>
        </div>
      </main>
    </div>
  );
}