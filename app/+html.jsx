import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background: #050507; }
          body { margin: 0; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          * { box-sizing: border-box; }
          ::selection { background: #d9ff43; color: #050507; }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { scroll-behavior: auto !important; }
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
