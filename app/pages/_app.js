import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { Partytown } from "@qwik.dev/partytown/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./index.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(router.pathname);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handleStart = () => {
      if (router.pathname !== prevPath) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setPrevPath(router.pathname);
        }, 1200);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    return () => router.events.off("routeChangeStart", handleStart);
  }, [router, prevPath]);

  return (
    <>
      <Head>
        <Partytown forward={["dataLayer.push"]} />
        <script
          type="text/partytown"
          src="https://www.googletagmanager.com/gtag/js?id=G-75W2QXCJXB"
        />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-75W2QXCJXB');
            `,
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col dark:bg-gray-950 transition-colors duration-300">
        <Header />
        <main className="flex-1 p-4">
          <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}