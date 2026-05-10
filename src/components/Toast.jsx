import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm animate-fade-in
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}
