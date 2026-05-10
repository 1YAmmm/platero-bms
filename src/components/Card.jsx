export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`glass-card p-5 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
