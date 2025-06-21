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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import Head from "@/components/Head";

export default function TaxCalculator() {
  // Theme state
  const { theme, setTheme } = useTheme();

  // State for form inputs
  const [grossIncome, setGrossIncome] = useState(60000);
  const [filingStatus, setFilingStatus] = useState("Single");
  const [isChurchMember, setIsChurchMember] = useState(false);
  const [selectedState, setSelectedState] = useState("Bavaria");
  const [children, setChildren] = useState(0);
  const [healthRate, setHealthRate] = useState(8.15);

  // State for results
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // German states with their church tax rates
  const states = [
    { name: "Baden-Württemberg", churchTaxRate: 8 },
    { name: "Bavaria", churchTaxRate: 8 },
    { name: "Berlin", churchTaxRate: 9 },
    { name: "Brandenburg", churchTaxRate: 9 },
    { name: "Bremen", churchTaxRate: 9 },
    { name: "Hamburg", churchTaxRate: 9 },
    { name: "Hesse", churchTaxRate: 9 },
    { name: "Lower Saxony", churchTaxRate: 9 },
    { name: "Mecklenburg-Vorpommern", churchTaxRate: 9 },
    { name: "North Rhine-Westphalia", churchTaxRate: 9 },
    { name: "Rhineland-Palatinate", churchTaxRate: 9 },
    { name: "Saarland", churchTaxRate: 9 },
    { name: "Saxony", churchTaxRate: 9 },
    { name: "Saxony-Anhalt", churchTaxRate: 9 },
    { name: "Schleswig-Holstein", churchTaxRate: 9 },
    { name: "Thuringia", churchTaxRate: 9 },
  ];

  // Calculate tax whenever inputs change
  useEffect(() => {
    // Small delay to avoid too many calculations
    const timer = setTimeout(() => {
      calculateTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    grossIncome,
    filingStatus,
    isChurchMember,
    selectedState,
    children,
    healthRate,
  ]);

  const calculateTax = () => {
    setIsCalculating(true);

    // Simulate a small delay to show animation
    setTimeout(() => {
      // Constants
      const TAX_FREE_ALLOWANCE = 12096;
      const INCOME_TAX_THRESHOLD_1 = 12097;
      const INCOME_TAX_THRESHOLD_2 = 68429;
      const INCOME_TAX_THRESHOLD_3 = 277825;
      const SOLI_THRESHOLD_SINGLE = 1450;
      const SOLI_THRESHOLD_MARRIED = 2900;
      const PENSION_MAX = 96600;
      const HEALTH_MAX = 66150;
      const UNEMPLOYMENT_RATE = 1.2;
      const CARE_RATE = 1.75;

      // 1. Calculate taxable income
      let taxableIncome = Math.max(0, grossIncome - TAX_FREE_ALLOWANCE);

      // If married, double the tax-free allowance (simplified)
      if (filingStatus === "Married") {
        taxableIncome = Math.max(0, grossIncome - TAX_FREE_ALLOWANCE * 2);
      }

      // 2. Calculate income tax (progressive)
      let incomeTax = 0;
      if (taxableIncome > 0) {
        if (taxableIncome <= INCOME_TAX_THRESHOLD_2 - INCOME_TAX_THRESHOLD_1) {
          // Progressive from 14% to 42%
          const rate =
            14 +
            (taxableIncome /
              (INCOME_TAX_THRESHOLD_2 - INCOME_TAX_THRESHOLD_1)) *
              28;
          incomeTax = (taxableIncome * rate) / 100;
        } else if (
          taxableIncome <=
          INCOME_TAX_THRESHOLD_3 - INCOME_TAX_THRESHOLD_1
        ) {
          // 42% bracket
          incomeTax = (taxableIncome * 42) / 100;
        } else {
          // 45% bracket
          incomeTax = (taxableIncome * 45) / 100;
        }
      }

      // 3. Calculate solidarity surcharge (Soli)
      let solidaritySurcharge = 0;
      const soliThreshold =
        filingStatus === "Married"
          ? SOLI_THRESHOLD_MARRIED
          : SOLI_THRESHOLD_SINGLE;
      if (incomeTax > soliThreshold) {
        solidaritySurcharge = incomeTax * 0.055;
      }

      // 4. Calculate church tax if applicable
      let churchTax = 0;
      if (isChurchMember) {
        const churchTaxRate = states.find(
          (state) => state.name === selectedState
        ).churchTaxRate;
        churchTax = (incomeTax * churchTaxRate) / 100;
      }

      // 5. Calculate social contributions
      const pensionBase = Math.min(grossIncome, PENSION_MAX);
      const pensionContribution = (pensionBase * 9.3) / 100;

      const healthBase = Math.min(grossIncome, HEALTH_MAX);
      const healthContribution = (healthBase * healthRate) / 100;

      const unemploymentBase = Math.min(grossIncome, PENSION_MAX);
      const unemploymentContribution =
        (unemploymentBase * UNEMPLOYMENT_RATE) / 100;

      const careBase = Math.min(grossIncome, HEALTH_MAX);
      const careContribution = (careBase * CARE_RATE) / 100;

      const totalSocialContributions =
        pensionContribution +
        healthContribution +
        unemploymentContribution +
        careContribution;

      // 6. Calculate net salary
      const totalDeductions =
        incomeTax + solidaritySurcharge + churchTax + totalSocialContributions;
      const netSalary = grossIncome - totalDeductions;

      // Format and set results
      setResults({
        grossIncome: formatCurrency(grossIncome),
        taxableIncome: formatCurrency(taxableIncome),
        incomeTax: formatCurrency(incomeTax),
        solidaritySurcharge: formatCurrency(solidaritySurcharge),
        churchTax: formatCurrency(churchTax),
        pensionContribution: formatCurrency(pensionContribution),
        healthContribution: formatCurrency(healthContribution),
        unemploymentContribution: formatCurrency(unemploymentContribution),
        careContribution: formatCurrency(careContribution),
        totalSocialContributions: formatCurrency(totalSocialContributions),
        totalDeductions: formatCurrency(totalDeductions),
        netSalary: formatCurrency(netSalary),
        monthlyNetSalary: formatCurrency(netSalary / 12),
        effectiveTaxRate:
          ((totalDeductions / grossIncome) * 100).toFixed(2) + "%",
      });

      setIsCalculating(false);
    }, 300);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
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

  // Simple fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Result item component
  const ResultItem = ({ label, value, highlight = false }) => (
    <div
      className={`flex justify-between items-center py-2 border-b ${
        highlight ? "font-bold text-primary" : ""
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <>
      <Head
        title="Germany Expat Income Tax & Church Tax Calculator (2025)"
        description="Accurately estimate your 2025 income tax, church tax, and net salary in Germany as an expat. Includes solidarity surcharge and social contributions."
        imageName="germany-tax-calculator"
        featureList={[
          "Germany income tax calculator",
          "Church tax calculator Germany",
          "Net salary estimator for expats",
          "Solidarity surcharge estimator",
          "2025 German tax rules",
        ]}
        lastModified="2025-06-20"
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <section className="mb-12">
          <motion.div
            className="flex flex-col items-center justify-center mb-8 gap-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-primary">
              Germany Expat Tax Calculator <span>2025</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Enter Your Details</CardTitle>
                  <CardDescription>
                    Fill in your personal information to calculate your German
                    taxes for 2025.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="grossIncome"
                          className="flex items-center gap-1"
                        >
                          Gross Annual Income (EUR)
                          <span
                            className="text-xs text-muted-foreground"
                            title="Your total annual income before any deductions"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <Input
                          type="number"
                          id="grossIncome"
                          value={grossIncome}
                          onChange={(e) =>
                            setGrossIncome(Number(e.target.value))
                          }
                          min="0"
                          step="1000"
                          required
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label
                          htmlFor="filingStatus"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Filing Status
                          <span
                            className="text-xs text-muted-foreground cursor-help"
                            title="Your tax filing status - affects tax brackets and allowances"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <Select
                          value={filingStatus}
                          onValueChange={setFilingStatus}
                        >
                          <SelectTrigger id="filingStatus" className="w-full">
                            <SelectValue placeholder="Select filing status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2.5">
                        <Label
                          htmlFor="isChurchMember"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Church Member
                          <span
                            className="text-xs text-muted-foreground cursor-help"
                            title="If you're registered as a member of a recognized church, you'll pay church tax"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <div className="flex items-center h-10 gap-2 pt-0.5">
                          <Switch
                            id="isChurchMember"
                            checked={isChurchMember}
                            onCheckedChange={setIsChurchMember}
                          />
                          <Label
                            htmlFor="isChurchMember"
                            className="cursor-pointer"
                          >
                            {isChurchMember ? "Yes" : "No"}
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <Label
                          htmlFor="selectedState"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          State (Bundesland)
                          <span
                            className="text-xs text-muted-foreground cursor-help"
                            title="The German state where you live - affects church tax rate"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <Select
                          value={selectedState}
                          onValueChange={setSelectedState}
                        >
                          <SelectTrigger id="selectedState" className="w-full">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.name} value={state.name}>
                                {state.name} ({state.churchTaxRate}% church tax)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2.5">
                        <Label
                          htmlFor="children"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Number of Children
                          <span
                            className="text-xs text-muted-foreground cursor-help"
                            title="Optional - number of dependent children"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <Input
                          type="number"
                          id="children"
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          min="0"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label
                          htmlFor="healthRate"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Health Insurance Rate (%)
                          <span
                            className="text-xs text-muted-foreground cursor-help"
                            title="Your health insurance contribution rate - default is 8.15%"
                          >
                            ℹ️
                          </span>
                        </Label>
                        <Input
                          type="number"
                          id="healthRate"
                          value={healthRate}
                          onChange={(e) =>
                            setHealthRate(Number(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        disabled={isCalculating}
                        className="w-48"
                      >
                        {isCalculating ? "Calculating..." : "Calculate Taxes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      Tax Calculation Results
                    </CardTitle>
                    <CardDescription>
                      Based on your information, here's your tax breakdown for
                      2025.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="taxes">Taxes</TabsTrigger>
                        <TabsTrigger value="social">
                          Social Security
                        </TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Income</h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Annual Income:"
                                value={results.grossIncome}
                              />
                              <ResultItem
                                label="Taxable Income:"
                                value={results.taxableIncome}
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Key Results</h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Total Deductions:"
                                value={results.totalDeductions}
                              />
                              <ResultItem
                                label="Annual Net Income:"
                                value={results.netSalary}
                                highlight
                              />
                              <ResultItem
                                label="Monthly Net Income:"
                                value={results.monthlyNetSalary}
                                highlight
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="taxes" className="pt-2 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Tax Breakdown</h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="Income Tax:"
                              value={results.incomeTax}
                            />
                            <ResultItem
                              label="Solidarity Surcharge:"
                              value={results.solidaritySurcharge}
                            />
                            <ResultItem
                              label="Church Tax:"
                              value={results.churchTax}
                            />
                            <Separator className="my-3" />
                            <ResultItem
                              label="Effective Tax Rate:"
                              value={results.effectiveTaxRate}
                              highlight
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="social" className="pt-2 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Social Security Contributions
                          </h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="Pension (9.3%):"
                              value={results.pensionContribution}
                            />
                            <ResultItem
                              label={`Health (${healthRate}%):`}
                              value={results.healthContribution}
                            />
                            <ResultItem
                              label="Unemployment (1.2%):"
                              value={results.unemploymentContribution}
                            />
                            <ResultItem
                              label="Care (1.75%):"
                              value={results.careContribution}
                            />
                            <Separator className="my-3" />
                            <ResultItem
                              label="Total Social Contributions:"
                              value={results.totalSocialContributions}
                              highlight
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="summary" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Annual Summary
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Income:"
                                value={results.grossIncome}
                              />
                              <ResultItem
                                label="Income Tax:"
                                value={results.incomeTax}
                              />
                              <ResultItem
                                label="Solidarity Surcharge:"
                                value={results.solidaritySurcharge}
                              />
                              <ResultItem
                                label="Church Tax:"
                                value={results.churchTax}
                              />
                              <ResultItem
                                label="Social Contributions:"
                                value={results.totalSocialContributions}
                              />
                              <Separator className="my-3" />
                              <ResultItem
                                label="Total Deductions:"
                                value={results.totalDeductions}
                              />
                              <ResultItem
                                label="Net Annual Income:"
                                value={results.netSalary}
                                highlight
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Monthly Breakdown
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Monthly:"
                                value={formatCurrency(
                                  parseInt(
                                    results.grossIncome.replace(/[^\d.-]/g, "")
                                  ) / 12
                                )}
                              />
                              <ResultItem
                                label="Income Tax:"
                                value={formatCurrency(
                                  parseInt(
                                    results.incomeTax.replace(/[^\d.-]/g, "")
                                  ) / 12
                                )}
                              />
                              <ResultItem
                                label="Social Contributions:"
                                value={formatCurrency(
                                  parseInt(
                                    results.totalSocialContributions.replace(
                                      /[^\d.-]/g,
                                      ""
                                    )
                                  ) / 12
                                )}
                              />
                              <ResultItem
                                label="Other Taxes:"
                                value={formatCurrency(
                                  (parseInt(
                                    results.solidaritySurcharge.replace(
                                      /[^\d.-]/g,
                                      ""
                                    )
                                  ) +
                                    parseInt(
                                      results.churchTax.replace(/[^\d.-]/g, "")
                                    )) /
                                    12
                                )}
                              />
                              <Separator className="my-3" />
                              <ResultItem
                                label="Net Monthly Income:"
                                value={results.monthlyNetSalary}
                                highlight
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex flex-col text-xs text-muted-foreground gap-2 pt-4">
                    <span>
                      Last updated:{" "}
                      <span className="font-medium">2025-06-20</span> | Based on
                      2025 German tax regulations
                    </span>
                    <span>
                      <strong>Note:</strong> This is an estimation tool. Please
                      consult a tax professional for exact calculations.
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">
            How Germany's Expat Income Tax System Works (2025)
          </h2>
          <p className="text-muted-foreground">
            Germany has one of the most structured and progressive income tax
            systems in the world. For 2025, residents and qualifying expats are
            taxed on a sliding scale starting from 14% and going up to 45%,
            depending on their income bracket.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Tax-Free Allowance</h3>
            <p className="text-muted-foreground">
              All individuals are entitled to a tax-free allowance
              (Grundfreibetrag) of <strong>€12,096</strong> for the 2025 tax
              year. Income below this threshold is not subject to income tax.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Progressive Tax Brackets
            </h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>€0 – €12,096:</strong> 0% (tax-free)
              </li>
              <li>
                <strong>€12,097 – €68,429:</strong> Progressive rate from 14% to
                ~42%
              </li>
              <li>
                <strong>€68,430 – €277,825:</strong> Flat 42%
              </li>
              <li>
                <strong>Over €277,826:</strong> Flat 45%
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Solidarity Surcharge (Soli)
            </h3>
            <p className="text-muted-foreground">
              The solidarity surcharge is an additional <strong>5.5%</strong>{" "}
              levied on income tax, but it only applies if your income tax
              liability exceeds:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>€1,450</strong> for single filers
              </li>
              <li>
                <strong>€2,900</strong> for married couples filing jointly
              </li>
            </ul>
            <p className="text-muted-foreground">
              Most lower and middle-income earners are exempt due to this
              threshold.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Church Tax in Germany
            </h3>
            <p className="text-muted-foreground">
              If you are registered with a recognized religious community (e.g.,
              Catholic or Protestant), you will be required to pay a{" "}
              <strong>church tax</strong> (Kirchensteuer) on top of your income
              tax. Rates vary by state:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>8%</strong> in Bavaria and Baden-Württemberg
              </li>
              <li>
                <strong>9%</strong> in all other federal states
              </li>
            </ul>
            <p className="text-muted-foreground">
              If you do not wish to pay this tax, you must formally opt out by
              deregistering with the local tax office.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Social Security Contributions
            </h3>
            <p className="text-muted-foreground">
              Employees in Germany contribute to several mandatory insurance
              schemes. The employee portion includes:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>9.3%</strong> for pension insurance (up to €96,600)
              </li>
              <li>
                <strong>~8.15%</strong> for health insurance (adjustable, up to
                €66,150)
              </li>
              <li>
                <strong>1.2%</strong> for unemployment insurance (up to €96,600)
              </li>
              <li>
                <strong>1.75%</strong> for long-term care insurance (up to
                €66,150)
              </li>
            </ul>
            <p className="text-muted-foreground">
              Employers match most of these contributions. These amounts are
              automatically deducted from your gross salary.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Expat Taxation Rules</h3>
            <p className="text-muted-foreground">
              Expats residing in Germany for more than 183 days in a tax year
              are generally considered tax residents. This means:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>You are taxed on your worldwide income.</li>
              <li>
                You may qualify for double taxation relief if your country has a
                tax treaty with Germany.
              </li>
              <li>
                Church tax only applies if you officially register with a
                church.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Net Salary &amp; Take-Home Pay
            </h3>
            <p className="text-muted-foreground">
              After income tax, solidarity surcharge, church tax (if
              applicable), and social contributions are deducted, your{" "}
              <strong>net salary</strong> is what you take home. This calculator
              estimates all components based on current thresholds to help you
              budget accurately.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">Note on Accuracy</h3>
            <p className="text-muted-foreground">
              This calculator provides an estimate based on 2025 rules and may
              not include every personal deduction or rebate. For exact tax
              filing support, consult a registered tax advisor (Steuerberater).
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
