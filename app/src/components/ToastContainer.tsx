import { useToast } from '@/contexts/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const toastColors = {
  success: '#16A34A',
  error: '#E8321C',
  info: '#2563EB',
};

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map(toast => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white rounded-r-lg rounded-l-none py-3 px-4 shadow-lg min-w-[280px] max-w-[360px] animate-in slide-in-from-right-4 fade-in duration-300"
            style={{ borderLeft: `4px solid ${toastColors[toast.type]}` }}
          >
            <Icon size={16} style={{ color: toastColors[toast.type] }} className="shrink-0" />
            <span className="text-[13px] text-[#111318] flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#B0B7C3] hover:text-[#E8321C] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
