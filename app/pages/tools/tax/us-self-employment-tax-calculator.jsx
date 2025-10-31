"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import Head from "@/components/Head";

// 2025 Tax Constants (IRS/SSA Sources)
const TAX_CONSTANTS = {
  SE_TAX_RATE: 0.153, // 15.3% (12.4% SS + 2.9% Medicare)
  SS_RATE: 0.124, // 12.4% Social Security
  MEDICARE_RATE: 0.029, // 2.9% Medicare
  ADDITIONAL_MEDICARE_RATE: 0.009, // 0.9% Additional Medicare
  SE_BASE_MULTIPLIER: 0.9235, // 92.35% (IRS Schedule SE)
  SS_WAGE_BASE_2025: 176100, // 2025 Social Security wage base (SSA)
  MIN_SE_TAX_THRESHOLD: 400, // Minimum net profit for SE tax filing

  // Additional Medicare thresholds by filing status
  ADDITIONAL_MEDICARE_THRESHOLDS: {
    single: 200000,
    "married-filing-jointly": 250000,
    "married-filing-separately": 125000,
    "head-of-household": 200000,
  },

  // Simplified 2025 Federal Tax Brackets (for estimation)
  FEDERAL_TAX_BRACKETS: {
    single: [
      { min: 0, max: 11600, rate: 0.1 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191650, rate: 0.24 },
      { min: 191650, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
    "married-filing-jointly": [
      { min: 0, max: 23200, rate: 0.1 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ],
  },
};

/**
 * U.S. Self-Employment Tax Calculator (2025)
 *
 * Calculates federal self-employment tax for sole proprietors/freelancers including:
 * - Schedule SE self-employment tax (15.3%)
 * - Social Security tax (12.4% up to wage base)
 * - Medicare tax (2.9% + 0.9% additional)
 * - Half SE tax deduction
 * - QBI deduction (Section 199A)
 * - Estimated federal income tax
 *
 * Sources:
 * - IRS Schedule SE: https://www.irs.gov/instructions/i1040sse
 * - IRS Publication 334: https://www.irs.gov/publications/p334
 * - IRS Topic 554: https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes
 * - QBI Form 8995: https://www.irs.gov/newsroom/qualified-business-income-deduction
 * - SSA Wage Base: https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf
 */
export default function SelfEmploymentTaxEstimator() {
  // Form input states
  const [grossReceipts, setGrossReceipts] = useState(80000);
  const [businessExpenses, setBusinessExpenses] = useState(20000);
  const [netProfitOverride, setNetProfitOverride] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [w2Wages, setW2Wages] = useState(0);
  const [w2Withholding, setW2Withholding] = useState(0);
  const [qbiEligible, setQbiEligible] = useState(true);
  const [qbiPercentage, setQbiPercentage] = useState(20);
  const [retirementContributions, setRetirementContributions] = useState(0);
  const [healthInsurancePremiums, setHealthInsurancePremiums] = useState(0);
  const [homeOfficeDeduction, setHomeOfficeDeduction] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [taxYear, setTaxYear] = useState(2025);

  // Results state
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showDetailed, setShowDetailed] = useState(false);

  /**
   * Compute net business profit
   * Source: IRS Schedule C
   */
  const computeNetProfit = (receipts, expenses, override = null) => {
    if (override !== null && override !== "") {
      return Number(override);
    }
    return Math.max(0, receipts - expenses);
  };

  /**
   * Compute SE tax base (92.35% of net profit)
   * Source: IRS Schedule SE, Line 4a
   */
  const computeSEBase = (netProfit) => {
    return netProfit * TAX_CONSTANTS.SE_BASE_MULTIPLIER;
  };

  /**
   * Compute Social Security tax (12.4% up to wage base)
   * Source: IRS Schedule SE, considering W-2 wages already subject to SS tax
   */
  const computeSocialSecurity = (
    seBase,
    w2Wages,
    wageBase = TAX_CONSTANTS.SS_WAGE_BASE_2025
  ) => {
    const remainingWageBase = Math.max(0, wageBase - w2Wages);
    const taxableForSS = Math.min(seBase, remainingWageBase);
    return {
      taxableAmount: taxableForSS,
      tax: taxableForSS * TAX_CONSTANTS.SS_RATE,
      cappedAtWageBase: seBase > remainingWageBase,
    };
  };

  /**
   * Compute Medicare taxes (2.9% + 0.9% additional)
   * Source: IRS Schedule SE + Form 8959 (Additional Medicare Tax)
   */
  const computeMedicare = (seBase, w2Wages, filingStatus) => {
    const regularMedicare = seBase * TAX_CONSTANTS.MEDICARE_RATE;

    // Additional Medicare Tax calculation
    const threshold =
      TAX_CONSTANTS.ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus] || 200000;
    const totalIncomeForAdditional = seBase + w2Wages;
    const additionalMedicareBase = Math.max(
      0,
      totalIncomeForAdditional - threshold
    );
    const additionalMedicare =
      additionalMedicareBase * TAX_CONSTANTS.ADDITIONAL_MEDICARE_RATE;

    return {
      regular: regularMedicare,
      additional: additionalMedicare,
      total: regularMedicare + additionalMedicare,
      threshold,
      exceedsThreshold: totalIncomeForAdditional > threshold,
    };
  };

  /**
   * Compute total SE tax
   * Source: IRS Schedule SE
   */
  const computeTotalSETax = (socialSecurity, medicare) => {
    return socialSecurity.tax + medicare.total;
  };

  /**
   * Compute half SE tax deduction (above-the-line)
   * Source: IRS Form 1040, Schedule 1, Line 15
   */
  const computeHalfSETaxDeduction = (totalSETax) => {
    return totalSETax * 0.5;
  };

  /**
   * Compute QBI deduction (simplified)
   * Source: IRS Form 8995/8995-A (Section 199A)
   * Note: This is a simplified calculation - actual QBI has complex limitations
   */
  const computeQbiDeduction = (netQualifiedIncome, percentage, eligible) => {
    if (!eligible) return 0;
    return (netQualifiedIncome * percentage) / 100;
  };

  /**
   * Estimate federal income tax (simplified progressive calculation)
   * Source: IRS Publication 15 / Form 1040
   */
  const estimateFederalIncomeTax = (taxableIncome, filingStatus) => {
    const brackets =
      TAX_CONSTANTS.FEDERAL_TAX_BRACKETS[filingStatus] ||
      TAX_CONSTANTS.FEDERAL_TAX_BRACKETS["single"];

    let tax = 0;
    let taxBreakdown = [];

    for (let bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(
          taxableIncome - bracket.min,
          bracket.max - bracket.min
        );
        const taxInBracket = taxableInBracket * bracket.rate;
        tax += taxInBracket;

        if (taxableInBracket > 0) {
          taxBreakdown.push({
            min: bracket.min,
            max: bracket.max === Infinity ? "∞" : bracket.max,
            rate: bracket.rate,
            taxableAmount: taxableInBracket,
            tax: taxInBracket,
          });
        }
      }
    }

    return { total: tax, breakdown: taxBreakdown };
  };

  /**
   * Suggest quarterly estimated tax payments
   * Source: IRS Form 1040ES
   */
  const suggestQuarterlyPayments = (estimatedTaxDue) => {
    if (estimatedTaxDue <= 1000) return 0; // No estimated payments required if tax due ≤ $1,000
    return Math.ceil(estimatedTaxDue / 4);
  };

  /**
   * Validate inputs
   */
  const validateInputs = () => {
    const errors = [];

    if (grossReceipts < 0) errors.push("Gross receipts cannot be negative");
    if (businessExpenses < 0)
      errors.push("Business expenses cannot be negative");
    if (w2Wages < 0) errors.push("W-2 wages cannot be negative");
    if (retirementContributions < 0)
      errors.push("Retirement contributions cannot be negative");
    if (healthInsurancePremiums < 0)
      errors.push("Health insurance premiums cannot be negative");
    if (homeOfficeDeduction < 0)
      errors.push("Home office deduction cannot be negative");

    if (qbiPercentage < 0 || qbiPercentage > 20) {
      errors.push("QBI percentage must be between 0% and 20%");
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
      // Step 1: Compute net profit
      const netProfit = computeNetProfit(
        grossReceipts,
        businessExpenses,
        netProfitOverride
      );

      // Check if below SE tax threshold
      const belowThreshold = netProfit < TAX_CONSTANTS.MIN_SE_TAX_THRESHOLD;

      // Step 2: Compute SE tax base
      const seBase = computeSEBase(netProfit);

      // Step 3: Compute SE tax components
      const socialSecurity = computeSocialSecurity(seBase, w2Wages);
      const medicare = computeMedicare(seBase, w2Wages, filingStatus);
      const totalSETax = belowThreshold
        ? 0
        : computeTotalSETax(socialSecurity, medicare);

      // Step 4: Compute deductions
      const halfSETaxDeduction = computeHalfSETaxDeduction(totalSETax);
      const qbiDeduction = computeQbiDeduction(
        netProfit,
        qbiPercentage,
        qbiEligible
      );

      // Step 5: Compute AGI and taxable income
      const adjustedGrossIncome =
        netProfit +
        w2Wages -
        halfSETaxDeduction -
        retirementContributions -
        healthInsurancePremiums -
        homeOfficeDeduction -
        otherDeductions;
      const taxableIncome = Math.max(
        0,
        adjustedGrossIncome - qbiDeduction - 14600
      ); // Simplified standard deduction

      // Step 6: Estimate federal income tax
      const federalIncomeTax = estimateFederalIncomeTax(
        taxableIncome,
        filingStatus
      );

      // Step 7: Calculate total tax and estimates
      const totalTaxDue = totalSETax + federalIncomeTax.total;
      const totalWithholding = w2Withholding;
      const netTaxDue = totalTaxDue - totalWithholding;
      const quarterlyEstimate = suggestQuarterlyPayments(netTaxDue);

      // Step 8: Calculate effective rates
      const effectiveSERate =
        netProfit > 0 ? (totalSETax / netProfit) * 100 : 0;
      const effectiveTotalRate =
        netProfit + w2Wages > 0
          ? (totalTaxDue / (netProfit + w2Wages)) * 100
          : 0;

      // Format results
      const formattedResults = {
        // Input summary
        grossReceipts: formatCurrency(grossReceipts),
        businessExpenses: formatCurrency(businessExpenses),
        netProfit: formatCurrency(netProfit),
        w2Wages: formatCurrency(w2Wages),
        belowThreshold,

        // SE Tax calculations
        seBase: formatCurrency(seBase),
        socialSecurity: {
          taxableAmount: formatCurrency(socialSecurity.taxableAmount),
          tax: formatCurrency(socialSecurity.tax),
          cappedAtWageBase: socialSecurity.cappedAtWageBase,
        },
        medicare: {
          regular: formatCurrency(medicare.regular),
          additional: formatCurrency(medicare.additional),
          total: formatCurrency(medicare.total),
          exceedsThreshold: medicare.exceedsThreshold,
          threshold: formatCurrency(medicare.threshold),
        },
        totalSETax: formatCurrency(totalSETax),

        // Deductions
        halfSETaxDeduction: formatCurrency(halfSETaxDeduction),
        qbiDeduction: formatCurrency(qbiDeduction),
        retirementContributions: formatCurrency(retirementContributions),
        healthInsurancePremiums: formatCurrency(healthInsurancePremiums),
        homeOfficeDeduction: formatCurrency(homeOfficeDeduction),

        // Income calculations
        adjustedGrossIncome: formatCurrency(adjustedGrossIncome),
        taxableIncome: formatCurrency(taxableIncome),
        federalIncomeTax: formatCurrency(federalIncomeTax.total),
        federalTaxBreakdown: federalIncomeTax.breakdown,

        // Final calculations
        totalTaxDue: formatCurrency(totalTaxDue),
        totalWithholding: formatCurrency(totalWithholding),
        netTaxDue: formatCurrency(netTaxDue),
        quarterlyEstimate: formatCurrency(quarterlyEstimate),

        // Rates
        effectiveSERate: effectiveSERate.toFixed(2) + "%",
        effectiveTotalRate: effectiveTotalRate.toFixed(2) + "%",

        // Raw values for calculations
        netTaxDueValue: netTaxDue,
        totalTaxDueValue: totalTaxDue,
      };

      setResults(formattedResults);
      setIsCalculating(false);
    }, 300);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    grossReceipts,
    businessExpenses,
    netProfitOverride,
    filingStatus,
    w2Wages,
    w2Withholding,
    qbiEligible,
    qbiPercentage,
    retirementContributions,
    healthInsurancePremiums,
    homeOfficeDeduction,
    otherDeductions,
    taxYear,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
        title="US Self-Employment Tax Calculator - Schedule SE & Income Tax Estimator (2025)"
        description="Calculate self-employment tax, Social Security, Medicare, QBI deduction, and federal income tax for freelancers and sole proprietors. Based on IRS Schedule SE."
        imageName="us-self-employment-tax-calculator"
        featureList={[
          "US self-employment tax calculator 2025",
          "Schedule SE tax calculator",
          "Freelancer tax estimator",
          "QBI deduction calculator",
          "Self-employed quarterly tax payments",
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
              US Self-Employment Tax Calculator
              <span className="block text-lg font-normal text-muted-foreground mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      Schedule SE & Income Tax Estimator 🇺🇸
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Calculate SE tax (15.3%) plus federal income tax for
                        2025
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
                    Business Income & Deductions
                  </CardTitle>
                  <CardDescription>
                    Enter your self-employment income and deductions to
                    calculate federal taxes for 2025.
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
                    <Tabs defaultValue="income" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="deductions">Deductions</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="income" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Gross Receipts */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="grossReceipts"
                              className="flex items-center gap-1"
                            >
                              Gross Business Receipts ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Total income from your business before
                                      expenses
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="grossReceipts"
                              value={grossReceipts}
                              onChange={(e) =>
                                setGrossReceipts(Number(e.target.value))
                              }
                              min="0"
                              step="1000"
                              required
                            />
                          </div>

                          {/* Business Expenses */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="businessExpenses"
                              className="flex items-center gap-1"
                            >
                              Deductible Business Expenses ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Ordinary and necessary business expenses
                                      (Schedule C)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="businessExpenses"
                              value={businessExpenses}
                              onChange={(e) =>
                                setBusinessExpenses(Number(e.target.value))
                              }
                              min="0"
                              step="1000"
                            />
                          </div>

                          {/* W-2 Wages */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="w2Wages"
                              className="flex items-center gap-1"
                            >
                              W-2 Wages (if any) ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Employee wages for Social Security wage
                                      base calculation
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="w2Wages"
                              value={w2Wages}
                              onChange={(e) =>
                                setW2Wages(Number(e.target.value))
                              }
                              min="0"
                              step="1000"
                            />
                          </div>

                          {/* W-2 Withholding */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="w2Withholding"
                              className="flex items-center gap-1"
                            >
                              Federal Tax Withheld ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Federal income tax withheld from W-2 or
                                      estimated payments
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="w2Withholding"
                              value={w2Withholding}
                              onChange={(e) =>
                                setW2Withholding(Number(e.target.value))
                              }
                              min="0"
                              step="100"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="deductions"
                        className="space-y-6 mt-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Retirement Contributions */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="retirementContributions"
                              className="flex items-center gap-1"
                            >
                              Retirement Contributions ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      SEP-IRA, Solo 401(k), or traditional IRA
                                      contributions
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="retirementContributions"
                              value={retirementContributions}
                              onChange={(e) =>
                                setRetirementContributions(
                                  Number(e.target.value)
                                )
                              }
                              min="0"
                              step="500"
                            />
                          </div>

                          {/* Health Insurance */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="healthInsurance"
                              className="flex items-center gap-1"
                            >
                              Health Insurance Premiums ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Self-employed health insurance deduction
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="healthInsurance"
                              value={healthInsurancePremiums}
                              onChange={(e) =>
                                setHealthInsurancePremiums(
                                  Number(e.target.value)
                                )
                              }
                              min="0"
                              step="100"
                            />
                          </div>

                          {/* Home Office */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="homeOffice"
                              className="flex items-center gap-1"
                            >
                              Home Office Deduction ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Form 8829 home office deduction or
                                      simplified method
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="homeOffice"
                              value={homeOfficeDeduction}
                              onChange={(e) =>
                                setHomeOfficeDeduction(Number(e.target.value))
                              }
                              min="0"
                              step="100"
                            />
                          </div>

                          {/* Other Deductions */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="otherDeductions"
                              className="flex items-center gap-1"
                            >
                              Other Above-the-Line Deductions ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Other Schedule 1 adjustments to income
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="otherDeductions"
                              value={otherDeductions}
                              onChange={(e) =>
                                setOtherDeductions(Number(e.target.value))
                              }
                              min="0"
                              step="100"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="settings" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Filing Status */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="filingStatus"
                              className="text-sm font-medium"
                            >
                              Filing Status
                            </Label>
                            <Select
                              value={filingStatus}
                              onValueChange={setFilingStatus}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married-filing-jointly">
                                  Married Filing Jointly
                                </SelectItem>
                                <SelectItem value="married-filing-separately">
                                  Married Filing Separately
                                </SelectItem>
                                <SelectItem value="head-of-household">
                                  Head of Household
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* QBI Eligible */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="qbiEligible"
                              className="flex items-center gap-1 text-sm font-medium"
                            >
                              QBI Deduction Eligible
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      20% qualified business income deduction
                                      (Section 199A)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <div className="flex items-center gap-2 pt-0.5">
                              <Switch
                                id="qbiEligible"
                                checked={qbiEligible}
                                onCheckedChange={setQbiEligible}
                              />
                              <Label
                                htmlFor="qbiEligible"
                                className="cursor-pointer"
                              >
                                {qbiEligible
                                  ? "Yes, eligible"
                                  : "No, not eligible"}
                              </Label>
                            </div>
                          </div>

                          {/* QBI Percentage */}
                          {qbiEligible && (
                            <div className="space-y-2">
                              <Label
                                htmlFor="qbiPercentage"
                                className="flex items-center gap-1"
                              >
                                QBI Deduction Percentage (%)
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Usually 20%, but may be limited by
                                        income or W-2 wages
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                              <Input
                                type="number"
                                id="qbiPercentage"
                                value={qbiPercentage}
                                onChange={(e) =>
                                  setQbiPercentage(Number(e.target.value))
                                }
                                min="0"
                                max="20"
                                step="1"
                              />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-center pt-4">
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

            {/* Results Section */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Warning for low profit */}
                {results.belowThreshold && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>No SE Tax Required:</strong> Net profit under $400
                      - no Schedule SE filing required. You may still owe income
                      tax on the profit.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Tax Calculation Results
                    </CardTitle>
                    <CardDescription>
                      Your estimated self-employment and federal income tax for
                      2025.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="se-tax">SE Tax</TabsTrigger>
                        <TabsTrigger value="income-tax">Income Tax</TabsTrigger>
                        <TabsTrigger value="payments">Payments</TabsTrigger>
                      </TabsList>

                      {/* Summary Tab */}
                      <TabsContent value="summary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Income Summary
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Receipts:"
                                value={results.grossReceipts}
                              />
                              <ResultItem
                                label="Business Expenses:"
                                value={`-${results.businessExpenses}`}
                              />
                              <ResultItem
                                label="Net Business Profit:"
                                value={results.netProfit}
                                highlight
                              />
                              <ResultItem
                                label="SE Tax Base (92.35%):"
                                value={results.seBase}
                                info="Net profit × 0.9235 (IRS Schedule SE multiplier)"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Tax Summary
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Self-Employment Tax:"
                                value={results.totalSETax}
                                info="15.3% on SE base (12.4% SS + 2.9% Medicare + additional Medicare)"
                              />
                              <ResultItem
                                label="Federal Income Tax:"
                                value={results.federalIncomeTax}
                                info="Progressive tax on taxable income (estimate)"
                              />
                              <ResultItem
                                label="Total Tax Due:"
                                value={results.totalTaxDue}
                                highlight
                              />
                              <ResultItem
                                label="Net Amount Due:"
                                value={results.netTaxDue}
                                highlight
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="p-4">
                            <div className="text-sm text-muted-foreground">
                              Effective SE Tax Rate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.effectiveSERate}
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm text-muted-foreground">
                              Total Effective Rate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.effectiveTotalRate}
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm text-muted-foreground">
                              Quarterly Estimate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.quarterlyEstimate}
                            </div>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* SE Tax Tab */}
                      <TabsContent value="se-tax">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Self-Employment Tax Breakdown
                          </h3>

                          <div className="space-y-4">
                            <ResultItem
                              label="SE Tax Base:"
                              value={results.seBase}
                              info="Net profit × 92.35% (IRS multiplier)"
                            />

                            <div className="pl-4 border-l-2 border-muted space-y-3">
                              <ResultItem
                                label="Social Security (12.4%):"
                                value={results.socialSecurity.tax}
                                info={`Taxable: ${
                                  results.socialSecurity.taxableAmount
                                } ${
                                  results.socialSecurity.cappedAtWageBase
                                    ? "(capped at wage base)"
                                    : ""
                                }`}
                              />
                              <ResultItem
                                label="Medicare (2.9%):"
                                value={results.medicare.regular}
                                info="No cap on Medicare tax"
                              />
                              {results.medicare.exceedsThreshold && (
                                <ResultItem
                                  label="Additional Medicare (0.9%):"
                                  value={results.medicare.additional}
                                  info={`Applies on income over ${results.medicare.threshold}`}
                                  badge="High Income"
                                />
                              )}
                            </div>

                            <ResultItem
                              label="Total SE Tax:"
                              value={results.totalSETax}
                              highlight
                            />

                            <ResultItem
                              label="Half SE Tax Deduction:"
                              value={results.halfSETaxDeduction}
                              info="50% of SE tax reduces your AGI (above-the-line deduction)"
                              badge="Deduction"
                            />
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                              IRS Schedule SE Reference
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              Self-employment tax = 15.3% on 92.35% of net
                              profit
                              <br />
                              Social Security: 12.4% up to $
                              {TAX_CONSTANTS.SS_WAGE_BASE_2025.toLocaleString()}{" "}
                              (2025 wage base)
                              <br />
                              Medicare: 2.9% (no limit) + 0.9% additional on
                              high income
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Income Tax Tab */}
                      <TabsContent value="income-tax">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Federal Income Tax Calculation
                          </h3>

                          <div className="space-y-3">
                            <ResultItem
                              label="Net Business Profit:"
                              value={results.netProfit}
                            />
                            <ResultItem
                              label="W-2 Wages:"
                              value={results.w2Wages}
                            />
                            <ResultItem
                              label="Half SE Tax Deduction:"
                              value={`-${results.halfSETaxDeduction}`}
                            />
                            <ResultItem
                              label="Retirement Contributions:"
                              value={`-${results.retirementContributions}`}
                            />
                            <ResultItem
                              label="Health Insurance:"
                              value={`-${results.healthInsurancePremiums}`}
                            />
                            <ResultItem
                              label="Home Office Deduction:"
                              value={`-${results.homeOfficeDeduction}`}
                            />
                            <Separator />
                            <ResultItem
                              label="Adjusted Gross Income:"
                              value={results.adjustedGrossIncome}
                              highlight
                            />
                            <ResultItem
                              label="QBI Deduction:"
                              value={`-${results.qbiDeduction}`}
                              info="20% qualified business income deduction (simplified)"
                              badge="Section 199A"
                            />
                            <ResultItem
                              label="Standard Deduction:"
                              value="-$14,600"
                              info="2025 standard deduction estimate"
                            />
                            <Separator />
                            <ResultItem
                              label="Taxable Income:"
                              value={results.taxableIncome}
                              highlight
                            />
                            <ResultItem
                              label="Federal Income Tax:"
                              value={results.federalIncomeTax}
                              highlight
                            />
                          </div>

                          {/* Tax Brackets */}
                          {results.federalTaxBreakdown &&
                            results.federalTaxBreakdown.length > 0 && (
                              <div className="mt-6">
                                <h4 className="font-medium mb-3">
                                  Tax Bracket Breakdown
                                </h4>
                                <div className="space-y-2">
                                  {results.federalTaxBreakdown.map(
                                    (bracket, index) => (
                                      <div
                                        key={index}
                                        className="p-3 border rounded text-sm"
                                      >
                                        <div className="flex justify-between items-center">
                                          <span>
                                            {formatCurrency(bracket.min)} -{" "}
                                            {bracket.max === "∞"
                                              ? "∞"
                                              : formatCurrency(bracket.max)}
                                          </span>
                                          <span className="font-medium">
                                            {(bracket.rate * 100).toFixed(0)}%
                                          </span>
                                        </div>
                                        <div className="text-muted-foreground mt-1">
                                          {formatCurrency(
                                            bracket.taxableAmount
                                          )}{" "}
                                          × {(bracket.rate * 100).toFixed(0)}% ={" "}
                                          {formatCurrency(bracket.tax)}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </TabsContent>

                      {/* Payments Tab */}
                      <TabsContent value="payments">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Tax Payments & Estimates
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="font-medium">Tax Liability</h4>
                              <ResultItem
                                label="Self-Employment Tax:"
                                value={results.totalSETax}
                              />
                              <ResultItem
                                label="Federal Income Tax:"
                                value={results.federalIncomeTax}
                              />
                              <ResultItem
                                label="Total Tax Due:"
                                value={results.totalTaxDue}
                                highlight
                              />
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-medium">
                                Payments & Balance
                              </h4>
                              <ResultItem
                                label="Federal Tax Withheld:"
                                value={results.totalWithholding}
                              />
                              <ResultItem
                                label={
                                  results.netTaxDueValue >= 0
                                    ? "Balance Due:"
                                    : "Refund Expected:"
                                }
                                value={results.netTaxDue}
                                highlight
                                badge={
                                  results.netTaxDueValue >= 0
                                    ? "Payment Due"
                                    : "Refund"
                                }
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h4 className="font-medium">
                              Quarterly Estimated Tax Payments
                            </h4>
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-amber-600" />
                                <span className="font-medium text-amber-800 dark:text-amber-200">
                                  Suggested Quarterly Payment
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                                {results.quarterlyEstimate}
                              </div>
                              <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                                {results.quarterlyEstimate === "$0"
                                  ? "No estimated payments required (tax due ≤ $1,000)"
                                  : "Pay quarterly using Form 1040ES to avoid penalties"}
                              </p>
                            </div>

                            {results.quarterlyEstimate !== "$0" && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Due dates for 2025:</strong> Q1: Jan 15,
                                Q2: Apr 15, Q3: Jun 16, Q4: Sep 15
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>

                  <CardFooter className="flex flex-col text-xs text-muted-foreground gap-2 pt-4">
                    <span>
                      Last updated:{" "}
                      <span className="font-medium">2025-10-31</span> | Based on
                      2025 IRS tax rules
                    </span>
                    <span>
                      <strong>Disclaimer:</strong> This is an estimate only —
                      consult IRS or tax professional for exact filing
                      obligations. QBI limitations not fully modeled. State and
                      local taxes not included.
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
            Understanding US Self-Employment Tax (2025)
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              What is Self-Employment Tax?
            </h3>
            <p className="text-muted-foreground">
              Self-employment tax is a tax consisting of Social Security and
              Medicare taxes for individuals who work for themselves. It's
              similar to the Social Security and Medicare taxes withheld from
              the pay of most wage earners.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Rate:</strong> 15.3% total (12.4% Social Security + 2.9%
                Medicare)
              </li>
              <li>
                <strong>Base:</strong> Applied to 92.35% of net self-employment
                earnings
              </li>
              <li>
                <strong>Minimum:</strong> Generally due if net earnings ≥ $400
              </li>
              <li>
                <strong>Social Security cap:</strong> 12.4% applies up to
                $176,100 (2025)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Key Deductions for Self-Employed
            </h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Half SE Tax:</strong> Deduct 50% of self-employment tax
                as an adjustment to income
              </li>
              <li>
                <strong>QBI Deduction:</strong> Up to 20% of qualified business
                income (Section 199A)
              </li>
              <li>
                <strong>Retirement:</strong> SEP-IRA, Solo 401(k), or
                traditional IRA contributions
              </li>
              <li>
                <strong>Health Insurance:</strong> Self-employed health
                insurance premiums
              </li>
              <li>
                <strong>Home Office:</strong> Business use of home deduction
                (Form 8829)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Quarterly Estimated Payments
            </h3>
            <p className="text-muted-foreground">
              Self-employed individuals typically must make quarterly estimated
              tax payments if they expect to owe $1,000 or more when filing
              their return.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Form 1040ES:</strong> Use to calculate and pay estimated
                taxes
              </li>
              <li>
                <strong>Safe harbor:</strong> Pay 100% of last year's tax (110%
                if AGI &gt; $150,000)
              </li>
              <li>
                <strong>Due dates:</strong> January 15, April 15, June 16,
                September 15
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Important Tax Forms</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Schedule C:</strong> Profit or Loss from Business
              </li>
              <li>
                <strong>Schedule SE:</strong> Self-Employment Tax
              </li>
              <li>
                <strong>Form 8995:</strong> Qualified Business Income Deduction
              </li>
              <li>
                <strong>Form 1040ES:</strong> Estimated Tax for Individuals
              </li>
              <li>
                <strong>Form 8829:</strong> Expenses for Business Use of Your
                Home
              </li>
            </ul>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">
              Official IRS Resources
            </h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <a
                  href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  IRS Topic 554 - Self-Employment Tax{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.irs.gov/instructions/i1040sse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Instructions for Schedule SE{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.irs.gov/publications/p334"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Publication 334 - Tax Guide for Small Business{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.irs.gov/newsroom/qualified-business-income-deduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  QBI Deduction Information <ExternalLink className="h-3 w-3" />
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
 * Example 1: Typical freelancer
 * - Receipts: $80,000, Expenses: $20,000, Net: $60,000
 * - SE Base: $55,410, SE Tax: $8,478 (15.3%)
 * - Half SE deduction: $4,239, QBI: $11,034 (20%)
 * - Estimated total tax: ~$15,000-$18,000
 *
 * Example 2: High earner with W-2 wages
 * - W-2 wages: $120,000, SE profit: $80,000
 * - SS tax limited due to W-2 wages already at base
 * - Additional Medicare applies on total income > $200k
 *
 * Example 3: Low profit (under $400)
 * - Net profit: $300 → No SE tax due
 * - May still owe income tax on the $300 profit
 */
