export type AppIconName =
  | "bell"
  | "brain"
  | "calendar"
  | "chart"
  | "columns"
  | "home"
  | "logout"
  | "menu"
  | "megaphone"
  | "package"
  | "receipt"
  | "sparkles"
  | "users";

export function AppIcon({ name, className = "" }: { name: AppIconName; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" ? <path {...common} d="m3.5 10.4 8.5-7 8.5 7v9.1a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" /> : null}
      {name === "users" ? (
        <>
          <path {...common} d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
          <circle {...common} cx="9" cy="7" r="4" />
          <path {...common} d="M22 20v-1.5a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ) : null}
      {name === "columns" ? (
        <>
          <rect {...common} x="3" y="4" width="7" height="16" rx="1.5" />
          <rect {...common} x="14" y="4" width="7" height="16" rx="1.5" />
          <path {...common} d="M5.5 8h2M16.5 8h2M5.5 12h2M16.5 12h2" />
        </>
      ) : null}
      {name === "package" ? (
        <>
          <path {...common} d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
          <path {...common} d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.25l8 4.5" />
        </>
      ) : null}
      {name === "chart" ? (
        <>
          <path {...common} d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
          <path {...common} d="m3.5 7 6-4 6 6 5-5" />
        </>
      ) : null}
      {name === "sparkles" ? (
        <>
          <path {...common} d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3z" />
          <path {...common} d="m18.5 13 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 14l.8 2.2 2.2.8-2.2.8L5.5 20l-.8-2.2-2.2-.8 2.2-.8z" />
        </>
      ) : null}
      {name === "brain" ? (
        <>
          <path {...common} d="M9.5 4.5A3 3 0 0 0 4 6.2a3.4 3.4 0 0 0 .6 6.3A3.5 3.5 0 0 0 9.5 18v-13.5z" />
          <path {...common} d="M14.5 4.5A3 3 0 0 1 20 6.2a3.4 3.4 0 0 1-.6 6.3A3.5 3.5 0 0 1 14.5 18v-13.5z" />
          <path {...common} d="M9.5 8H7.8M14.5 8h1.7M9.5 12H7.2M14.5 12h2.3M12 5v14" />
        </>
      ) : null}
      {name === "calendar" ? (
        <>
          <rect {...common} x="3" y="5" width="18" height="16" rx="2" />
          <path {...common} d="M16 3v4M8 3v4M3 10h18" />
          <path {...common} d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </>
      ) : null}
      {name === "receipt" ? (
        <>
          <path {...common} d="M5 3.5h14v17l-2.5-1.5L14 20.5 12 19l-2 1.5-2.5-1L5 21z" />
          <path {...common} d="M8.5 8h7M8.5 12h7" />
        </>
      ) : null}
      {name === "bell" ? (
        <>
          <path {...common} d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z" />
          <path {...common} d="M10 19a2 2 0 0 0 4 0" />
        </>
      ) : null}
      {name === "megaphone" ? (
        <>
          <path {...common} d="M4 13.5h3l9 4.5V6L7 10.5H4a2 2 0 0 0-2 2v-1a2 2 0 0 0 2 2z" />
          <path {...common} d="M7 13.5 8.5 20H12l-2-5.5" />
          <path {...common} d="M19 9.5a3.5 3.5 0 0 1 0 5M21 7a7 7 0 0 1 0 10" />
        </>
      ) : null}
      {name === "logout" ? (
        <>
          <path {...common} d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
          <path {...common} d="M14 8l4 4-4 4M18 12H9" />
        </>
      ) : null}
      {name === "menu" ? (
        <>
          <circle {...common} cx="5" cy="12" r="1" />
          <circle {...common} cx="12" cy="12" r="1" />
          <circle {...common} cx="19" cy="12" r="1" />
        </>
      ) : null}
    </svg>
  );
}
