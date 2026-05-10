import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "../assets/svg/Icons";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* HEADER */}
          <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h2>

                {subtitle && (
                  <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-all duration-200"
              >
                <IconClose size={20} />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="px-8 py-7 max-h-[65vh] overflow-y-auto">
            {children}
          </div>

          {/* FOOTER */}
          {footer && (
            <div className="px-8 py-5 border-t bg-slate-50 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
