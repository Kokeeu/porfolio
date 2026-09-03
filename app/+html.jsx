import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;800;900&amp;family=IBM+Plex+Mono:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background: #070d1b; }
          body { margin: 0; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          * { box-sizing: border-box; }
          ::selection { background: #ff2d78; color: #f4f5fa; }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { scroll-behavior: auto !important; }
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
