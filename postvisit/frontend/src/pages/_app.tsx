import type { AppProps } from 'next/app';
import { VisitProvider } from '@PostVisit/context/VisitContext';
import '@PostVisit/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <VisitProvider>
      <Component {...pageProps} />
    </VisitProvider>
  );
}

export default App;
