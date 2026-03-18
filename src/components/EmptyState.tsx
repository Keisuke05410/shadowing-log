import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: string;
  message: string;
  linkTo: string;
  linkLabel: string;
}

export default function EmptyState({ icon, message, linkTo, linkLabel }: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in-up">
      <p className="font-heading text-4xl mb-2 text-faint">{icon}</p>
      <p className="mb-4 text-muted">{message}</p>
      <Link
        to={linkTo}
        className="inline-block rounded-full px-6 py-3 text-sm font-medium text-white bg-theme-accent transition-colors"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
