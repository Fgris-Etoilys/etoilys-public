interface ContentValidationPlaceholderProps {
  children: string;
  className?: string;
}

export default function ContentValidationPlaceholder({
  children,
  className = '',
}: ContentValidationPlaceholderProps) {
  return (
    <div
      className={`rounded-card border border-warning-200 bg-warning-100 p-4 text-sm leading-comfortable text-gray-800 ${className}`}
      role="note"
    >
      <span className="font-semibold text-warning-500">TODO_CONTENT_VALIDATION_REQUIRED:</span>{' '}
      {children}
    </div>
  );
}
