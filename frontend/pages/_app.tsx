import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import Layout from '@/components/Layout';

const theme = createTheme({
  primaryColor: 'dark',
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </>
  );
}
