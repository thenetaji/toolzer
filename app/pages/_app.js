import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./index.css";

export default function App({ Component, pageProps }) {

  return (
    <>
      <div className="min-h-screen flex flex-col dark:bg-gray-950 transition-colors duration-300">
        <Header />
        <main className="flex-1 p-4">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}
