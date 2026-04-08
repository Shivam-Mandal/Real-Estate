import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const toneMap = {
  success: { icon: CheckCircle2, border: "border-emerald-200", iconColor: "text-emerald-600" },
  error: { icon: CircleAlert, border: "border-rose-200", iconColor: "text-rose-600" },
  info: { icon: Info, border: "border-slate-200", iconColor: "text-slate-600" },
};

export const ToastViewport = ({ toasts = [], onDismiss }) => (
  <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
    {toasts.map((toast) => {
      const tone = toneMap[toast.tone] || toneMap.info;
      const Icon = tone.icon;

      return (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-[24px] border ${tone.border} bg-white/95 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur dark:bg-slate-900/95`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${tone.iconColor}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-950 dark:text-white">{toast.title}</p>
              {toast.message ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{toast.message}</p> : null}
            </div>
            <button type="button" onClick={() => onDismiss(toast.id)} className="text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
              <X size={16} />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
