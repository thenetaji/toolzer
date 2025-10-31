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
import { ExternalLink, Calculator, AlertCircle, Info } from "lucide-react";
import Head from "@/components/Head";

/**
 * Spain Property Capital Gains Tax Calculator for Non-Residents
 *
 * Calculates capital gains tax owed by non-residents when selling property in Spain
 *
 * Tax Rules (2025):
 * - EU/EEA residents: 19% on capital gains
 * - Non-EU/EEA residents: 24% on capital gains
 * - 3% withholding at sale (buyer withholds from sale price)
 * - Capital gain = selling price - purchase price - deductible expenses
 *
 * Sources: Agencia Tributaria, Spain Property Guide (gov.uk), Expatica Spain 2025
 */
export default function SpainPropertyCapitalGainsEstimator() {
  // Theme state
  const { theme, setTheme } = useTheme();

  // Form input states
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [sellingPrice, setSellingPrice] = useState(300000);
  const [deductibleExpenses, setDeductibleExpenses] = useState(5000);
  const [residencyStatus, setResidencyStatus] = useState("EU"); // "EU" or "Non-EU"
  const [withholdingPaid, setWithholdingPaid] = useState(true);
  const [purchaseYear, setPurchaseYear] = useState(2020);

  // Results state
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  /**
   * Calculate capital gain
   * Formula: selling price - purchase price - deductible expenses
   */
  const calculateCapitalGain = (selling, purchase, expenses) => {
    return selling - purchase - expenses;
  };

  /**
   * Get tax rate based on residency status
   * EU/EEA residents: 19%
   * Non-EU/EEA residents: 24%
   */
  const calculateTaxRate = (residency) => {
    return residency === "EU" ? 0.19 : 0.24;
  };

  /**
   * Calculate net tax payable after withholding
   * Formula: (capital gain × tax rate) - (3% withholding if paid)
   */
  const calculateNetTax = (
    capitalGain,
    taxRate,
    sellingPrice,
    withholdingPaid
  ) => {
    const grossTax = capitalGain > 0 ? capitalGain * taxRate : 0;
    const withholdingAmount = sellingPrice * 0.03;
    const withholdingDeduction = withholdingPaid ? withholdingAmount : 0;

    return {
      grossTax,
      withholdingAmount,
      netTax: grossTax - withholdingDeduction,
    };
  };

  /**
   * Validate inputs
   */
  const validateInputs = () => {
    const errors = [];

    if (purchasePrice <= 0) {
      errors.push("Purchase price must be greater than 0");
    }

    if (sellingPrice <= 0) {
      errors.push("Selling price must be greater than 0");
    }

    if (deductibleExpenses < 0) {
      errors.push("Deductible expenses cannot be negative");
    }

    if (deductibleExpenses > purchasePrice) {
      errors.push("Deductible expenses cannot exceed purchase price");
    }

    if (purchaseYear < 1900 || purchaseYear > new Date().getFullYear()) {
      errors.push("Please enter a valid purchase year");
    }

    return errors;
  };

  /**
   * Main calculation function
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
      // Calculate capital gain
      const capitalGain = calculateCapitalGain(
        sellingPrice,
        purchasePrice,
        deductibleExpenses
      );

      // Get tax rate
      const taxRate = calculateTaxRate(residencyStatus);

      // Calculate taxes
      const taxCalc = calculateNetTax(
        capitalGain,
        taxRate,
        sellingPrice,
        withholdingPaid
      );

      // Determine scenario
      let scenario = "taxable";
      let message = "";

      if (capitalGain <= 0) {
        scenario = "no-gain";
        message = "No capital gain - no tax due";
      } else if (taxCalc.netTax < 0) {
        scenario = "refund";
        message = "Potential refund scenario - withholding exceeds tax due";
      } else if (taxCalc.netTax === 0) {
        scenario = "settled";
        message = "Tax fully covered by withholding";
      } else {
        scenario = "payment-due";
        message = "Additional tax payment required";
      }

      // Calculate years held for informational purposes
      const yearsHeld = new Date().getFullYear() - purchaseYear;

      // Format results
      const formattedResults = {
        // Input summary
        purchasePrice: formatCurrency(purchasePrice),
        sellingPrice: formatCurrency(sellingPrice),
        deductibleExpenses: formatCurrency(deductibleExpenses),
        residencyStatus,
        withholdingPaid,
        yearsHeld,

        // Calculations
        capitalGain: formatCurrency(capitalGain),
        taxRate: (taxRate * 100).toFixed(0) + "%",
        taxRateDecimal: taxRate,
        grossTax: formatCurrency(taxCalc.grossTax),
        withholdingAmount: formatCurrency(taxCalc.withholdingAmount),
        netTax: formatCurrency(Math.abs(taxCalc.netTax)),
        netTaxValue: taxCalc.netTax,

        // Status
        scenario,
        message,
        hasGain: capitalGain > 0,

        // Effective rates for display
        effectiveTaxRate:
          capitalGain > 0
            ? ((taxCalc.grossTax / capitalGain) * 100).toFixed(1) + "%"
            : "0%",
        netEffectiveRate:
          capitalGain > 0
            ? ((Math.max(0, taxCalc.netTax) / capitalGain) * 100).toFixed(1) +
              "%"
            : "0%",
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
    purchasePrice,
    sellingPrice,
    deductibleExpenses,
    residencyStatus,
    withholdingPaid,
    purchaseYear,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
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

  // Scenario-based alert component
  const ScenarioAlert = ({ scenario, message, netTaxValue }) => {
    let variant = "default";
    let icon = <Calculator className="h-4 w-4" />;

    if (scenario === "no-gain") {
      variant = "default";
    } else if (scenario === "refund") {
      variant = "default";
      icon = <Info className="h-4 w-4" />;
    } else if (scenario === "payment-due") {
      variant = "destructive";
      icon = <AlertCircle className="h-4 w-4" />;
    }

    return (
      <Alert className="mb-4" variant={variant}>
        {icon}
        <AlertDescription>
          <strong>{message}</strong>
          {scenario === "refund" && (
            <span className="block text-sm mt-1">
              You may be entitled to a refund of{" "}
              {formatCurrency(Math.abs(netTaxValue))}
            </span>
          )}
          {scenario === "payment-due" && (
            <span className="block text-sm mt-1">
              You need to pay additional tax of {formatCurrency(netTaxValue)}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      <Head
        title="Spain Property Capital Gains Tax Calculator for Non-Residents (2025)"
        description="Calculate capital gains tax on Spanish property sales for non-residents. EU residents 19%, Non-EU 24%. Includes 3% withholding calculation and net tax due."
        imageName="spain-property-capital-gains-calculator"
        featureList={[
          "Spain property capital gains calculator",
          "Non-resident tax Spain calculator",
          "Spanish property tax estimator",
          "EU vs Non-EU tax rates Spain",
          "3% withholding tax calculator Spain",
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
              Spain Property Capital Gains Tax Calculator
              <span className="block text-lg font-normal text-muted-foreground mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      For Non-Residents 🇪🇸
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        EU residents: 19% tax rate
                        <br />
                        Non-EU residents: 24% tax rate
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
                    Property Sale Information
                  </CardTitle>
                  <CardDescription>
                    Enter details of your Spanish property sale to calculate
                    capital gains tax for 2025.
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
                      {/* Purchase Price */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="purchasePrice"
                          className="flex items-center gap-1"
                        >
                          Original Purchase Price (€)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  The amount you originally paid for the
                                  property
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="purchasePrice"
                          value={purchasePrice}
                          onChange={(e) =>
                            setPurchasePrice(Number(e.target.value))
                          }
                          min="0"
                          step="1000"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="sellingPrice"
                          className="flex items-center gap-1"
                        >
                          Current Selling Price (€)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The sale price agreed with the buyer</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="sellingPrice"
                          value={sellingPrice}
                          onChange={(e) =>
                            setSellingPrice(Number(e.target.value))
                          }
                          min="0"
                          step="1000"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Deductible Expenses */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="deductibleExpenses"
                          className="flex items-center gap-1"
                        >
                          Deductible Expenses (€)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Notary fees, agent commission, improvements,
                                  legal costs
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="deductibleExpenses"
                          value={deductibleExpenses}
                          onChange={(e) =>
                            setDeductibleExpenses(Number(e.target.value))
                          }
                          min="0"
                          step="500"
                          className="w-full"
                        />
                      </div>

                      {/* Residency Status */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="residencyStatus"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Your Residency Status
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  EU/EEA residents pay 19%, Non-EU residents pay
                                  24%
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
                            <SelectItem value="EU">
                              EU/EEA Resident (19% tax)
                            </SelectItem>
                            <SelectItem value="Non-EU">
                              Non-EU Resident (24% tax)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Purchase Year */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="purchaseYear"
                          className="flex items-center gap-1"
                        >
                          Year of Purchase
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Used for informational purposes and potential
                                  inflation adjustments
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="purchaseYear"
                          value={purchaseYear}
                          onChange={(e) =>
                            setPurchaseYear(Number(e.target.value))
                          }
                          min="1900"
                          max={new Date().getFullYear()}
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Withholding Paid */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="withholdingPaid"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          3% Withholding at Sale
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Buyer must withhold 3% of sale price and pay
                                  to Spanish tax authority
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex items-center h-10 gap-2 pt-0.5">
                          <Switch
                            id="withholdingPaid"
                            checked={withholdingPaid}
                            onCheckedChange={setWithholdingPaid}
                          />
                          <Label
                            htmlFor="withholdingPaid"
                            className="cursor-pointer"
                          >
                            {withholdingPaid
                              ? "Yes, buyer withheld 3%"
                              : "No, not withheld"}
                          </Label>
                        </div>
                      </div>
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
                      Capital Gains Tax Calculation
                    </CardTitle>
                    <CardDescription>
                      Your estimated capital gains tax liability for Spanish
                      property sale in 2025.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Scenario Alert */}
                    <ScenarioAlert
                      scenario={results.scenario}
                      message={results.message}
                      netTaxValue={results.netTaxValue}
                    />

                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="calculation">
                          Calculation
                        </TabsTrigger>
                        <TabsTrigger value="withholding">
                          Withholding
                        </TabsTrigger>
                        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                      </TabsList>

                      {/* Summary Tab */}
                      <TabsContent value="summary" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Property Details
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Purchase Price:"
                                value={results.purchasePrice}
                              />
                              <ResultItem
                                label="Selling Price:"
                                value={results.sellingPrice}
                              />
                              <ResultItem
                                label="Deductible Expenses:"
                                value={results.deductibleExpenses}
                              />
                              <ResultItem
                                label="Years Held:"
                                value={`${results.yearsHeld} years`}
                                info="Length of ownership period"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Tax Summary</h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Capital Gain:"
                                value={results.capitalGain}
                                highlight={results.hasGain}
                                badge={results.hasGain ? "Taxable" : "No Gain"}
                              />
                              <ResultItem
                                label="Tax Rate:"
                                value={results.taxRate}
                                badge={results.residencyStatus}
                              />
                              <ResultItem
                                label="Gross Tax Due:"
                                value={results.grossTax}
                              />
                              <ResultItem
                                label={
                                  results.netTaxValue >= 0
                                    ? "Additional Tax Due:"
                                    : "Potential Refund:"
                                }
                                value={results.netTax}
                                highlight
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
                              label="1. Selling Price:"
                              value={results.sellingPrice}
                            />
                            <ResultItem
                              label="2. Purchase Price:"
                              value={`- ${results.purchasePrice}`}
                            />
                            <ResultItem
                              label="3. Deductible Expenses:"
                              value={`- ${results.deductibleExpenses}`}
                            />
                            <Separator className="my-3" />
                            <ResultItem
                              label="4. Capital Gain (1-2-3):"
                              value={results.capitalGain}
                              highlight
                            />
                            <ResultItem
                              label={`5. Tax Rate (${results.residencyStatus}):`}
                              value={results.taxRate}
                            />
                            <ResultItem
                              label="6. Gross Tax (4 × 5):"
                              value={results.grossTax}
                              highlight
                            />
                          </div>

                          {results.hasGain && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Formula:</strong> Capital Gain ={" "}
                                {results.sellingPrice} - {results.purchasePrice}{" "}
                                - {results.deductibleExpenses} ={" "}
                                {results.capitalGain}
                                <br />
                                <strong>Tax:</strong> {results.capitalGain} ×{" "}
                                {results.taxRate} = {results.grossTax}
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Withholding Tab */}
                      <TabsContent
                        value="withholding"
                        className="pt-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            3% Withholding Tax
                          </h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="Sale Price:"
                              value={results.sellingPrice}
                            />
                            <ResultItem
                              label="Withholding Rate:"
                              value="3%"
                              info="Mandatory withholding by buyer at time of sale"
                            />
                            <ResultItem
                              label="Withholding Amount:"
                              value={results.withholdingAmount}
                              highlight
                            />
                            <ResultItem
                              label="Withholding Status:"
                              value={
                                results.withholdingPaid
                                  ? "✅ Paid"
                                  : "❌ Not Paid"
                              }
                              badge={
                                results.withholdingPaid
                                  ? "Compliant"
                                  : "Action Needed"
                              }
                            />
                          </div>

                          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                              Important: 3% Withholding Rule
                            </h4>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              The buyer is legally required to withhold 3% of
                              the sale price and pay it directly to the Spanish
                              tax authority (Agencia Tributaria). This is done
                              to ensure tax compliance by non-resident sellers.
                              You can later claim a refund if this amount
                              exceeds your actual tax liability.
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Breakdown Tab */}
                      <TabsContent value="breakdown" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Final Tax Calculation
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Gross Capital Gains Tax:"
                                value={results.grossTax}
                              />
                              <ResultItem
                                label="Less: 3% Withholding:"
                                value={
                                  results.withholdingPaid
                                    ? `- ${results.withholdingAmount}`
                                    : "€0"
                                }
                              />
                              <Separator className="my-3" />
                              <ResultItem
                                label="Net Amount:"
                                value={results.netTax}
                                highlight
                                badge={
                                  results.netTaxValue >= 0 ? "Due" : "Refund"
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Effective Rates
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Statutory Rate:"
                                value={results.taxRate}
                                info={`Official rate for ${results.residencyStatus} residents`}
                              />
                              <ResultItem
                                label="Effective Rate on Gain:"
                                value={results.effectiveTaxRate}
                                info="Gross tax as % of capital gain"
                              />
                              <ResultItem
                                label="Net Effective Rate:"
                                value={results.netEffectiveRate}
                                info="Net tax (after withholding) as % of capital gain"
                                highlight
                              />
                            </div>
                          </div>
                        </div>

                        {!results.hasGain && (
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>No Capital Gain:</strong> Since your
                              selling price (after expenses) does not exceed
                              your purchase price, there is no taxable capital
                              gain. However, you may still need to file a tax
                              return to claim any withholding refund.
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
                      2025 Spanish tax regulations
                    </span>
                    <span>
                      <strong>Disclaimer:</strong> Approximate estimator for
                      informational use only. Verify rates and eligibility with
                      Agencia Tributaria or a tax professional.
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
            Spain Capital Gains Tax for Non-Residents (2025)
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Tax Rates</h3>
            <p className="text-muted-foreground">
              Non-residents pay capital gains tax on Spanish property sales at
              different rates depending on their residency status:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>EU/EEA residents:</strong> 19% on capital gains
              </li>
              <li>
                <strong>Non-EU/EEA residents:</strong> 24% on capital gains
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Capital Gain Calculation
            </h3>
            <p className="text-muted-foreground">
              Your taxable capital gain is calculated as:
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              Capital Gain = Selling Price - Purchase Price - Deductible
              Expenses
            </div>
            <p className="text-muted-foreground">
              Deductible expenses may include notary fees, real estate agent
              commissions, legal costs, property improvements, and other
              legitimate selling costs.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">3% Withholding Tax</h3>
            <p className="text-muted-foreground">
              When you sell Spanish property as a non-resident, the buyer is
              legally required to:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>Withhold 3% of the total sale price</li>
              <li>
                Pay this amount directly to the Spanish tax authority (Agencia
                Tributaria)
              </li>
              <li>Provide you with proof of payment</li>
            </ul>
            <p className="text-muted-foreground">
              This withholding acts as a prepayment of your capital gains tax.
              If it exceeds your actual tax liability, you can claim a refund by
              filing the appropriate tax return.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Payment and Filing</h3>
            <p className="text-muted-foreground">
              You must file Form 210 with the Spanish tax authority within one
              month of the sale if:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>You owe additional tax beyond the 3% withholding</li>
              <li>You want to claim a refund of excess withholding</li>
              <li>The sale resulted in a capital loss you want to declare</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Exemptions and Special Cases
            </h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Principal residence exemption:</strong> Generally not
                available to non-residents
              </li>
              <li>
                <strong>EU reinvestment relief:</strong> EU residents may
                qualify for partial exemption if reinvesting in another EU
                property
              </li>
              <li>
                <strong>Tax treaties:</strong> Double taxation treaties may
                affect your liability - consult a professional
              </li>
            </ul>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">
              Official Sources & Professional Advice
            </h3>
            <p className="text-muted-foreground">
              For official information and professional guidance:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <a
                  href="https://www.agenciatributaria.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Agencia Tributaria (Spanish Tax Authority){" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/guidance/capital-gains-tax-when-you-sell-a-property-in-spain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  UK Gov Spain Property Guide{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Always consult a qualified Spanish tax advisor for your specific
                situation
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
 * Example 1: EU resident, profitable sale
 * - Purchase: €200,000, Sale: €300,000, Expenses: €5,000
 * - Capital Gain: €95,000
 * - Tax (19%): €18,050
 * - Withholding (3%): €9,000
 * - Net payable: €9,050
 *
 * Example 2: Non-EU resident, profitable sale
 * - Purchase: €400,000, Sale: €500,000, Expenses: €0
 * - Capital Gain: €100,000
 * - Tax (24%): €24,000
 * - Withholding (3%): €15,000
 * - Net payable: €9,000
 *
 * Example 3: EU resident, no gain
 * - Purchase: €300,000, Sale: €280,000, Expenses: €5,000
 * - Capital Gain: -€25,000 (loss)
 * - Tax: €0 (no gain = no tax)
 * - Withholding: €8,400 (3% of €280,000)
 * - Potential refund: €8,400
 */
