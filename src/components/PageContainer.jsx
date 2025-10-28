export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${className}`}>
      {children}
    </div>
  );
}
