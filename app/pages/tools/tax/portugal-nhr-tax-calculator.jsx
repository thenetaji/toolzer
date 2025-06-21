"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScaleIcon,
  CheckCircleIcon,
  BarChartIcon,
  CalendarIcon,
  GlobeIcon,
  HelpCircleIcon,
  PinIcon,
  InfoIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import Head from "@/components/Head"

export default function PortugalNHRTaxCalculator() {
  // State for form inputs
  const [grossIncome, setGrossIncome] = useState(60000);
  const [incomeType, setIncomeType] = useState("employment");
  const [isNHR, setIsNHR] = useState(true);
  const [nhrStartYear, setNhrStartYear] = useState(1);

  // State for results
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Current date info
  const currentDate = new Date("2025-06-20T07:35:26Z");
  const currentYear = currentDate.getFullYear();

  // Calculate tax whenever inputs change
  useEffect(() => {
    calculateTax();
  }, [grossIncome, incomeType, isNHR, nhrStartYear]);

  const calculateTax = () => {
    setIsCalculating(true);

    setTimeout(() => {
      // 1. Calculate NHR tax
      let nhrTax = 0;
      let nhrRate = 0;

      if (isNHR) {
        switch (incomeType) {
          case "employment":
            nhrRate = 0.2;
            nhrTax = grossIncome * nhrRate;
            break;
          case "pension":
            nhrRate = 0.1;
            nhrTax = grossIncome * nhrRate;
            break;
          case "foreign":
            nhrRate = 0;
            nhrTax = 0;
            break;
          case "domestic":
            // Domestic income uses standard rates even under NHR
            nhrTax = calculateStandardTax(grossIncome);
            nhrRate = nhrTax / grossIncome;
            break;
          default:
            break;
        }
      } else {
        // If not under NHR, use standard calculation
        nhrTax = calculateStandardTax(grossIncome);
        nhrRate = nhrTax / grossIncome;
      }

      // 2. Calculate standard tax (always computed for comparison)
      const standardTax = calculateStandardTax(grossIncome);
      const standardRate = standardTax / grossIncome;

      // 3. Set results
      setResults({
        nhr: {
          tax: nhrTax,
          rate: nhrRate * 100,
          formattedTax: formatCurrency(nhrTax),
          formattedRate: (nhrRate * 100).toFixed(2) + "%",
        },
        standard: {
          tax: standardTax,
          rate: standardRate * 100,
          formattedTax: formatCurrency(standardTax),
          formattedRate: (standardRate * 100).toFixed(2) + "%",
        },
        saving: {
          amount: standardTax - nhrTax,
          formattedAmount: formatCurrency(standardTax - nhrTax),
          percentage:
            (((standardTax - nhrTax) / standardTax) * 100).toFixed(2) + "%",
        },
      });

      setIsCalculating(false);
    }, 300);
  };

  const calculateStandardTax = (income) => {
    // Portugal 2025 progressive tax rates
    const brackets = [
      { threshold: 0, rate: 0.1325 },
      { threshold: 7704, rate: 0.18 },
      { threshold: 11624, rate: 0.23 },
      { threshold: 16473, rate: 0.26 },
      { threshold: 21322, rate: 0.3275 },
      { threshold: 27147, rate: 0.37 },
      { threshold: 39792, rate: 0.435 },
      { threshold: 51998, rate: 0.45 },
      { threshold: 81200, rate: 0.48 },
    ];

    let tax = 0;
    let remainingIncome = income;

    for (let i = 0; i < brackets.length; i++) {
      const currentBracket = brackets[i];
      const nextBracket = brackets[i + 1];

      if (!nextBracket) {
        // This is the highest bracket
        tax += remainingIncome * currentBracket.rate;
        break;
      }

      const bracketIncome = Math.min(
        nextBracket.threshold - currentBracket.threshold,
        remainingIncome
      );

      tax += bracketIncome * currentBracket.rate;
      remainingIncome -= bracketIncome;

      if (remainingIncome <= 0) break;
    }

    return tax;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTax();
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
    <Head
  title="Portugal NHR Tax Calculator (2025) – Non-Habitual Resident Income Estimator"
  description="Estimate your 2025 tax under Portugal’s NHR regime, including salary, pension, and tax-exempt foreign income"
  imageName="portugal-nhr-tax-calculator"
  featureList={[
    "Portugal NHR tax calculator 2025",
    "Non-Habitual Resident income estimator",
    "Portugal expat tax rules explained",
    "20% flat tax on employment income",
    "Pension and foreign income exemption Portugal"
  ]}
  lastModified="2025-06-20"
/>

    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Portugal NHR Tax Calculator – 2025
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare tax under NHR regime vs standard Portuguese tax rates
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Income Details</CardTitle>
            <CardDescription>
              Enter your income details to calculate estimated tax
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome" className="flex items-center">
                    Annual Gross Income (EUR)
                    <span
                      className="ml-1 text-xs text-muted-foreground hover:cursor-help"
                      title="Your total annual income before any deductions"
                    >
                      ℹ️
                    </span>
                  </Label>
                  <Input
                    type="number"
                    id="grossIncome"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeType" className="flex items-center">
                    Income Type
                    <span
                      className="ml-1 text-xs text-muted-foreground hover:cursor-help"
                      title="Different income types are taxed differently under NHR"
                    >
                      ℹ️
                    </span>
                  </Label>
                  <Select value={incomeType} onValueChange={setIncomeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">
                        Employment (20% NHR rate)
                      </SelectItem>
                      <SelectItem value="pension">
                        Pension (10% NHR rate)
                      </SelectItem>
                      <SelectItem value="foreign">
                        Other Foreign Income (Exempt under NHR)
                      </SelectItem>
                      <SelectItem value="domestic">
                        Domestic Portuguese Income
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isNHR" className="flex items-center">
                    NHR Status
                    <span
                      className="ml-1 text-xs text-muted-foreground hover:cursor-help"
                      title="Are you registered under the Non-Habitual Resident tax regime?"
                    >
                      ℹ️
                    </span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNHR"
                      checked={isNHR}
                      onCheckedChange={setIsNHR}
                    />
                    <Label htmlFor="isNHR" className="cursor-pointer">
                      {isNHR
                        ? "Yes, I have NHR status"
                        : "No, I pay standard rates"}
                    </Label>
                  </div>
                </div>

                {isNHR && (
                  <div className="space-y-2">
                    <Label htmlFor="nhrStartYear" className="flex items-center">
                      Year of NHR (1-10)
                      <span
                        className="ml-1 text-xs text-muted-foreground hover:cursor-help"
                        title="NHR status lasts for 10 years. Which year are you in?"
                      >
                        ℹ️
                      </span>
                    </Label>
                    <Select
                      value={nhrStartYear.toString()}
                      onValueChange={(value) => setNhrStartYear(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select NHR year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              Year {year} of 10
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button type="submit" className="px-8" disabled={isCalculating}>
                  {isCalculating ? "Calculating..." : "Calculate Tax"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {results && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className={isNHR ? "border-primary/20" : ""}>
                <CardHeader className={isNHR ? "bg-primary/5" : ""}>
                  <CardTitle className="flex items-center">
                    NHR Tax Regime
                    {isNHR && (
                      <span className="ml-2 text-sm bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isNHR
                      ? `Year ${nhrStartYear} of 10 year benefit period`
                      : "Estimation if you had NHR status"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">
                        Gross Income:
                      </span>
                      <span>{formatCurrency(grossIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">
                        Applicable Rate:
                      </span>
                      <span>{results.nhr.formattedRate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b font-medium text-lg">
                      <span>Tax Amount:</span>
                      <span className="text-primary">
                        {results.nhr.formattedTax}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b font-medium text-lg">
                      <span>Net Income:</span>
                      <span>
                        {formatCurrency(grossIncome - results.nhr.tax)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Card className={!isNHR ? "border-primary/20" : ""}>
                <CardHeader className={!isNHR ? "bg-primary/5" : ""}>
                  <CardTitle className="flex items-center">
                    Standard Tax Regime
                    {!isNHR && (
                      <span className="ml-2 text-sm bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Regular Portuguese progressive tax rates
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">
                        Gross Income:
                      </span>
                      <span>{formatCurrency(grossIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">
                        Effective Rate:
                      </span>
                      <span>{results.standard.formattedRate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b font-medium text-lg">
                      <span>Tax Amount:</span>
                      <span className="text-primary">
                        {results.standard.formattedTax}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b font-medium text-lg">
                      <span>Net Income:</span>
                      <span>
                        {formatCurrency(grossIncome - results.standard.tax)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {results && results.saving.amount > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="font-semibold text-lg text-green-700 dark:text-green-400">
                      Tax Saving with NHR
                    </h3>
                    <p className="text-green-600 dark:text-green-500">
                      Compared to standard Portuguese tax rates
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {results.saving.formattedAmount}
                    </p>
                    <p className="text-green-600 dark:text-green-500">
                      {results.saving.percentage} tax reduction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mt-10 text-sm text-muted-foreground">
          <p className="text-center">
            Last updated: {currentDate.toISOString().split("T")[0]} | For
            information purposes only.
          </p>
          <p className="text-center mt-1">
            This calculator provides estimates. Consult a tax professional for
            specific advice.
          </p>
        </div>
      </section>

      <section className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <Card className="rounded-2xl shadow-sm border bg-background text-foreground">
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6 space-y-8">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ScaleIcon className="w-5 h-5" /> How Portugal's NHR
                (Non-Habitual Resident) Tax Regime Works (2025)
              </h2>
              <p>
                Portugal’s <strong>Non-Habitual Resident (NHR)</strong> program
                offers a <strong>20% flat tax</strong> on local employment
                income and <strong>full exemptions</strong> on most foreign
                income, lasting 10 years for eligible expats.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <InfoIcon className="w-5 h-5" /> Residency Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Stay in Portugal ≥183 days or establish habitual residence
                </li>
                <li>No Portuguese tax residence in previous 5 years</li>
                <li>Apply before March 31 of the following tax year</li>
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <CheckCircleIcon className="w-5 h-5" /> NHR Tax Benefits
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>20%</strong> flat rate on eligible Portuguese income
                </li>
                <li>
                  <strong>10%</strong> flat rate on foreign pensions
                </li>
                <li>
                  <strong>0%</strong> on dividends, royalties, capital gains (if
                  taxed abroad)
                </li>
                <li>No wealth, inheritance, or gift taxes</li>
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <BarChartIcon className="w-5 h-5" /> Standard Tax Brackets (No
                NHR)
              </h3>
              <p>If you’re not under NHR, income is taxed progressively:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>€0–7,703 → 13.25%</li>
                <li>€7,704–11,623 → 18%</li>
                <li>€11,624–16,472 → 23%</li>
                <li>€16,473–21,321 → 26%</li>
                <li>€21,322–27,146 → 32.75%</li>
                <li>€27,147–39,791 → 37%</li>
                <li>€39,792–51,997 → 43.5%</li>
                <li>€51,998–81,199 → 45%</li>
                <li>€81,200+ → 48%</li>
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <CalendarIcon className="w-5 h-5" /> Duration & Transition
              </h3>
              <p>
                The NHR status applies for 10 consecutive years, after which
                standard tax rates apply. You cannot reapply for NHR once it
                ends.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <GlobeIcon className="w-5 h-5" /> Foreign Income & Tax Treaties
              </h3>
              <p>
                Foreign dividends, capital gains, pensions, and royalties are
                exempt in Portugal if they are taxable in another treaty
                country.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <HelpCircleIcon className="w-5 h-5" /> Who Should Use This Tool?
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital nomads moving to Portugal</li>
                <li>Professionals in high-value sectors</li>
                <li>Foreign pensioners relocating for retirement</li>
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <PinIcon className="w-5 h-5" /> How to Apply for NHR
              </h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Obtain a Portuguese tax ID (NIF)</li>
                <li>Establish residency in Portugal</li>
                <li>Apply via Portal das Finanças before March 31</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>
      </div>
    </>
  );
}
