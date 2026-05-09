import { useState, useRef, useEffect, type FormEvent } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { useAdvisor } from '@/features/emissions/hooks/useAdvisor';
import styles from './Advisor.module.css';

const SUGGESTED_PROMPTS = [
  'How can I reduce my transportation emissions?',
  'What are easy ways to save energy at home?',
  'Give me sustainable food swaps to lower my carbon footprint.',
  'How does my footprint compare to the global average?',
];

export default function Advisor() {
  const { messages, isLoading, error, sendMessage, clearChat } = useAdvisor();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
  }

  async function handleSuggestion(prompt: string) {
    if (isLoading) return;
    setInput('');
    await sendMessage(prompt);
  }

  return (
    <section id="advisor" className={styles.section}>
      <h2 className={styles.heading}>🌿 AI Eco Advisor</h2>
      <p className={styles.subheading}>
        Powered by Gemini — ask anything about reducing your carbon footprint.
      </p>

      <Card className={styles.chatCard}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>🤖</p>
            <p>Ask the EcoSense AI advisor a question to get started!</p>
            <div className={styles.suggestions}>
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  className={styles.suggestionChip}
                  onClick={() => handleSuggestion(p)}
                  disabled={isLoading}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.modelMsg}`}
              >
                <div className={styles.msgBubble}>
                  {msg.role === 'model' && <span className={styles.msgIcon}>🌿</span>}
                  <div className={styles.msgContent}>{msg.content}</div>
                </div>
                <div className={styles.msgTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.modelMsg}`}>
                <div className={styles.msgBubble}>
                  <span className={styles.msgIcon}>🌿</span>
                  <div className={styles.typing}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.inputRow}>
          <input
            className={styles.chatInput}
            type="text"
            placeholder="Ask about your carbon footprint…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} disabled={!input.trim()}>
            Send
          </Button>
          {messages.length > 0 && (
            <Button variant="ghost" type="button" onClick={clearChat} size="sm">
              Clear
            </Button>
          )}
        </form>
      </Card>
    </section>
  );
}
