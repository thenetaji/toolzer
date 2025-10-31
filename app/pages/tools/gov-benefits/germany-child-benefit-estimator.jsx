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
import { Slider } from "@/components/ui/slider";
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
import Head from "@/components/Head";

/**
 * Germany Child Benefit & Parental Leave Estimator Component
 *
 * Calculates:
 * - Kindergeld (Child Benefit): €255 per child per month
 * - Elterngeld (Parental Leave Benefit): 65% of net income (€300-€1,800)
 *
 * Based on official 2025 German regulations
 */
export default function GermanyChildBenefitElterngeldEstimator() {
  // Theme state
  const { theme, setTheme } = useTheme();

  // Form input states
  const [numChildren, setNumChildren] = useState(1);
  const [parentNetIncome, setParentNetIncome] = useState(2000);
  const [otherParentNetIncome, setOtherParentNetIncome] = useState(0);
  const [hasOtherParent, setHasOtherParent] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState("employee");
  const [elterngeldType, setElterngeldType] = useState("basic"); // "basic" or "plus"
  const [desiredMonths, setDesiredMonths] = useState([12]); // Using array for slider
  const [otherParentMonths, setOtherParentMonths] = useState([2]); // Using array for slider

  // Results state
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Calculate Kindergeld (Child Benefit)
   * Formula: 255 EUR * number of children
   * Source: Bundesagentur für Arbeit
   */
  const calculateKindergeld = (numChildren) => {
    const KINDERGELD_PER_CHILD = 255;
    return KINDERGELD_PER_CHILD * numChildren;
  };

  /**
   * Calculate Elterngeld (Parental Leave Benefit)
   * Formula: min(1800, max(300, 0.65 * netIncome))
   * - Replacement rate: 65%
   * - Minimum: €300/month
   * - Maximum: €1,800/month
   * Source: BMFSFJ official site
   */
  const calculateElterngeld = (
    netIncome,
    variant = "basic",
    unemployed = false
  ) => {
    // If unemployed, only minimum amount
    if (unemployed || netIncome <= 0) {
      return {
        monthly: 300,
        replacementRate: 0,
        cappedAtMinimum: true,
        cappedAtMaximum: false,
      };
    }

    const REPLACEMENT_RATE = 0.65;
    const MIN_ELTERNGELD = 300;
    const MAX_ELTERNGELD = 1800;

    let monthlyAmount = Math.round(netIncome * REPLACEMENT_RATE);
    let cappedAtMinimum = false;
    let cappedAtMaximum = false;

    if (monthlyAmount < MIN_ELTERNGELD) {
      monthlyAmount = MIN_ELTERNGELD;
      cappedAtMinimum = true;
    } else if (monthlyAmount > MAX_ELTERNGELD) {
      monthlyAmount = MAX_ELTERNGELD;
      cappedAtMaximum = true;
    }

    // Elterngeld Plus: half the amount, double the duration
    if (variant === "plus") {
      monthlyAmount = Math.round(monthlyAmount / 2);
    }

    const actualReplacementRate =
      netIncome > 0 ? (monthlyAmount / netIncome) * 100 : 0;

    return {
      monthly: monthlyAmount,
      replacementRate: Math.round(actualReplacementRate * 100) / 100,
      cappedAtMinimum,
      cappedAtMaximum,
    };
  };

  /**
   * Main calculation function
   */
  const calculateBenefits = () => {
    setIsCalculating(true);

    // Small delay for animation
    setTimeout(() => {
      const isUnemployed = employmentStatus === "unemployed";

      // Calculate Kindergeld
      const monthlyKindergeld = calculateKindergeld(numChildren);
      const annualKindergeld = monthlyKindergeld * 12;

      // Calculate Elterngeld for main parent
      const elterngeldCalc = calculateElterngeld(
        parentNetIncome,
        elterngeldType,
        isUnemployed
      );

      // Calculate duration
      const maxTotalMonths = elterngeldType === "basic" ? 14 : 28;
      const thisParentMonths = desiredMonths[0];
      const otherParentElterngeldMonths = hasOtherParent
        ? otherParentMonths[0]
        : 0;
      const totalMonthsUsed = thisParentMonths + otherParentElterngeldMonths;

      // Calculate other parent's Elterngeld if applicable
      let otherParentElterngeld = null;
      if (hasOtherParent && otherParentNetIncome > 0) {
        otherParentElterngeld = calculateElterngeld(
          otherParentNetIncome,
          elterngeldType,
          false
        );
      }

      // Calculate totals
      const totalElterngeldThisParent =
        elterngeldCalc.monthly * thisParentMonths;
      const totalElterngeldOtherParent = otherParentElterngeld
        ? otherParentElterngeld.monthly * otherParentElterngeldMonths
        : 0;
      const combinedElterngeldTotal =
        totalElterngeldThisParent + totalElterngeldOtherParent;

      // Format results
      const formattedResults = {
        // Kindergeld
        monthlyKindergeld: formatCurrency(monthlyKindergeld),
        annualKindergeld: formatCurrency(annualKindergeld),

        // Elterngeld - Main Parent
        monthlyElterngeld: formatCurrency(elterngeldCalc.monthly),
        elterngeldDuration: thisParentMonths,
        totalElterngeld: formatCurrency(totalElterngeldThisParent),
        replacementRate: elterngeldCalc.replacementRate,
        cappedAtMinimum: elterngeldCalc.cappedAtMinimum,
        cappedAtMaximum: elterngeldCalc.cappedAtMaximum,

        // Other Parent (if applicable)
        hasOtherParent,
        otherParentElterngeld: otherParentElterngeld
          ? {
              monthly: formatCurrency(otherParentElterngeld.monthly),
              duration: otherParentElterngeldMonths,
              total: formatCurrency(totalElterngeldOtherParent),
              replacementRate: otherParentElterngeld.replacementRate,
            }
          : null,

        // Combined totals
        combinedElterngeldTotal: formatCurrency(combinedElterngeldTotal),
        totalMonthsUsed,
        maxTotalMonths,
        remainingMonths: Math.max(0, maxTotalMonths - totalMonthsUsed),

        // Meta info
        elterngeldType,
        isUnemployed,
        numChildren,
        parentNetIncome: formatCurrency(parentNetIncome),
        otherParentNetIncome: hasOtherParent
          ? formatCurrency(otherParentNetIncome)
          : null,
      };

      setResults(formattedResults);
      setIsCalculating(false);
    }, 300);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateBenefits();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    numChildren,
    parentNetIncome,
    otherParentNetIncome,
    hasOtherParent,
    employmentStatus,
    elterngeldType,
    desiredMonths,
    otherParentMonths,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBenefits();
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Result item component
  const ResultItem = ({ label, value, highlight = false, info = null }) => (
    <div
      className={`flex justify-between items-center py-2 border-b ${
        highlight ? "font-bold text-primary" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {info && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs text-muted-foreground cursor-help">
                  ℹ️
                </span>
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
        title="Germany Child Benefit & Parental Leave Calculator (2025)"
        description="Calculate Kindergeld (Child Benefit) and Elterngeld (Parental Leave Benefit) in Germany. Official 2025 rates and formulas."
        imageName="germany-child-benefit-calculator"
        featureList={[
          "Germany Kindergeld calculator",
          "Elterngeld parental leave calculator",
          "Child benefit estimator Germany",
          "Parental leave benefit calculator",
          "2025 German family benefits",
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
              Germany Child Benefit & Parental Leave Calculator
              <span className="block text-lg font-normal text-muted-foreground mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      Country: Germany 🇩🇪
                      <span className="text-xs">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Calculations based on official German regulations for
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
                  <CardTitle className="text-xl">Family Information</CardTitle>
                  <CardDescription>
                    Enter your family details to calculate Kindergeld and
                    Elterngeld benefits for 2025.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Number of Children */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="numChildren"
                          className="flex items-center gap-1"
                        >
                          Number of Eligible Children
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Children under 18 (or up to 25 if in
                                  education/training)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="numChildren"
                          value={numChildren}
                          onChange={(e) =>
                            setNumChildren(Math.max(1, Number(e.target.value)))
                          }
                          min="1"
                          max="10"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Parent Net Income */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="parentNetIncome"
                          className="flex items-center gap-1"
                        >
                          Your Net Monthly Income (EUR)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Net income before childbirth (after taxes &
                                  social contributions)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          id="parentNetIncome"
                          value={parentNetIncome}
                          onChange={(e) =>
                            setParentNetIncome(
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          min="0"
                          step="100"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Employment Status */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="employmentStatus"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Employment Status
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Unemployed parents receive minimum €300/month
                                  Elterngeld
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={employmentStatus}
                          onValueChange={setEmploymentStatus}
                        >
                          <SelectTrigger
                            id="employmentStatus"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="self-employed">
                              Self-employed
                            </SelectItem>
                            <SelectItem value="unemployed">
                              Unemployed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Elterngeld Type */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="elterngeldType"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Elterngeld Type
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Basic: Full amount for 14 months
                                  <br />
                                  Plus: Half amount for 28 months
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={elterngeldType}
                          onValueChange={setElterngeldType}
                        >
                          <SelectTrigger id="elterngeldType" className="w-full">
                            <SelectValue placeholder="Select Elterngeld type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              Basic Elterngeld
                            </SelectItem>
                            <SelectItem value="plus">
                              Elterngeld Plus
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Your Elterngeld Duration */}
                      <div className="space-y-3">
                        <Label className="flex items-center gap-1 text-sm font-medium">
                          Your Elterngeld Duration (Months)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  How many months you plan to take Elterngeld
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="space-y-2">
                          <Slider
                            value={desiredMonths}
                            onValueChange={setDesiredMonths}
                            max={elterngeldType === "basic" ? 12 : 24}
                            min={2}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-muted-foreground">
                            {desiredMonths[0]} month
                            {desiredMonths[0] !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {/* Other Parent Toggle */}
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="hasOtherParent"
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          Include Other Parent
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Calculate combined household benefits</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex items-center h-10 gap-2 pt-0.5">
                          <Switch
                            id="hasOtherParent"
                            checked={hasOtherParent}
                            onCheckedChange={setHasOtherParent}
                          />
                          <Label
                            htmlFor="hasOtherParent"
                            className="cursor-pointer"
                          >
                            {hasOtherParent ? "Yes" : "No"}
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Other Parent Details (conditional) */}
                    {hasOtherParent && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-muted/20 rounded-lg">
                        <div className="space-y-2">
                          <Label
                            htmlFor="otherParentNetIncome"
                            className="flex items-center gap-1"
                          >
                            Other Parent's Net Monthly Income (EUR)
                          </Label>
                          <Input
                            type="number"
                            id="otherParentNetIncome"
                            value={otherParentNetIncome}
                            onChange={(e) =>
                              setOtherParentNetIncome(
                                Math.max(0, Number(e.target.value))
                              )
                            }
                            min="0"
                            step="100"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="flex items-center gap-1 text-sm font-medium">
                            Other Parent's Elterngeld Duration (Months)
                          </Label>
                          <div className="space-y-2">
                            <Slider
                              value={otherParentMonths}
                              onValueChange={setOtherParentMonths}
                              max={elterngeldType === "basic" ? 12 : 24}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-muted-foreground">
                              {otherParentMonths[0]} month
                              {otherParentMonths[0] !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        disabled={isCalculating}
                        className="w-48"
                      >
                        {isCalculating ? "Calculating..." : "Estimate Benefits"}
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
                      Benefit Calculation Results
                    </CardTitle>
                    <CardDescription>
                      Your estimated Kindergeld and Elterngeld benefits based on
                      2025 German regulations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="kindergeld">Kindergeld</TabsTrigger>
                        <TabsTrigger value="elterngeld">Elterngeld</TabsTrigger>
                        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Monthly Benefits
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Kindergeld (Child Benefit):"
                                value={results.monthlyKindergeld}
                                highlight
                                info={`€255 per child × ${results.numChildren} children`}
                              />
                              <ResultItem
                                label="Your Elterngeld:"
                                value={results.monthlyElterngeld}
                                highlight
                                info={`${
                                  results.replacementRate
                                }% of net income ${
                                  results.cappedAtMinimum ? "(minimum)" : ""
                                } ${
                                  results.cappedAtMaximum ? "(maximum)" : ""
                                }`}
                              />
                              {results.hasOtherParent &&
                                results.otherParentElterngeld && (
                                  <ResultItem
                                    label="Other Parent's Elterngeld:"
                                    value={
                                      results.otherParentElterngeld.monthly
                                    }
                                    info={`${results.otherParentElterngeld.replacementRate}% of their net income`}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Duration & Totals
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Your Elterngeld Duration:"
                                value={`${results.elterngeldDuration} months`}
                              />
                              <ResultItem
                                label="Total Elterngeld (You):"
                                value={results.totalElterngeld}
                                highlight
                              />
                              {results.hasOtherParent && (
                                <ResultItem
                                  label="Combined Elterngeld Total:"
                                  value={results.combinedElterngeldTotal}
                                  highlight
                                />
                              )}
                              <ResultItem
                                label="Annual Kindergeld:"
                                value={results.annualKindergeld}
                                highlight
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Kindergeld Tab */}
                      <TabsContent
                        value="kindergeld"
                        className="pt-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Kindergeld (Child Benefit)
                          </h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="Rate per child:"
                              value="€255/month"
                              info="Fixed amount for all children in 2025"
                            />
                            <ResultItem
                              label="Number of children:"
                              value={results.numChildren.toString()}
                            />
                            <ResultItem
                              label="Monthly total:"
                              value={results.monthlyKindergeld}
                              highlight
                            />
                            <ResultItem
                              label="Annual total:"
                              value={results.annualKindergeld}
                              highlight
                            />
                          </div>

                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Formula:</strong> €255 ×{" "}
                              {results.numChildren} children ={" "}
                              {results.monthlyKindergeld} per month
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Elterngeld Tab */}
                      <TabsContent
                        value="elterngeld"
                        className="pt-2 space-y-6"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Elterngeld (Parental Leave Benefit)
                          </h3>
                          <div className="space-y-3">
                            <ResultItem
                              label="Your net income:"
                              value={results.parentNetIncome}
                            />
                            <ResultItem
                              label="Replacement rate:"
                              value={`${results.replacementRate}%`}
                              info="65% of net income, minimum €300, maximum €1,800"
                            />
                            <ResultItem
                              label="Monthly amount:"
                              value={results.monthlyElterngeld}
                              highlight
                            />
                            <ResultItem
                              label="Duration:"
                              value={`${results.elterngeldDuration} months`}
                            />
                            <ResultItem
                              label="Total benefit:"
                              value={results.totalElterngeld}
                              highlight
                            />
                          </div>

                          {results.isUnemployed && (
                            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <p className="text-sm text-orange-800 dark:text-orange-200">
                                <strong>Note:</strong> As unemployed, you
                                receive the minimum Elterngeld amount of
                                €300/month.
                              </p>
                            </div>
                          )}

                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>Formula:</strong> min(€1,800, max(€300,
                              0.65 ×{" "}
                              {results.parentNetIncome
                                .replace("€", "")
                                .replace(",", "")}
                              )) = {results.monthlyElterngeld}
                              {results.elterngeldType === "plus" && (
                                <>
                                  <br />
                                  <strong>Elterngeld Plus:</strong> Amount
                                  halved, duration doubled
                                </>
                              )}
                            </p>
                          </div>

                          {results.hasOtherParent &&
                            results.otherParentElterngeld && (
                              <div className="mt-6 border-t pt-4">
                                <h4 className="font-medium mb-3">
                                  Other Parent
                                </h4>
                                <div className="space-y-3">
                                  <ResultItem
                                    label="Net income:"
                                    value={results.otherParentNetIncome}
                                  />
                                  <ResultItem
                                    label="Monthly Elterngeld:"
                                    value={
                                      results.otherParentElterngeld.monthly
                                    }
                                  />
                                  <ResultItem
                                    label="Duration:"
                                    value={`${results.otherParentElterngeld.duration} months`}
                                  />
                                  <ResultItem
                                    label="Total benefit:"
                                    value={results.otherParentElterngeld.total}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      </TabsContent>

                      {/* Breakdown Tab */}
                      <TabsContent value="breakdown" className="pt-2 space-y-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">
                              Duration Overview
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label={`Maximum ${results.elterngeldType} months:`}
                                value={`${results.maxTotalMonths} months`}
                                info={
                                  results.elterngeldType === "basic"
                                    ? "14 months total for both parents"
                                    : "28 months total for both parents"
                                }
                              />
                              <ResultItem
                                label="Months used:"
                                value={`${results.totalMonthsUsed} months`}
                              />
                              <ResultItem
                                label="Remaining months:"
                                value={`${results.remainingMonths} months`}
                                highlight={results.remainingMonths > 0}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-4">
                              Total Family Benefits
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Annual Kindergeld:"
                                value={results.annualKindergeld}
                              />
                              <ResultItem
                                label="Your total Elterngeld:"
                                value={results.totalElterngeld}
                              />
                              {results.hasOtherParent &&
                                results.otherParentElterngeld && (
                                  <ResultItem
                                    label="Other parent's total:"
                                    value={results.otherParentElterngeld.total}
                                  />
                                )}
                              <Separator className="my-3" />
                              <ResultItem
                                label="Combined benefits total:"
                                value={formatCurrency(
                                  parseInt(
                                    results.annualKindergeld.replace(
                                      /[^\d.-]/g,
                                      ""
                                    )
                                  ) +
                                    parseInt(
                                      results.combinedElterngeldTotal.replace(
                                        /[^\d.-]/g,
                                        ""
                                      )
                                    )
                                )}
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
                      <span className="font-medium">2025-10-31</span> | Based on
                      2025 German regulations
                    </span>
                    <span>
                      <strong>Disclaimer:</strong> These are estimates only —
                      consult official sources for accuracy.
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
            Understanding German Child Benefits (2025)
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Kindergeld (Child Benefit)
            </h3>
            <p className="text-muted-foreground">
              Kindergeld is a monthly tax-free payment from the German
              government to support families with children. For 2025, the amount
              is <strong>€255 per child per month</strong>, regardless of income
              level.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>Paid until age 18 (or 25 if in education/training)</li>
              <li>No income limits or caps</li>
              <li>Automatic payment once registered</li>
              <li>Tax-free benefit</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Elterngeld (Parental Leave Benefit)
            </h3>
            <p className="text-muted-foreground">
              Elterngeld replaces part of your income when you take parental
              leave to care for your newborn. It's calculated as{" "}
              <strong>65% of your net income</strong> before the child's birth.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Minimum:</strong> €300 per month
              </li>
              <li>
                <strong>Maximum:</strong> €1,800 per month
              </li>
              <li>
                <strong>Duration:</strong> 14 months total (can be shared
                between parents)
              </li>
              <li>
                <strong>Single parents:</strong> Can take the full 14 months
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Elterngeld Plus</h3>
            <p className="text-muted-foreground">
              An alternative to basic Elterngeld that allows for longer, more
              flexible parental leave:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>Half the monthly amount of basic Elterngeld</li>
              <li>Double the duration (up to 28 months)</li>
              <li>Can be combined with part-time work</li>
              <li>More flexible for gradual return to work</li>
            </ul>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">Official Sources</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <a
                  href="https://www.arbeitsagentur.de/familie-und-kinder/kindergeld"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Bundesagentur für Arbeit - Kindergeld
                </a>
              </li>
              <li>
                <a
                  href="https://www.bmfsfj.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  BMFSFJ - Elterngeld Information
                </a>
              </li>
              <li>
                <a
                  href="https://www.bundesfinanzministerium.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Federal Ministry of Finance
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
