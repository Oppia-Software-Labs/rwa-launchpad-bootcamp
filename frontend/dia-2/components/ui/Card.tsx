import type { ReactNode } from "react";

export type CardState = "default" | "empty" | "loading" | "error";

export type CardProps = {
  title?: string;
  metadata?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  state?: CardState;
  emptyMessage?: string;
  errorMessage?: string;
  radius?: "md" | "lg";
  className?: string;
};

export function Card({
  title,
  metadata,
  children,
  footer,
  state = "default",
  emptyMessage = "Nothing to show yet.",
  errorMessage = "Something went wrong.",
  radius = "md",
  className = "",
}: CardProps) {
  const radiusClass = radius === "lg" ? "rounded-lg" : "rounded-md";

  return (
    <section
      className={[
        "border border-border-default bg-bg-surface",
        radiusClass,
        "p-5 md:p-6",
        className,
      ].join(" ")}
    >
      {(title || metadata) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          {title ? (
            <h2 className="text-h3 text-text-primary">{title}</h2>
          ) : (
            <span />
          )}
          {metadata ? (
            <div className="text-label text-text-muted">{metadata}</div>
          ) : null}
        </header>
      )}

      {state === "loading" ? (
        <div className="flex items-center gap-3 text-body-sm text-text-secondary">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-r-transparent"
            aria-hidden
          />
          Loading…
        </div>
      ) : state === "empty" ? (
        <p className="text-body-sm text-text-muted">{emptyMessage}</p>
      ) : state === "error" ? (
        <p className="text-body-sm text-semantic-danger">{errorMessage}</p>
      ) : (
        <div className="text-body text-text-secondary">{children}</div>
      )}

      {footer ? (
        <footer className="mt-5 border-t border-border-subtle pt-4 text-body-sm text-text-muted">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
