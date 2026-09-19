import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import Button from '../ui/Button';

interface FormSuccessProps {
  title: string;
  message: string;
  actionLabel: string;
  onRestart: () => void;
}

export default function FormSuccess({ title, message, actionLabel, onRestart }: FormSuccessProps) {
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    statusRef.current?.focus();
  }, []);

  return (
    <div className="inquiry-success">
      <div ref={statusRef} role="status" tabIndex={-1} className="ui-focus">
        <span className="inquiry-success-icon" aria-hidden="true">
          <Check />
        </span>
        <h2 className="inquiry-form-heading">{title}</h2>
        <p className="inquiry-form-note">{message}</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        className="inquiry-success-action"
        onClick={onRestart}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
