import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <style jsx global>{`
          @font-face {
            font-family: "GmarketSansMedium";
            src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff")
              format("woff");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          html,
          body {
            font-family: "GmarketSansMedium", sans-serif !important;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
