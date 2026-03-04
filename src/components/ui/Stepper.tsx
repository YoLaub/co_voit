import type { ReactNode } from 'react'

interface StepperProps {
  steps: string[]
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
  children: ReactNode
}

export default function Stepper({
  steps,
  currentStep,
  onNext,
  onPrev,
  onSubmit,
  children,
}: StepperProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="w-full">
      {/* Barre de progression */}
      <div className="flex md:flex-row flex-col md:items-center items-start gap-0 mb-8">
        {steps.map((label, index) => {
          const isDone = index < currentStep
          const isActive = index === currentStep

          return (
            <div key={index} className="flex md:flex-row flex-col md:items-center items-start flex-1">
              {/* Étape */}
              <div className="flex md:flex-col flex-row items-center md:gap-1 gap-3">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors',
                    isDone
                      ? 'bg-[#1A365D] text-white'
                      : isActive
                      ? 'bg-[#1A365D] text-white ring-4 ring-[#1A365D]/20'
                      : 'bg-gray-200 text-gray-500',
                  ].join(' ')}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={[
                    'text-xs font-medium md:text-center',
                    isActive ? 'text-[#1A365D]' : isDone ? 'text-[#1A365D]' : 'text-gray-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>

              {/* Connecteur */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    'md:flex-1 md:h-0.5 md:w-auto md:mx-2 w-0.5 h-6 ml-4 md:ml-0',
                    index < currentStep ? 'bg-[#1A365D]' : 'bg-gray-200',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Contenu de l'étape */}
      <div className="mb-8">{children}</div>

      {/* Boutons de navigation */}
      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-6 py-2 rounded-lg bg-[#E97A2B] text-white font-semibold hover:bg-[#d06b22] transition-colors"
          >
            Valider
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2 rounded-lg bg-[#1A365D] text-white font-semibold hover:bg-[#162d52] transition-colors"
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  )
}
