"use client"

import { useState } from "react"
import { useLang } from "@/components/language"
import { links } from "@/lib/copy"

// El formulario de contacto. Todavía no envía nada: arma el mensaje con su
// categoría y lo copia, para pegarlo en un mensaje de Discord. Cuando haya
// una casilla de destino, acá es donde se conecta el envío.

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const field =
  "w-full border-b border-line-strong bg-transparent py-2.5 text-lg text-ink outline-none transition-colors placeholder:text-faint focus:border-ink"

export default function ContactForm() {
  const { t } = useLang()
  const f = t.form
  const [category, setCategory] = useState(0)
  const [name, setName] = useState("")
  const [reply, setReply] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState<"message" | "user" | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = [`[${f.categories[category]}]`, `${f.name}: ${name}`, `${f.reply}: ${reply}`, "", message].join("\n")
    if (await copyText(text)) setCopied("message")
  }

  return (
    <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <form onSubmit={onSubmit} className="space-y-8">
        <fieldset>
          <legend className="label mb-3">{f.category}</legend>
          <div className="flex flex-wrap gap-2 font-mono text-sm">
            {f.categories.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setCategory(i)}
                aria-pressed={category === i}
                className={
                  category === i
                    ? "border border-ink bg-ink px-4 py-2 text-bg"
                    : "border border-line-strong px-4 py-2 text-muted transition-colors hover:border-ink hover:text-ink"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-8 sm:grid-cols-2">
          <label className="block">
            <span className="label">{f.name}</span>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </label>
          <label className="block">
            <span className="label">{f.reply}</span>
            <input className={field} value={reply} onChange={(e) => setReply(e.target.value)} required />
          </label>
        </div>

        <label className="block">
          <span className="label">{f.message}</span>
          <textarea
            className={`${field} min-h-[8rem] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            className="flex items-center gap-3 border border-line-strong px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-ink"
          >
            <span className="text-faint">[→]</span>
            <span>{f.copy}</span>
          </button>
          <p className="font-mono text-xs leading-relaxed text-faint" role="status">
            {copied === "message" ? <span className="text-[#6fcf97]">{f.copied}</span> : f.note}
          </p>
        </div>
      </form>

      <div className="space-y-10">
        <div>
          <p className="label mb-3">Discord</p>
          <button
            type="button"
            onClick={async () => {
              if (await copyText(links.discord)) setCopied("user")
            }}
            className="display text-3xl transition-colors hover:!text-muted sm:text-4xl"
          >
            {links.discord}
          </button>
          <p className="mt-3 font-mono text-xs text-faint" role="status">
            {copied === "user" ? <span className="text-[#6fcf97]">{f.userCopied}</span> : f.userHint}
          </p>
        </div>

        <div>
          <p className="label mb-4">{f.elsewhere}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="go">
              GitHub
            </a>
            <a href={links.patreon} target="_blank" rel="noopener noreferrer" className="go">
              Patreon
            </a>
            <a href={links.kofi} target="_blank" rel="noopener noreferrer" className="go">
              Ko-fi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
