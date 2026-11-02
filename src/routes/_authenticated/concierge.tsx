import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageSquarePlus, Send, Sparkles, Menu, Trash2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/concierge")({
  head: () => ({
    meta: [
      { title: "24/7 AI Travel Concierge | FaresDream" },
      {
        name: "description",
        content:
          "Your private AI travel concierge for business and first class trips — routings, cabin products and desk quotes, on demand.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "24/7 AI Travel Concierge" },
      {
        property: "og:description",
        content: "Plan premium cabin trips with a private AI concierge.",
      },
    ],
  }),
  component: ConciergePage,
});

type Conversation = { id: string; title: string; updated_at: string };
type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Best business class option JFK to Dubai in March under $3,000?",
  "Compare Qatar Qsuite and Emirates Business for London to Bangkok.",
  "I need two lie-flat seats to Tokyo with one stop maximum.",
];

function ConciergePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false });
    setConversations((data ?? []) as Conversation[]);
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function openConversation(id: string) {
    setActiveId(id);
    setSidebarOpen(false);
    setError(null);
    const { data } = await supabase
      .from("messages")
      .select("id,role,content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Message[]);
  }

  function newConversation() {
    setActiveId(null);
    setMessages([]);
    setStreaming("");
    setError(null);
    setSidebarOpen(false);
  }

  async function removeConversation(id: string) {
    await supabase.from("conversations").delete().eq("id", id);
    if (activeId === id) newConversation();
    void loadConversations();
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setError(null);
    setInput("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const userId = sessionData.session?.user.id;
    if (!token || !userId) {
      setError("Your session expired. Please sign in again.");
      setBusy(false);
      return;
    }

    let conversationId = activeId;
    if (!conversationId) {
      const { data, error: convError } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title: content.slice(0, 60) })
        .select("id")
        .single();
      if (convError || !data) {
        setError("Could not start the conversation. Please try again.");
        setBusy(false);
        return;
      }
      conversationId = data.id;
      setActiveId(conversationId);
    }

    const nextMessages: Message[] = [
      ...messages,
      { id: `local-${Date.now()}`, role: "user", content },
    ];
    setMessages(nextMessages);
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content,
    });

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        setError("Our concierge desk is momentarily unavailable. Please try again or call +1-888-596-7882.");
        setBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setStreaming(answer);
      }

      const finalAnswer = answer.trim() || "I could not draft a reply — please try rephrasing.";
      setStreaming("");
      setMessages((prev) => [
        ...prev,
        { id: `local-a-${Date.now()}`, role: "assistant", content: finalAnswer },
      ]);
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: finalAnswer,
      });
      await supabase
        .from("conversations")
        .update({ title: nextMessages[0]?.content.slice(0, 60) ?? "New conversation" })
        .eq("id", conversationId);
      void loadConversations();
    } catch {
      setStreaming("");
      setError("Connection interrupted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={newConversation}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground"
      >
        <MessageSquarePlus className="size-4" /> New conversation
      </button>
      <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-navy-foreground/40">
        History
      </p>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="px-1 text-xs text-navy-foreground/50">No conversations yet.</p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-1 rounded-xl px-2 ${
                activeId === c.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => void openConversation(c.id)}
                className="min-w-0 flex-1 py-2.5 text-left text-xs"
              >
                <span className="block truncate font-semibold">{c.title}</span>
                <span className="block text-[10px] text-navy-foreground/45">
                  {new Date(c.updated_at).toLocaleDateString()}
                </span>
              </button>
              <button
                type="button"
                aria-label="Delete conversation"
                onClick={() => void removeConversation(c.id)}
                className="shrink-0 p-1 text-navy-foreground/40 hover:text-gold"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
      <a
        href="tel:+18885967882"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2.5 text-xs font-bold hover:border-gold hover:text-gold"
      >
        <Phone className="size-4" /> Talk to a human
      </a>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-navy text-navy-foreground">
      <div className="mx-auto flex max-w-page-padded gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>

        <section className="flex min-h-[70dvh] min-w-0 flex-1 flex-col rounded-2xl border border-white/10 bg-navy-soft/50">
          <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <button
              type="button"
              aria-label="Open history"
              onClick={() => setSidebarOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-white/20 lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <span className="grid size-9 place-items-center rounded-xl bg-gold text-gold-foreground">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold">
                Personal 24/7 Travel Concierge
              </h1>
              <p className="text-[11px] text-navy-foreground/55">
                Business &amp; first class specialists · available 24/7
              </p>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.length === 0 && !streaming ? (
              <div className="space-y-3">
                <p className="text-sm text-navy-foreground/70">
                  Tell me where you want to fly and how you like to travel — I&apos;ll shape the
                  routing, the cabin and the plan, then hand it to our desk for the private fare.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-navy-foreground/80 hover:border-gold hover:text-gold"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} />
            ))}
            {streaming ? <Bubble role="assistant" content={streaming} /> : null}
            {busy && !streaming ? (
              <p className="flex items-center gap-2 text-xs text-navy-foreground/60">
                <Loader2 className="size-3.5 animate-spin" /> Consulting the desk…
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                {error}
              </p>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routes, cabins, timing or upgrades…"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-navy-foreground/45 focus:border-gold"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </section>
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close history"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-navy p-4">
            {sidebar}
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          mine
            ? "bg-gold text-gold-foreground"
            : "border border-white/10 bg-navy/60 text-navy-foreground/90"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
