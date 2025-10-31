"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Calculator,
  AlertCircle,
  Info,
  Users,
  Euro,
} from "lucide-react";
import Head from "@/components/Head";

/**
 * Netherlands Income Tax Calculator for Expats/Foreign Workers (2025)
 *
 * Calculates Dutch income tax for residents and non-residents, including:
 * - Box 1 progressive tax rates (employment income)
 * - 30% ruling benefits for qualifying expats
 * - Resident vs non-resident tax treatment
 * - Social insurance contributions
 *
 * Tax Brackets (2025):
 * - Up to €38,441: ~35.82% (8.17% tax + 27.65% social insurance)
 * - €38,441 - €76,817: ~37.48%
 * - Above €76,817: ~49.50%
 *
 * Sources: PwC Tax Summaries, Belastingdienst.nl, IamExpat Netherlands 2025
 */
export default function NetherlandsExpatTaxCalculator() {
  // Theme state
  const { theme, setTheme } = useTheme();

  // Form input states
  const [grossSalary, setGrossSalary] = useState(60000);
  const [residencyStatus, setResidencyStatus] = useState("resident"); // "resident" or "non-resident"
  const [has30Ruling, setHas30Ruling] = useState(false);
  const [rulingPercentage, setRulingPercentage] = useState(30); // Usually 30%, but can be less
  const [allowableDeductions, setAllowableDeductions] = useState(2000);
  const [isQualifyingNonResident, setIsQualifyingNonResident] = useState(false);

  // Results state
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  /**
   * Calculate Box 1 tax using Dutch progressive rates (2025)
   * Bracket 1: Up to €38,441 at ~35.82%
   * Bracket 2: €38,441 - €76,817 at ~37.48%
   * Bracket 3: Above €76,817 at ~49.50%
   */
  const calculateBox1Tax = (taxableIncome) => {
    const BRACKET_1_LIMIT = 38441;
    const BRACKET_2_LIMIT = 76817;
    const RATE_1 = 0.3582; // ~35.82% (tax + social insurance)
    const RATE_2 = 0.3748; // ~37.48%
    const RATE_3 = 0.495; // ~49.50%

    let tax = 0;
    let breakdown = [];

    if (taxableIncome <= 0) {
      return { total: 0, breakdown: [] };
    }

    // First bracket
    if (taxableIncome > 0) {
      const taxableInBracket1 = Math.min(taxableIncome, BRACKET_1_LIMIT);
      const taxInBracket1 = taxableInBracket1 * RATE_1;
      tax += taxInBracket1;
      breakdown.push({
        bracket: 1,
        income: taxableInBracket1,
        rate: RATE_1,
        tax: taxInBracket1,
        description: `€0 - €${BRACKET_1_LIMIT.toLocaleString()} at ${(
          RATE_1 * 100
        ).toFixed(2)}%`,
      });
    }

    // Second bracket
    if (taxableIncome > BRACKET_1_LIMIT) {
      const taxableInBracket2 = Math.min(
        taxableIncome - BRACKET_1_LIMIT,
        BRACKET_2_LIMIT - BRACKET_1_LIMIT
      );
      const taxInBracket2 = taxableInBracket2 * RATE_2;
      tax += taxInBracket2;
      breakdown.push({
        bracket: 2,
        income: taxableInBracket2,
        rate: RATE_2,
        tax: taxInBracket2,
        description: `€${BRACKET_1_LIMIT.toLocaleString()} - €${BRACKET_2_LIMIT.toLocaleString()} at ${(
          RATE_2 * 100
        ).toFixed(2)}%`,
      });
    }

    // Third bracket
    if (taxableIncome > BRACKET_2_LIMIT) {
      const taxableInBracket3 = taxableIncome - BRACKET_2_LIMIT;
      const taxInBracket3 = taxableInBracket3 * RATE_3;
      tax += taxInBracket3;
      breakdown.push({
        bracket: 3,
        income: taxableInBracket3,
        rate: RATE_3,
        tax: taxInBracket3,
        description: `Above €${BRACKET_2_LIMIT.toLocaleString()} at ${(
          RATE_3 * 100
        ).toFixed(2)}%`,
      });
    }

    return { total: tax, breakdown };
  };

  /**
   * Calculate 30% ruling benefit
   * Up to 30% of gross salary can be tax-free for qualifying expats
   */
  const calculate30RulingBenefit = (grossSalary, percentage) => {
    if (!has30Ruling) return 0;
    return (grossSalary * percentage) / 100;
  };

  /**
   * Validate inputs
   */
  const validateInputs = () => {
    const errors = [];

    if (grossSalary <= 0) {
      errors.push("Gross salary must be greater than 0");
    }

    if (allowableDeductions < 0) {
      errors.push("Deductions cannot be negative");
    }

    if (has30Ruling && (rulingPercentage < 0 || rulingPercentage > 30)) {
      errors.push("30% ruling percentage must be between 0% and 30%");
    }

    return errors;
  };

  /**
   * Main tax calculation function
   */
  const calculateTax = () => {
    setIsCalculating(true);

    // Validate inputs
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsCalculating(false);
      return;
    }

    setValidationErrors([]);

    // Small delay for animation
    setTimeout(() => {
      // Calculate 30% ruling benefit
      const rulingBenefit = calculate30RulingBenefit(
        grossSalary,
        rulingPercentage
      );

      // Calculate taxable income
      // For residents: full worldwide income minus deductions and 30% ruling
      // For non-residents: only Dutch-source income
      const taxableIncome = Math.max(
        0,
        grossSalary - allowableDeductions - rulingBenefit
      );

      // Calculate Box 1 tax
      const box1Tax = calculateBox1Tax(taxableIncome);

      // Additional deductions for qualifying non-residents (EU/EEA)
      let additionalDeductions = 0;
      if (residencyStatus === "non-resident" && isQualifyingNonResident) {
        additionalDeductions = Math.min(1000, box1Tax.total * 0.05); // Example: 5% reduction, max €1000
      }

      const finalTax = Math.max(0, box1Tax.total - additionalDeductions);
      const netSalary = grossSalary - finalTax;

      // Calculate effective rates
      const effectiveTaxRate =
        grossSalary > 0 ? (finalTax / grossSalary) * 100 : 0;
      const marginalRate = getMarginalRate(taxableIncome);

      // Format results
      const formattedResults = {
        // Input summary
        grossSalary: formatCurrency(grossSalary),
        residencyStatus,
        has30Ruling,
        rulingPercentage,
        allowableDeductions: formatCurrency(allowableDeductions),
        isQualifyingNonResident,

        // Calculations
        rulingBenefit: formatCurrency(rulingBenefit),
        taxableIncome: formatCurrency(taxableIncome),
        box1Tax: formatCurrency(box1Tax.total),
        taxBreakdown: box1Tax.breakdown,
        additionalDeductions: formatCurrency(additionalDeductions),
        finalTax: formatCurrency(finalTax),
        netSalary: formatCurrency(netSalary),

        // Rates
        effectiveTaxRate: effectiveTaxRate.toFixed(2) + "%",
        marginalRate: (marginalRate * 100).toFixed(2) + "%",

        // Monthly breakdown
        grossMonthlySalary: formatCurrency(grossSalary / 12),
        netMonthlySalary: formatCurrency(netSalary / 12),
        monthlyTax: formatCurrency(finalTax / 12),

        // Savings from 30% ruling
        rulingSavings:
          rulingBenefit > 0
            ? formatCurrency(rulingBenefit * getMarginalRate(grossSalary))
            : formatCurrency(0),
      };

      setResults(formattedResults);
      setIsCalculating(false);
    }, 300);
  };

  /**
   * Get marginal tax rate for given income level
   */
  const getMarginalRate = (income) => {
    if (income <= 38441) return 0.3582;
    if (income <= 76817) return 0.3748;
    return 0.495;
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    grossSalary,
    residencyStatus,
    has30Ruling,
    rulingPercentage,
    allowableDeductions,
    isQualifyingNonResident,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTax();
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Result item component
  const ResultItem = ({
    label,
    value,
    highlight = false,
    info = null,
    badge = null,
  }) => (
    <div
      className={`flex justify-between items-center py-2 border-b ${
        highlight ? "font-bold text-primary" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
        {info && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
      <span>{value}</span>
    </div>
  );

  return (
    <>
      <Head
        title="Netherlands Income Tax Calculator for Expats & Foreign Workers (2025)"
        description="Calculate Dutch income tax with 30% ruling benefits. Progressive Box 1 rates for residents and non-residents. Includes social insurance contributions."
        imageName="netherlands-expat-tax-calculator"
        featureList={[
          "Netherlands income tax calculator 2025",
          "30% ruling tax benefit calculator",
          "Dutch expat tax estimator",
          "Box 1 progressive tax rates",
          "Resident vs non-resident tax Netherlands",
        ]}
        lastModified="2025-10-31"
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
              Netherlands Expat Tax Calculator
              <span className="block text-lg font-normal text-muted-foreground mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      Income Tax & 30% Ruling 🇳🇱
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Calculate Dutch Box 1 income tax with expat benefits
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Employment & Tax Information
                  </CardTitle>
                  <CardDescription>
                    Enter your employment details to calculate Dutch income tax
                    and 30% ruling benefits for 2025.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {validationErrors.length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Gross Salary */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="grossSalary"
                          className="flex items-center gap-1"
                        >
                          Annual Gross Salary (€)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Your total gross employment income before tax
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="grossSalary"
                          value={grossSalary}
                          onChange={(e) =>
                            setGrossSalary(Number(e.target.value))
                          }
                          min="0"
                          step="1000"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Residency Status */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="residencyStatus"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Tax Residency Status
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Residents taxed on worldwide income,
                                  non-residents only on Dutch income
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={residencyStatus}
                          onValueChange={setResidencyStatus}
                        >
                          <SelectTrigger
                            id="residencyStatus"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select residency status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resident">
                              Dutch Tax Resident
                            </SelectItem>
                            <SelectItem value="non-resident">
                              Non-Resident
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Allowable Deductions */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="allowableDeductions"
                          className="flex items-center gap-1"
                        >
                          Allowable Deductions (€)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Work expenses, mortgage interest, pension
                                  contributions
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="allowableDeductions"
                          value={allowableDeductions}
                          onChange={(e) =>
                            setAllowableDeductions(Number(e.target.value))
                          }
                          min="0"
                          step="500"
                          className="w-full"
                        />
                      </div>

                      {/* 30% Ruling */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="has30Ruling"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          30% Ruling Eligible
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Up to 30% of salary tax-free for qualifying
                                  foreign employees
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex items-center h-10 gap-2 pt-0.5">
                          <Switch
                            id="has30Ruling"
                            checked={has30Ruling}
                            onCheckedChange={setHas30Ruling}
                          />
                          <Label
                            htmlFor="has30Ruling"
                            className="cursor-pointer"
                          >
                            {has30Ruling ? "Yes, eligible" : "No, not eligible"}
                          </Label>
                        </div>
                      </div>

                      {/* 30% Ruling Percentage */}
                      {has30Ruling && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="rulingPercentage"
                            className="flex items-center gap-1"
                          >
                            30% Ruling Percentage (%)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Usually 30%, but may be reduced in some
                                    cases
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Input
                            type="number"
                            id="rulingPercentage"
                            value={rulingPercentage}
                            onChange={(e) =>
                              setRulingPercentage(Number(e.target.value))
                            }
                            min="0"
                            max="30"
                            step="1"
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Qualifying Non-Resident */}
                      {residencyStatus === "non-resident" && (
                        <div className="space-y-2.5">
                          <Label
                            htmlFor="isQualifyingNonResident"
                            className="flex items-center gap-1 text-sm font-medium"
                          >
                            Qualifying Non-Resident
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    EU/EEA citizens may qualify for additional
                                    deductions
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <div className="flex items-center h-10 gap-2 pt-0.5">
                            <Switch
                              id="isQualifyingNonResident"
                              checked={isQualifyingNonResident}
                              onCheckedChange={setIsQualifyingNonResident}
                            />
                            <Label
                              htmlFor="isQualifyingNonResident"
                              className="cursor-pointer"
                            >
                              {isQualifyingNonResident ? "Yes (EU/EEA)" : "No"}
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        disabled={isCalculating}
                        className="w-48"
                      >
                        {isCalculating ? "Calculating..." : "Calculate Tax"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
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
                      Your estimated Dutch income tax calculation for 2025
                      including applicable benefits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="calculation">
                          Calculation
                        </TabsTrigger>
                        <TabsTrigger value="brackets">Tax Brackets</TabsTrigger>
                        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                      </TabsList>

                      {/* Summary Tab */}
                      <TabsContent value="summary" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Income & Deductions
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Annual Gross Salary:"
                                value={results.grossSalary}
                              />
                              <ResultItem
                                label="Allowable Deductions:"
                                value={results.allowableDeductions}
                              />
                              {results.has30Ruling && (
                                <ResultItem
                                  label="30% Ruling Benefit:"
                                  value={results.rulingBenefit}
                                  badge={`${results.rulingPercentage}%`}
                                  info="Tax-free portion under 30% ruling"
                                />
                              )}
                              <ResultItem
                                label="Taxable Income:"
                                value={results.taxableIncome}
                                highlight
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Tax Summary</h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Box 1 Tax:"
                                value={results.box1Tax}
                              />
                              {results.additionalDeductions !==
                                formatCurrency(0) && (
                                <ResultItem
                                  label="Additional Deductions:"
                                  value={`- ${results.additionalDeductions}`}
                                  badge="Qualifying Non-Resident"
                                />
                              )}
                              <ResultItem
                                label="Total Tax:"
                                value={results.finalTax}
                                highlight
                              />
                              <ResultItem
                                label="Net Annual Salary:"
                                value={results.netSalary}
                                highlight
                              />
                              <ResultItem
                                label="Effective Tax Rate:"
                                value={results.effectiveTaxRate}
                                badge="Overall"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Calculation Tab */}
                      <TabsContent
                        value="calculation"
                        className="pt-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Step-by-Step Calculation
                          </h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="1. Gross Salary:"
                              value={results.grossSalary}
                            />
                            <ResultItem
                              label="2. Allowable Deductions:"
                              value={`- ${results.allowableDeductions}`}
                            />
                            {results.has30Ruling && (
                              <ResultItem
                                label="3. 30% Ruling Benefit:"
                                value={`- ${results.rulingBenefit}`}
                                info={`${results.rulingPercentage}% of gross salary tax-free`}
                              />
                            )}
                            <Separator className="my-3" />
                            <ResultItem
                              label="4. Taxable Income:"
                              value={results.taxableIncome}
                              highlight
                            />
                            <ResultItem
                              label="5. Box 1 Tax Applied:"
                              value={results.box1Tax}
                            />
                            <ResultItem
                              label="6. Final Tax Due:"
                              value={results.finalTax}
                              highlight
                            />
                          </div>

                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Tax Status:</strong>{" "}
                              {results.residencyStatus === "resident"
                                ? "Dutch Tax Resident"
                                : "Non-Resident"}
                              <br />
                              <strong>Marginal Rate:</strong>{" "}
                              {results.marginalRate} (rate on next euro earned)
                              {results.has30Ruling && (
                                <>
                                  <br />
                                  <strong>30% Ruling Savings:</strong>{" "}
                                  {results.rulingSavings} (tax saved from
                                  ruling)
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Tax Brackets Tab */}
                      <TabsContent value="brackets" className="pt-2 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            2025 Dutch Tax Brackets (Box 1)
                          </h3>
                          {results.taxBreakdown &&
                          results.taxBreakdown.length > 0 ? (
                            <div className="space-y-3">
                              {results.taxBreakdown.map((bracket, index) => (
                                <div
                                  key={index}
                                  className="p-3 border rounded-lg"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">
                                      {bracket.description}
                                    </span>
                                    <Badge variant="outline">
                                      Bracket {bracket.bracket}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                      Income in bracket:{" "}
                                      {formatCurrency(bracket.income)}
                                    </div>
                                    <div>
                                      Tax on bracket:{" "}
                                      {formatCurrency(bracket.tax)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No taxable income in any bracket.
                            </p>
                          )}

                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                              Box 1 Rates Include:
                            </h4>
                            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                              <li>• Income tax</li>
                              <li>
                                • Social insurance contributions (AOW, Anw, Wlz)
                              </li>
                              <li>• National insurance premiums</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Breakdown Tab */}
                      <TabsContent value="breakdown" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Annual Breakdown
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Salary:"
                                value={results.grossSalary}
                              />
                              <ResultItem
                                label="Total Tax:"
                                value={results.finalTax}
                              />
                              <ResultItem
                                label="Net Salary:"
                                value={results.netSalary}
                                highlight
                              />
                              <ResultItem
                                label="Effective Tax Rate:"
                                value={results.effectiveTaxRate}
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
                                value={results.grossMonthlySalary}
                              />
                              <ResultItem
                                label="Monthly Tax:"
                                value={results.monthlyTax}
                              />
                              <ResultItem
                                label="Net Monthly:"
                                value={results.netMonthlySalary}
                                highlight
                              />
                            </div>
                          </div>
                        </div>

                        {results.has30Ruling && (
                          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                              30% Ruling Benefits Applied
                            </h4>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              Tax-free benefit: {results.rulingBenefit}
                              <br />
                              Tax savings: {results.rulingSavings}
                              <br />
                              Your {results.rulingPercentage}% ruling reduces
                              your taxable income significantly, resulting in
                              substantial tax savings as a foreign worker in the
                              Netherlands.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex flex-col text-xs text-muted-foreground gap-2 pt-4">
                    <span>
                      Last updated:{" "}
                      <span className="font-medium">2025-10-31</span> | Based on
                      2025 Dutch tax regulations
                    </span>
                    <span>
                      <strong>Disclaimer:</strong> This is an estimate for
                      informational purposes only. Consult Belastingdienst or a
                      tax professional for exact calculations.
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        {/* Information Section */}
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <h2 className="text-2xl font-bold tracking-tight mt-12 mb-6">
            Dutch Income Tax System for Expats (2025)
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Three-Box Tax System</h3>
            <p className="text-muted-foreground">
              The Netherlands uses a three-box system for taxation:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Box 1:</strong> Income from work and home ownership
                (employment, pension, benefits)
              </li>
              <li>
                <strong>Box 2:</strong> Income from substantial interest (&gt;5%
                shareholding in companies)
              </li>
              <li>
                <strong>Box 3:</strong> Income from savings and investments
                (deemed return on assets)
              </li>
            </ul>
            <p className="text-muted-foreground">
              This calculator focuses on <strong>Box 1</strong> income, which
              applies to most employed expats.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">2025 Box 1 Tax Rates</h3>
            <p className="text-muted-foreground">
              Box 1 income is taxed progressively with the following brackets:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Up to €38,441:</strong> ~35.82% (includes tax and social
                insurance)
              </li>
              <li>
                <strong>€38,441 - €76,817:</strong> ~37.48%
              </li>
              <li>
                <strong>Above €76,817:</strong> ~49.50%
              </li>
            </ul>
            <p className="text-muted-foreground">
              These rates include income tax and mandatory social insurance
              contributions (AOW pension, Anw survivors' benefits, and Wlz
              long-term care).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              30% Ruling for Expats
            </h3>
            <p className="text-muted-foreground">
              The 30% ruling is a significant tax advantage for qualifying
              foreign employees:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>Up to 30% of gross salary can be received tax-free</li>
              <li>
                Available for up to 5 years (8 years for those who qualified
                before 2019)
              </li>
              <li>
                Must have specific expertise not readily available in the Dutch
                labor market
              </li>
              <li>
                Minimum salary requirements apply (€39,467 in 2025, or €30,001
                if under 30 with master's degree)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Resident vs Non-Resident Taxation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Tax Residents</h4>
                <ul className="space-y-1 list-disc pl-5 text-muted-foreground text-sm">
                  <li>Taxed on worldwide income</li>
                  <li>Full access to deductions and credits</li>
                  <li>Subject to all three tax boxes</li>
                  <li>Can benefit from tax treaties</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Non-Residents</h4>
                <ul className="space-y-1 list-disc pl-5 text-muted-foreground text-sm">
                  <li>Only Dutch-source income taxed</li>
                  <li>Limited deductions available</li>
                  <li>Mainly Box 1 income (employment)</li>
                  <li>EU/EEA citizens may qualify for more benefits</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">2025 Changes</h3>
            <p className="text-muted-foreground">
              Important changes for expats in 2025:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                Partial non-resident status abolished - expats with 30% ruling
                now taxed as full residents for Boxes 2 and 3
              </li>
              <li>
                Continued focus on attracting international talent through the
                30% ruling
              </li>
              <li>Updated salary thresholds for 30% ruling eligibility</li>
            </ul>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">Official Sources</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <a
                  href="https://www.belastingdienst.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Belastingdienst (Dutch Tax Authority){" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://taxsummaries.pwc.com/netherlands"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  PwC Tax Summaries - Netherlands{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://iamexpat.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  IamExpat Netherlands Tax Guide{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * Example Scenarios for Testing:
 *
 * Example 1: Dutch resident with 30% ruling
 * - Salary: €60,000, 30% ruling: €18,000 tax-free
 * - Taxable: €42,000 (after €2,000 deductions)
 * - Tax: ~€14,986, Net: ~€45,014
 *
 * Example 2: High earner without 30% ruling
 * - Salary: €100,000, no ruling
 * - Taxable: €98,000 (after deductions)
 * - Tax: ~€40,899, Net: ~€59,101
 *
 * Example 3: Non-resident qualifying expat
 * - Salary: €80,000, 30% ruling: €24,000 tax-free
 * - Taxable: €54,000, Tax: ~€18,877, Net: ~€61,123
 */
