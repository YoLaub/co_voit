import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { contactPassenger } from '../../api/tripsApi'

interface EmailModalProps {
  tripId: number
  recipientProfilId: number
  recipientName: string
  onClose: () => void
}

type FormatCmd = 'bold' | 'italic' | 'underline' | 'insertUnorderedList'

const toolbarButtons: { cmd: FormatCmd; label: string; icon: string }[] = [
  { cmd: 'bold', label: 'Gras', icon: 'B' },
  { cmd: 'italic', label: 'Italique', icon: 'I' },
  { cmd: 'underline', label: 'Souligné', icon: 'U' },
  { cmd: 'insertUnorderedList', label: 'Liste', icon: '•' },
]

export default function EmailModal({ tripId, recipientProfilId, recipientName, onClose }: EmailModalProps) {
  const [subject, setSubject] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

const mutation = useMutation({
    mutationFn: () => {
      console.log('Contact payload:', {
        recipientProfilId,
        subject,
        htmlContent: editorRef.current?.innerHTML ?? '',
      })
      return contactPassenger(tripId, {
        recipientProfilId,
        subject,
        htmlContent: editorRef.current?.innerHTML ?? '',
      })
    },
    onSuccess: () => onClose(),
})

  const execCmd = useCallback((cmd: FormatCmd) => {
    document.execCommand(cmd, false)
    editorRef.current?.focus()
  }, [])

  const canSend = subject.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1A365D]">Envoyer un email</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* Destinataire */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Destinataire</label>
            <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-lg px-3 py-2">{recipientName}</p>
          </div>

          {/* Objet */}
          <div>
            <label htmlFor="email-subject" className="text-xs text-gray-400 block mb-1">Objet</label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet du message"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]/30 focus:border-[#1A365D]"
            />
          </div>

          {/* Toolbar */}
          <div className="flex gap-1 border border-gray-200 rounded-t-lg px-2 py-1.5 bg-gray-50">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.cmd}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd(btn.cmd)}
                className="w-8 h-8 rounded text-sm font-semibold text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label={btn.label}
                title={btn.label}
                style={btn.cmd === 'italic' ? { fontStyle: 'italic' } : btn.cmd === 'underline' ? { textDecoration: 'underline' } : undefined}
              >
                {btn.icon}
              </button>
            ))}
          </div>

          {/* Éditeur */}
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            aria-label="Corps du message"
            className="min-h-[160px] max-h-[300px] overflow-y-auto border border-t-0 border-gray-200 rounded-b-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A365D]/30"
          />

          {/* Erreur */}
          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? "Erreur lors de l'envoi, réessayez."}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={!canSend || mutation.isPending}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#E97A2B] rounded-lg hover:bg-[#d06b22] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Envoi…' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  )
}
