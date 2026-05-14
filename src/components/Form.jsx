export function FormField({ label, children, required }) {
  return (
    <div>
      <label className="label">
        {label}{" "}
        {required && <span className="text-red-500 normal-case">*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return <input className="input-field" {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className="input-field" {...props}>
      {children}
    </select>
  );
}

export function Textarea({ ...props }) {
  return <textarea className="input-field resize-none" rows={4} {...props} />;
}

export default FormField;
