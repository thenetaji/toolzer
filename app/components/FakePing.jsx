"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NetworkIcon, RefreshCwIcon, CommandIcon } from "lucide-react";

function FakePingTool() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPingComplete, setIsPingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [pingStats, setPingStats] = useState({
    ping: "---",
    jitter: "---",
    packetLoss: "---",
  });

  // City coordinates (simplified for animation purposes)
  const cities = {
    delhi: { x: "30%", y: "40%" },
    newYork: { x: "75%", y: "38%" },
  };

  const commandToType = "ping newyork.example.com -c 4";

  // Type the command character by character
  useEffect(() => {
    if (isRunning && typedCommand.length < commandToType.length) {
      const timer = setTimeout(() => {
        setTypedCommand(commandToType.slice(0, typedCommand.length + 1));
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isRunning, typedCommand]);

  // Terminal output sequence
  useEffect(() => {
    if (!isRunning || typedCommand.length < commandToType.length) return;

    const outputs = [
      { text: "Resolving DNS for newyork.example.com...", delay: 800 },
      { text: "DNS resolved: 203.0.113.42", delay: 1200 },
      { text: "Establishing connection...", delay: 800 },
      { text: "Sending ICMP packet 1/4...", delay: 900 },
      { text: "Reply from 203.0.113.42: time=238ms", delay: 1000 },
      { text: "Sending ICMP packet 2/4...", delay: 900 },
      { text: "Reply from 203.0.113.42: time=241ms", delay: 1000 },
      { text: "Sending ICMP packet 3/4...", delay: 900 },
      { text: "Reply from 203.0.113.42: time=235ms", delay: 1000 },
      { text: "Sending ICMP packet 4/4...", delay: 900 },
      { text: "Reply from 203.0.113.42: time=242ms", delay: 1000 },
      {
        text: "--- newyork.example.com ping statistics ---",
        delay: 700,
        isResult: true,
      },
      {
        text: "4 packets transmitted, 4 received, 0% packet loss",
        delay: 700,
      },
      {
        text: "Round-trip min/avg/max = 235/239/242 ms",
        delay: 700,
      },
    ];

    let stepDelay = 0;

    outputs.forEach((output, index) => {
      stepDelay += output.delay;
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, output.text]);
        setCurrentStep(index + 1);

        // Update ping stats after first ping
        if (index === 4) {
          setPingStats({
            ping: "238ms",
            jitter: "24ms",
            packetLoss: "0%",
          });
        }

        // Set completion after last step
        if (index === outputs.length - 1) {
          setTimeout(() => {
            setIsPingComplete(true);
          }, 2000);
        }
      }, stepDelay);
    });
  }, [isRunning, typedCommand]);

  const startPing = () => {
    setIsRunning(true);
    setIsPingComplete(false);
    setTypedCommand("");
    setTerminalOutput([]);
    setCurrentStep(0);
    setPingStats({
      ping: "---",
      jitter: "---",
      packetLoss: "---",
    });
  };

  const resetPing = () => {
    setIsRunning(false);
    setIsPingComplete(false);
    setTypedCommand("");
    setTerminalOutput([]);
    setCurrentStep(0);
    setPingStats({
      ping: "---",
      jitter: "---",
      packetLoss: "---",
    });
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-black border border-zinc-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="flex items-center space-x-2">
          <NetworkIcon className="h-5 w-5 text-emerald-500" />
          <h2 className="font-mono text-lg font-bold text-zinc-200">
            NetPulse Tracer
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="bg-zinc-900 text-emerald-500 border-emerald-800"
          >
            Global Network Monitor
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800"
                  onClick={resetPing}
                >
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Simulation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-0 h-[600px]">
        {/* Map visualization - 8 columns */}
        <div className="col-span-8 bg-zinc-950 relative overflow-hidden border-r border-zinc-800">
          {/* World map background */}
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-zinc-950">
              <svg viewBox="0 0 800 500" className="w-full h-full opacity-30">
                <path
                  d="M159.4 120.3c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM240 177.7c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM310 112.6c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM437.8 214.2c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM535.1 86.5c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM595.1 177.7c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM661.9 134.9c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM368.9 313.8c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM240 304.1c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM496.8 365c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zM620 350.4c-4.2 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8z"
                  fill="rgba(101, 255, 179, 0.2)"
                />
                <path
                  d="M159.4 120.3L240 177.7M240 177.7L310 112.6M310 112.6L437.8 214.2M437.8 214.2L535.1 86.5M535.1 86.5L595.1 177.7M595.1 177.7L661.9 134.9M240 177.7L240 304.1M240 304.1L368.9 313.8M368.9 313.8L437.8 214.2M368.9 313.8L496.8 365M496.8 365L620 350.4M620 350.4L595.1 177.7"
                  stroke="rgba(101, 255, 179, 0.1)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* City markers */}
          <motion.div
            className="absolute h-4 w-4 rounded-full bg-emerald-500"
            style={{ left: cities.delhi.x, top: cities.delhi.y }}
            initial={{ scale: 0 }}
            animate={{
              scale: isRunning ? [1, 1.3, 1] : 1,
              boxShadow: isRunning
                ? "0 0 15px 5px rgba(52, 211, 153, 0.4)"
                : "none",
            }}
            transition={{ duration: 1.5, repeat: isRunning ? Infinity : 0 }}
          />
          <div
            className="absolute text-xs font-mono text-emerald-400"
            style={{ left: "calc(30% + 8px)", top: "calc(40% - 8px)" }}
          >
            Delhi
          </div>

          <motion.div
            className="absolute h-4 w-4 rounded-full bg-indigo-500"
            style={{ left: cities.newYork.x, top: cities.newYork.y }}
            initial={{ scale: 0 }}
            animate={{
              scale: isRunning ? [1, 1.3, 1] : 1,
              boxShadow: isRunning
                ? "0 0 15px 5px rgba(99, 102, 241, 0.4)"
                : "none",
            }}
            transition={{ duration: 1.5, repeat: isRunning ? Infinity : 0 }}
          />
          <div
            className="absolute text-xs font-mono text-indigo-400"
            style={{ left: "calc(75% + 8px)", top: "calc(38% - 8px)" }}
          >
            New York
          </div>

          {/* Connection line */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
          >
            <motion.path
              d={`M ${cities.delhi.x} ${cities.delhi.y} L ${cities.newYork.x} ${cities.newYork.y}`}
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRunning ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </svg>

          {/* Animated ping packets */}
          {isRunning && currentStep > 3 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/30"
                  initial={{
                    left: cities.delhi.x,
                    top: cities.delhi.y,
                    scale: 0.8,
                  }}
                  animate={{
                    left: cities.newYork.x,
                    top: cities.newYork.y,
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    delay: 1 + i * 1.9,
                    ease: "easeInOut",
                    scale: {
                      repeat: Infinity,
                      duration: 0.6,
                    },
                  }}
                />
              ))}

              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`return-${i}`}
                  className="absolute h-3 w-3 rounded-full bg-indigo-500/80 shadow-lg shadow-indigo-500/30"
                  initial={{
                    left: cities.newYork.x,
                    top: cities.newYork.y,
                    scale: 0.8,
                  }}
                  animate={{
                    left: cities.delhi.x,
                    top: cities.delhi.y,
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    delay: 1.5 + i * 1.9,
                    ease: "easeInOut",
                    scale: {
                      repeat: Infinity,
                      duration: 0.6,
                    },
                  }}
                />
              ))}
            </>
          )}

          {/* Stats display */}
          <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 overflow-hidden">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                  Latency
                </div>
                <motion.div
                  className="text-2xl font-bold font-mono text-emerald-500"
                  key={pingStats.ping}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {pingStats.ping}
                </motion.div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                  Jitter
                </div>
                <motion.div
                  className="text-2xl font-bold font-mono text-indigo-500"
                  key={pingStats.jitter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {pingStats.jitter}
                </motion.div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                  Packet Loss
                </div>
                <motion.div
                  className="text-2xl font-bold font-mono text-purple-500"
                  key={pingStats.packetLoss}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {pingStats.packetLoss}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <AnimatePresence>
            {isPingComplete && (
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center p-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                    Thank you for watching the simulation
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    This was a visual demonstration of network diagnostics
                  </p>
                  <Button
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-emerald-400"
                    onClick={resetPing}
                  >
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    Run Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal - 4 columns */}
        <div className="col-span-4 bg-zinc-950 border-l border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CommandIcon className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold font-mono text-zinc-400">
                Terminal
              </h3>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-black/60">
            <div className="text-zinc-500 mb-2">root@server:~#</div>
            <div className="flex items-start mb-1">
              <span className="text-zinc-500 mr-1.5">$</span>
              <span className="text-emerald-500">{typedCommand}</span>
              <motion.span
                className="inline-block w-2 h-4 ml-0.5 bg-emerald-500"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.2 }}
              ></motion.span>
            </div>

            {terminalOutput.map((line, index) => (
              <motion.div
                key={index}
                className="text-zinc-300 ml-4 mb-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line}
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            {!isRunning ? (
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white"
                onClick={startPing}
              >
                Start Network Trace
              </Button>
            ) : (
              <div className="flex items-center justify-center h-9">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-2 w-2 mr-1.5 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-sm text-zinc-400">
                    {isPingComplete
                      ? "Trace complete"
                      : "Executing network trace..."}
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FakePingTool;
