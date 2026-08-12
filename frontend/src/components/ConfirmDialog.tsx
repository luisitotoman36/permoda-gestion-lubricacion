import React from 'react'
import logo from '../assets/logo.svg'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[30px] border border-cyan-400/20 bg-slate-950/95 p-5 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.55)] ring-1 ring-white/5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-cyan-400/30">
              <img src={logo} alt="PERMODA" className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">PERMODA</p>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="py-5">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-3xl text-amber-300 ring-1 ring-amber-400/20">
            ⚠
          </div>
          <p className="text-base leading-7 text-slate-200">{message}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button type="button" onClick={onCancel} className="secondary-action">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="danger-action">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
