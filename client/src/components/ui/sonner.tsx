import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toasts are dark only, like the rest of the site. This used to read the theme
 * from next-themes, whose provider is never mounted here (the app has its own
 * ThemeContext), so it fell back to "system" and a light-mode OS got white
 * toasts; and the --popover/--border names it pointed at do not exist (the
 * tokens are --color-*), so sonner's own colours showed instead.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-popover)",
          "--normal-text": "var(--color-popover-foreground)",
          "--normal-border": "var(--color-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
