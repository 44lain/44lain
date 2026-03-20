'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import XpButton from '@/components/ui/XpButton'

interface FormState {
  name: string
  email: string
  message: string
}

/** Campo de formulário estilizado como sintaxe .ini */
function IniField({
  section,
  field,
  value,
  type = 'text',
  multiline = false,
  accentColor,
  onChange,
}: {
  section: string
  field: string
  value: string
  type?: string
  multiline?: boolean
  accentColor: string
  onChange: (val: string) => void
}) {
  const inputClass = [
    'w-full bg-transparent outline-none text-white/90 placeholder:text-white/20',
    'border-b border-white/10 focus:border-opacity-100 pb-0.5',
    'font-mono text-[11px]',
  ].join(' ')

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-white/30 text-[9px]">[{section}]</span>
      <div className="flex items-start gap-1.5 pl-1">
        <span style={{ color: accentColor }} className="text-[11px] shrink-0">{field} =</span>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={inputClass + ' resize-none'}
            style={{ borderColor: `${accentColor}33` }}
            aria-label={field}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            style={{ borderColor: `${accentColor}33` }}
            aria-label={field}
          />
        )}
      </div>
    </div>
  )
}

export default function ContactWindow() {
  const { tokens } = useTheme()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrar com Resend API
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-2 text-[11px]" style={{ fontFamily: tokens.displayFont }}>
        <p style={{ color: tokens.accentColor }} className="font-bold">{'>'} message sent</p>
        <p className="text-white/60 pl-3">// I&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[11px]" style={{ fontFamily: tokens.displayFont }}>

      <p className="font-bold" style={{ color: tokens.accentColor }}>; contact.ini</p>

      <IniField
        section="sender"
        field="name"
        value={form.name}
        accentColor={tokens.accentColor}
        onChange={(val) => setForm((s) => ({ ...s, name: val }))}
      />
      <IniField
        section="sender"
        field="email"
        type="email"
        value={form.email}
        accentColor={tokens.accentColor}
        onChange={(val) => setForm((s) => ({ ...s, email: val }))}
      />
      <IniField
        section="message"
        field="body"
        value={form.message}
        multiline
        accentColor={tokens.accentColor}
        onChange={(val) => setForm((s) => ({ ...s, message: val }))}
      />

      <XpButton
        type="submit"
        disabled={!form.name || !form.email || !form.message}
      >
        send
      </XpButton>

    </form>
  )
}
