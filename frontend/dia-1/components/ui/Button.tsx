"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gradient text-text-primary shadow-none hover:brightness-110 active:brightness-95 disabled:opacity-40 disabled:hover:brightness-100",
  secondary:
    "bg-bg-elevated text-text-primary border border-border-default hover:bg-bg-soft active:bg-bg-surface disabled:opacity-40",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-soft/60 active:bg-bg-soft disabled:opacity-40",
  danger:
    "bg-semantic-danger/15 text-semantic-danger border border-semantic-danger/40 hover:bg-semantic-danger/25 active:bg-semantic-danger/30 disabled:opacity-40",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      loading = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={[
          "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-4 text-body-sm font-semibold transition duration-fast ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas",
          variantClasses[variant],
          className,
        ].join(" ")}
        {...rest}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden
            />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
