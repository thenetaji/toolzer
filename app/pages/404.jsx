import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-slate-100 dark:from-background dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-lg border-muted">
        <div className="space-y-6 text-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-9xl font-bold text-primary">404</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-background/20 backdrop-blur-sm border border-muted flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.h2
              className="text-xl font-semibold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Page not found
            </motion.h2>

            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-2 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              variant="default"
              onClick={() => router.push("/")}
              className="gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-home"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Go Back
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
