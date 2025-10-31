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
  Car,
  FileText,
  TrendingUp,
  Euro,
  MapPin,
} from "lucide-react";
import Head from "@/components/Head";

// 2025 Tax Constants for Germany Vehicle Import
const IMPORT_CONSTANTS = {
  // Customs duty for non-EU vehicles
  CUSTOMS_DUTY_RATE: 0.1, // 10%

  // German VAT rate
  VAT_RATE: 0.19, // 19%

  // Vehicle age/mileage thresholds for "new" vs "used"
  NEW_VEHICLE_MONTHS: 6, // Under 6 months = new
  NEW_VEHICLE_KM: 6000, // Under 6,000 km = new

  // Exemption requirements for relocation
  MIN_OWNERSHIP_MONTHS: 6, // Minimum ownership period abroad
  MIN_RESIDENCE_MONTHS: 12, // Minimum residence abroad

  // Additional costs (estimates)
  REGISTRATION_FEE_RANGE: { min: 26, max: 67 }, // €26-67
  INSPECTION_COST_RANGE: { min: 100, max: 200 }, // €100-200 for TÜV/inspection

  // Vehicle tax (Kfz-Steuer) - simplified rates per 100ccm for petrol
  KFZ_TAX_PETROL_PER_100CCM: 2.0, // €2 per 100ccm
  KFZ_TAX_DIESEL_PER_100CCM: 9.5, // €9.50 per 100ccm
  KFZ_TAX_CO2_RATE: 2.0, // €2 per g/km CO2 over 95g/km (WLTP)
};

/**
 * Germany Vehicle Import Tax Calculator (2025)
 *
 * Calculates import duties, VAT, and additional costs for importing vehicles to Germany:
 * - Non-EU imports: 10% customs duty + 19% VAT on total value
 * - EU imports: 19% VAT only if "new" vehicle (under 6 months or 6,000km)
 * - Exemptions for relocating residents with qualifying ownership/residence
 * - Additional registration fees and vehicle tax estimates
 *
 * Sources:
 * - German Customs (Zoll): https://www.zoll.de
 * - IamExpat Germany vehicle import guide
 * - Federal Motor Transport Authority (KBA)
 * - German VAT Act (UStG)
 */
export default function GermanyVehicleImportTaxCalculator() {
  // Form input states
  const [vehicleValue, setVehicleValue] = useState(25000);
  const [originCountry, setOriginCountry] = useState("non-eu");
  const [vehicleAge, setVehicleAge] = useState(24);
  const [vehicleMileage, setVehicleMileage] = useState(35000);
  const [shippingCost, setShippingCost] = useState(2000);
  const [insuranceCost, setInsuranceCost] = useState(500);
  const [isRelocating, setIsRelocating] = useState(false);
  const [ownershipMonths, setOwnershipMonths] = useState(24);
  const [residenceMonths, setResidenceMonths] = useState(36);
  const [engineSize, setEngineSize] = useState(2000);
  const [fuelType, setFuelType] = useState("petrol");
  const [co2Emissions, setCo2Emissions] = useState(120);
  const [includeAdditionalCosts, setIncludeAdditionalCosts] = useState(true);

  // Results state
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showDetailed, setShowDetailed] = useState(false);

  /**
   * Check if vehicle qualifies as "new" under German/EU rules
   */
  const isVehicleNew = (ageMonths, mileageKm) => {
    return (
      ageMonths < IMPORT_CONSTANTS.NEW_VEHICLE_MONTHS ||
      mileageKm < IMPORT_CONSTANTS.NEW_VEHICLE_KM
    );
  };

  /**
   * Check if qualifies for relocation exemption
   */
  const qualifiesForRelocationExemption = (
    isRelocating,
    ownershipMonths,
    residenceMonths
  ) => {
    return (
      isRelocating &&
      ownershipMonths >= IMPORT_CONSTANTS.MIN_OWNERSHIP_MONTHS &&
      residenceMonths >= IMPORT_CONSTANTS.MIN_RESIDENCE_MONTHS
    );
  };

  /**
   * Calculate customs duty (non-EU only)
   * Source: German Customs Authority (Zoll)
   */
  const calculateCustomsDuty = (vehicleValue, fromNonEU, exempt) => {
    if (!fromNonEU || exempt) return 0;
    return vehicleValue * IMPORT_CONSTANTS.CUSTOMS_DUTY_RATE;
  };

  /**
   * Calculate import VAT
   * Source: German VAT Act (UStG)
   */
  const calculateImportVAT = (
    vehicleValue,
    customsDuty,
    shippingCost,
    insuranceCost,
    fromEU,
    isNew,
    exempt
  ) => {
    // No VAT if exempt from relocation
    if (exempt) return 0;

    // For EU vehicles, only apply VAT if "new"
    if (fromEU && !isNew) return 0;

    // VAT base = vehicle value + customs duty + shipping + insurance
    const vatBase = vehicleValue + customsDuty + shippingCost + insuranceCost;
    return vatBase * IMPORT_CONSTANTS.VAT_RATE;
  };

  /**
   * Calculate German vehicle tax (Kfz-Steuer)
   * Source: Federal Motor Transport Authority (KBA)
   */
  const calculateVehicleTax = (engineSizeCcm, fuelType, co2Emissions) => {
    // Engine displacement tax
    const engineTax =
      (engineSizeCcm / 100) *
      (fuelType === "diesel"
        ? IMPORT_CONSTANTS.KFZ_TAX_DIESEL_PER_100CCM
        : IMPORT_CONSTANTS.KFZ_TAX_PETROL_PER_100CCM);

    // CO2 tax (over 95g/km for WLTP)
    const co2Tax =
      Math.max(0, co2Emissions - 95) * IMPORT_CONSTANTS.KFZ_TAX_CO2_RATE;

    return Math.round(engineTax + co2Tax);
  };

  /**
   * Estimate additional registration costs
   */
  const estimateAdditionalCosts = () => {
    const registrationFee =
      (IMPORT_CONSTANTS.REGISTRATION_FEE_RANGE.min +
        IMPORT_CONSTANTS.REGISTRATION_FEE_RANGE.max) /
      2;
    const inspectionCost =
      (IMPORT_CONSTANTS.INSPECTION_COST_RANGE.min +
        IMPORT_CONSTANTS.INSPECTION_COST_RANGE.max) /
      2;

    return {
      registrationFee: Math.round(registrationFee),
      inspectionCost: Math.round(inspectionCost),
      total: Math.round(registrationFee + inspectionCost),
    };
  };

  /**
   * Validate inputs
   */
  const validateInputs = () => {
    const errors = [];

    if (vehicleValue <= 0) errors.push("Vehicle value must be greater than 0");
    if (vehicleAge < 0) errors.push("Vehicle age cannot be negative");
    if (vehicleMileage < 0) errors.push("Vehicle mileage cannot be negative");
    if (shippingCost < 0) errors.push("Shipping cost cannot be negative");
    if (insuranceCost < 0) errors.push("Insurance cost cannot be negative");
    if (engineSize <= 0) errors.push("Engine size must be greater than 0");
    if (co2Emissions < 0) errors.push("CO2 emissions cannot be negative");

    if (isRelocating) {
      if (ownershipMonths < 0)
        errors.push("Ownership period cannot be negative");
      if (residenceMonths < 0)
        errors.push("Residence period cannot be negative");
    }

    return errors;
  };

  /**
   * Main tax calculation function
   */
  const calculateImportTax = () => {
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
      const isFromEU = originCountry === "eu";
      const isFromNonEU = !isFromEU;
      const vehicleIsNew = isVehicleNew(vehicleAge, vehicleMileage);
      const isExempt = qualifiesForRelocationExemption(
        isRelocating,
        ownershipMonths,
        residenceMonths
      );

      // Step 1: Calculate customs duty (non-EU only)
      const customsDuty = calculateCustomsDuty(
        vehicleValue,
        isFromNonEU,
        isExempt
      );

      // Step 2: Calculate import VAT
      const importVAT = calculateImportVAT(
        vehicleValue,
        customsDuty,
        shippingCost,
        insuranceCost,
        isFromEU,
        vehicleIsNew,
        isExempt
      );

      // Step 3: Calculate total import taxes
      const totalImportTax = customsDuty + importVAT;
      const totalCostBeforeRegistration =
        vehicleValue + shippingCost + insuranceCost + totalImportTax;

      // Step 4: Calculate ongoing vehicle tax
      const annualVehicleTax = calculateVehicleTax(
        engineSize,
        fuelType,
        co2Emissions
      );

      // Step 5: Additional one-time costs
      const additionalCosts = estimateAdditionalCosts();

      // Step 6: Calculate total cost
      const totalCost = includeAdditionalCosts
        ? totalCostBeforeRegistration + additionalCosts.total
        : totalCostBeforeRegistration;

      // Step 7: Calculate effective rates
      const customsDutyRate =
        vehicleValue > 0 ? (customsDuty / vehicleValue) * 100 : 0;
      const vatRate =
        vehicleValue > 0
          ? (importVAT /
              (vehicleValue + customsDuty + shippingCost + insuranceCost)) *
            100
          : 0;
      const totalTaxRate =
        vehicleValue > 0 ? (totalImportTax / vehicleValue) * 100 : 0;

      // Format results
      const formattedResults = {
        // Input summary
        vehicleValue: formatCurrency(vehicleValue),
        originCountry: isFromEU ? "EU" : "Non-EU",
        vehicleAge: vehicleAge,
        vehicleMileage: vehicleMileage.toLocaleString(),
        shippingCost: formatCurrency(shippingCost),
        insuranceCost: formatCurrency(insuranceCost),
        vehicleIsNew,
        isExempt,

        // Tax calculations
        customsDuty: formatCurrency(customsDuty),
        importVAT: formatCurrency(importVAT),
        totalImportTax: formatCurrency(totalImportTax),

        // Cost breakdown
        totalCostBeforeRegistration: formatCurrency(
          totalCostBeforeRegistration
        ),
        additionalCosts: {
          registrationFee: formatCurrency(additionalCosts.registrationFee),
          inspectionCost: formatCurrency(additionalCosts.inspectionCost),
          total: formatCurrency(additionalCosts.total),
        },
        totalCost: formatCurrency(totalCost),

        // Ongoing costs
        annualVehicleTax: formatCurrency(annualVehicleTax),

        // Rates
        customsDutyRate: customsDutyRate.toFixed(1) + "%",
        vatRate: vatRate.toFixed(1) + "%",
        totalTaxRate: totalTaxRate.toFixed(1) + "%",

        // Raw values for calculations
        customsDutyValue: customsDuty,
        importVATValue: importVAT,
        totalImportTaxValue: totalImportTax,
        totalCostValue: totalCost,
      };

      setResults(formattedResults);
      setIsCalculating(false);
    }, 300);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateImportTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    vehicleValue,
    originCountry,
    vehicleAge,
    vehicleMileage,
    shippingCost,
    insuranceCost,
    isRelocating,
    ownershipMonths,
    residenceMonths,
    engineSize,
    fuelType,
    co2Emissions,
    includeAdditionalCosts,
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
    calculateImportTax();
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
        title="Germany Vehicle Import Tax Calculator - Customs Duty & VAT Estimator (2025)"
        description="Calculate import taxes for vehicles to Germany. Non-EU: 10% customs duty + 19% VAT. EU: VAT on new vehicles only. Includes relocation exemptions and vehicle tax."
        imageName="germany-vehicle-import-tax-calculator"
        featureList={[
          "Germany vehicle import tax calculator 2025",
          "German customs duty calculator",
          "Vehicle import VAT Germany",
          "Car import tax Germany",
          "German vehicle registration costs",
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
              Germany Vehicle Import Tax Calculator
              <span className="block text-lg font-normal text-muted-foreground mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      Customs Duty & VAT Estimator 🇩🇪
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Calculate import taxes, duties, and registration costs
                        for vehicles imported to Germany
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
                    Vehicle Import Details
                  </CardTitle>
                  <CardDescription>
                    Enter your vehicle information to calculate German import
                    taxes, duties, and registration costs.
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
                    <Tabs defaultValue="vehicle" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
                        <TabsTrigger value="costs">Import Costs</TabsTrigger>
                        <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
                      </TabsList>

                      <TabsContent value="vehicle" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Vehicle Value */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="vehicleValue"
                              className="flex items-center gap-1"
                            >
                              Vehicle Value (€)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Market value or purchase price of the
                                      vehicle (CIF basis for customs)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="vehicleValue"
                              value={vehicleValue}
                              onChange={(e) =>
                                setVehicleValue(Number(e.target.value))
                              }
                              min="0"
                              step="1000"
                              required
                            />
                          </div>

                          {/* Origin Country */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="originCountry"
                              className="text-sm font-medium"
                            >
                              Origin Country/Region
                            </Label>
                            <Select
                              value={originCountry}
                              onValueChange={setOriginCountry}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="eu">EU Country</SelectItem>
                                <SelectItem value="non-eu">
                                  Non-EU Country
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Vehicle Age */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="vehicleAge"
                              className="flex items-center gap-1"
                            >
                              Vehicle Age (months)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Vehicles under 6 months old are considered
                                      "new" for VAT purposes
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="vehicleAge"
                              value={vehicleAge}
                              onChange={(e) =>
                                setVehicleAge(Number(e.target.value))
                              }
                              min="0"
                              step="1"
                              required
                            />
                          </div>

                          {/* Vehicle Mileage */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="vehicleMileage"
                              className="flex items-center gap-1"
                            >
                              Vehicle Mileage (km)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Vehicles under 6,000 km are considered
                                      "new" for VAT purposes
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="vehicleMileage"
                              value={vehicleMileage}
                              onChange={(e) =>
                                setVehicleMileage(Number(e.target.value))
                              }
                              min="0"
                              step="1000"
                              required
                            />
                          </div>

                          {/* Engine Size */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="engineSize"
                              className="flex items-center gap-1"
                            >
                              Engine Size (ccm)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Engine displacement in cubic centimeters
                                      for vehicle tax calculation
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="engineSize"
                              value={engineSize}
                              onChange={(e) =>
                                setEngineSize(Number(e.target.value))
                              }
                              min="1"
                              step="100"
                              required
                            />
                          </div>

                          {/* Fuel Type */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="fuelType"
                              className="text-sm font-medium"
                            >
                              Fuel Type
                            </Label>
                            <Select
                              value={fuelType}
                              onValueChange={setFuelType}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="petrol">
                                  Petrol/Gasoline
                                </SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="costs" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Shipping Cost */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="shippingCost"
                              className="flex items-center gap-1"
                            >
                              Shipping/Transport Cost (€)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Cost of shipping/transporting the vehicle
                                      to Germany
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="shippingCost"
                              value={shippingCost}
                              onChange={(e) =>
                                setShippingCost(Number(e.target.value))
                              }
                              min="0"
                              step="100"
                            />
                          </div>

                          {/* Insurance Cost */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="insuranceCost"
                              className="flex items-center gap-1"
                            >
                              Insurance Cost (€)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Insurance cost for shipping/transport
                                      (included in VAT base)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="insuranceCost"
                              value={insuranceCost}
                              onChange={(e) =>
                                setInsuranceCost(Number(e.target.value))
                              }
                              min="0"
                              step="50"
                            />
                          </div>

                          {/* CO2 Emissions */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="co2Emissions"
                              className="flex items-center gap-1"
                            >
                              CO₂ Emissions (g/km)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      WLTP CO₂ emissions for vehicle tax
                                      calculation (€2 per g/km over 95g/km)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              type="number"
                              id="co2Emissions"
                              value={co2Emissions}
                              onChange={(e) =>
                                setCo2Emissions(Number(e.target.value))
                              }
                              min="0"
                              step="5"
                            />
                          </div>

                          {/* Include Additional Costs */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="includeAdditionalCosts"
                              className="flex items-center gap-1 text-sm font-medium"
                            >
                              Include Registration & Inspection Costs
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Add estimated registration fees (€26-67)
                                      and TÜV inspection costs (€100-200)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <div className="flex items-center gap-2 pt-0.5">
                              <Switch
                                id="includeAdditionalCosts"
                                checked={includeAdditionalCosts}
                                onCheckedChange={setIncludeAdditionalCosts}
                              />
                              <Label
                                htmlFor="includeAdditionalCosts"
                                className="cursor-pointer"
                              >
                                {includeAdditionalCosts
                                  ? "Yes, include costs"
                                  : "No, exclude costs"}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="exemptions"
                        className="space-y-6 mt-6"
                      >
                        <div className="space-y-6">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                              Relocation Exemption
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              If you're moving to Germany and have owned/used
                              the vehicle abroad for ≥6 months and lived abroad
                              ≥12 months, you may qualify for duty/VAT
                              exemption.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Relocating */}
                            <div className="space-y-2.5">
                              <Label
                                htmlFor="isRelocating"
                                className="flex items-center gap-1 text-sm font-medium"
                              >
                                Relocating to Germany
                              </Label>
                              <div className="flex items-center gap-2 pt-0.5">
                                <Switch
                                  id="isRelocating"
                                  checked={isRelocating}
                                  onCheckedChange={setIsRelocating}
                                />
                                <Label
                                  htmlFor="isRelocating"
                                  className="cursor-pointer"
                                >
                                  {isRelocating
                                    ? "Yes, relocating"
                                    : "No, not relocating"}
                                </Label>
                              </div>
                            </div>

                            {isRelocating && (
                              <>
                                {/* Ownership Period */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="ownershipMonths"
                                    className="flex items-center gap-1"
                                  >
                                    Ownership Period Abroad (months)
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Must have owned and used vehicle
                                            abroad for at least 6 months
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  <Input
                                    type="number"
                                    id="ownershipMonths"
                                    value={ownershipMonths}
                                    onChange={(e) =>
                                      setOwnershipMonths(Number(e.target.value))
                                    }
                                    min="0"
                                    step="1"
                                  />
                                </div>

                                {/* Residence Period */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="residenceMonths"
                                    className="flex items-center gap-1"
                                  >
                                    Residence Period Abroad (months)
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Must have lived abroad for at least
                                            12 months
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  <Input
                                    type="number"
                                    id="residenceMonths"
                                    value={residenceMonths}
                                    onChange={(e) =>
                                      setResidenceMonths(Number(e.target.value))
                                    }
                                    min="0"
                                    step="1"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-center pt-4">
                      <Button
                        type="submit"
                        disabled={isCalculating}
                        className="w-48"
                      >
                        {isCalculating
                          ? "Calculating..."
                          : "Calculate Import Tax"}
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
                {/* Warning/Info alerts */}
                {results.isExempt && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Relocation Exemption:</strong> Based on your
                      inputs, you may qualify for duty and VAT exemption.
                      Consult German customs (Zoll) to confirm eligibility.
                    </AlertDescription>
                  </Alert>
                )}

                {results.originCountry === "EU" && !results.vehicleIsNew && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Used EU Vehicle:</strong> No import VAT required
                      for used vehicles from EU countries (over 6 months old and
                      6,000+ km).
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Import Tax Calculation Results
                    </CardTitle>
                    <CardDescription>
                      Your estimated import taxes and total costs for importing
                      to Germany.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="taxes">Taxes</TabsTrigger>
                        <TabsTrigger value="costs">Total Costs</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                      </TabsList>

                      {/* Summary Tab */}
                      <TabsContent value="summary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Vehicle Details
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Vehicle Value:"
                                value={results.vehicleValue}
                              />
                              <ResultItem
                                label="Origin:"
                                value={results.originCountry}
                                badge={
                                  results.originCountry === "Non-EU"
                                    ? "Customs Duty"
                                    : "EU"
                                }
                              />
                              <ResultItem
                                label="Age/Mileage:"
                                value={`${results.vehicleAge} months / ${results.vehicleMileage} km`}
                                badge={results.vehicleIsNew ? "New" : "Used"}
                              />
                              <ResultItem
                                label="Shipping Cost:"
                                value={results.shippingCost}
                              />
                              <ResultItem
                                label="Insurance Cost:"
                                value={results.insuranceCost}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Euro className="h-4 w-4" />
                              Tax Summary
                            </h3>
                            <div className="space-y-3">
                              <ResultItem
                                label="Customs Duty (10%):"
                                value={results.customsDuty}
                                info="Applied to non-EU vehicle imports"
                              />
                              <ResultItem
                                label="Import VAT (19%):"
                                value={results.importVAT}
                                info="Applied to total value including duty and transport"
                              />
                              <ResultItem
                                label="Total Import Tax:"
                                value={results.totalImportTax}
                                highlight
                              />
                              <ResultItem
                                label="Total Cost:"
                                value={results.totalCost}
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
                              Customs Duty Rate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.customsDutyRate}
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm text-muted-foreground">
                              VAT Rate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.vatRate}
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm text-muted-foreground">
                              Total Tax Rate
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {results.totalTaxRate}
                            </div>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Taxes Tab */}
                      <TabsContent value="taxes">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Import Tax Breakdown
                          </h3>

                          <div className="space-y-4">
                            <ResultItem
                              label="Vehicle Value:"
                              value={results.vehicleValue}
                            />

                            <div className="pl-4 border-l-2 border-muted space-y-3">
                              <ResultItem
                                label="Customs Duty (10%):"
                                value={results.customsDuty}
                                info="Applied to non-EU imports only"
                                badge={
                                  results.originCountry === "Non-EU"
                                    ? "Applied"
                                    : "Not Applied"
                                }
                              />

                              <div className="text-sm text-muted-foreground">
                                VAT Base = Vehicle Value + Customs Duty +
                                Shipping + Insurance
                              </div>

                              <ResultItem
                                label="Import VAT (19%):"
                                value={results.importVAT}
                                info="19% German VAT on total import value"
                                badge={
                                  results.vehicleIsNew ||
                                  results.originCountry === "Non-EU"
                                    ? "Applied"
                                    : "Not Applied"
                                }
                              />
                            </div>

                            <ResultItem
                              label="Total Import Tax:"
                              value={results.totalImportTax}
                              highlight
                            />
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                              Tax Rules Summary
                            </h4>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>
                                • Non-EU imports: 10% customs duty + 19% VAT
                              </li>
                              <li>
                                • EU "new" vehicles (&lt;6 months or
                                &lt;6,000km): 19% VAT only
                              </li>
                              <li>• EU used vehicles: No import tax</li>
                              <li>
                                • Relocation exemption: Must meet ownership and
                                residence requirements
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Total Costs Tab */}
                      <TabsContent value="costs">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Complete Cost Breakdown
                          </h3>

                          <div className="space-y-3">
                            <h4 className="font-medium">
                              Purchase & Transport
                            </h4>
                            <ResultItem
                              label="Vehicle Value:"
                              value={results.vehicleValue}
                            />
                            <ResultItem
                              label="Shipping Cost:"
                              value={results.shippingCost}
                            />
                            <ResultItem
                              label="Insurance Cost:"
                              value={results.insuranceCost}
                            />

                            <Separator className="my-4" />

                            <h4 className="font-medium">Import Taxes</h4>
                            <ResultItem
                              label="Customs Duty:"
                              value={results.customsDuty}
                            />
                            <ResultItem
                              label="Import VAT:"
                              value={results.importVAT}
                            />

                            <Separator className="my-4" />

                            <ResultItem
                              label="Subtotal (Before Registration):"
                              value={results.totalCostBeforeRegistration}
                              highlight
                            />

                            {includeAdditionalCosts && (
                              <>
                                <h4 className="font-medium mt-6">
                                  Registration Costs
                                </h4>
                                <ResultItem
                                  label="Registration Fee:"
                                  value={
                                    results.additionalCosts.registrationFee
                                  }
                                  info="Estimated €26-67 for German registration"
                                />
                                <ResultItem
                                  label="TÜV/Inspection Cost:"
                                  value={results.additionalCosts.inspectionCost}
                                  info="Estimated €100-200 for technical inspection"
                                />
                              </>
                            )}

                            <Separator className="my-4" />

                            <ResultItem
                              label="Total Import Cost:"
                              value={results.totalCost}
                              highlight
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* Ongoing Costs Tab */}
                      <TabsContent value="ongoing">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">
                            Annual Vehicle Tax (Kfz-Steuer)
                          </h3>

                          <div className="space-y-3">
                            <ResultItem
                              label="Annual Vehicle Tax:"
                              value={results.annualVehicleTax}
                              highlight
                              info="Based on engine size and CO₂ emissions"
                            />
                          </div>

                          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                              Vehicle Tax Calculation
                            </h4>
                            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                              <li>
                                • Engine tax: €
                                {fuelType === "diesel" ? "9.50" : "2.00"} per
                                100ccm ({fuelType})
                              </li>
                              <li>
                                • CO₂ tax: €2.00 per g/km over 95g/km (WLTP)
                              </li>
                              <li>
                                • Total annual tax: {results.annualVehicleTax}
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">
                              Additional Ongoing Costs (Not Calculated)
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>
                                • Motor vehicle insurance (Kfz-Versicherung)
                              </li>
                              <li>
                                • Periodic TÜV inspections (every 2 years)
                              </li>
                              <li>
                                • Annual emissions test (Abgasuntersuchung)
                              </li>
                              <li>• Road tolls (if applicable)</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>

                  <CardFooter className="flex flex-col text-xs text-muted-foreground gap-2 pt-4">
                    <span>
                      Last updated:{" "}
                      <span className="font-medium">2025-10-31</span> | Based on
                      2025 German import regulations
                    </span>
                    <span>
                      <strong>Disclaimer:</strong> This is an estimate only.
                      Consult German customs (Zoll) and tax authorities for
                      exact requirements. Additional costs may apply.
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
            Understanding Germany Vehicle Import Rules (2025)
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Import Tax Rates</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Non-EU imports:</strong> 10% customs duty + 19% VAT
              </li>
              <li>
                <strong>EU "new" vehicles:</strong> 19% VAT only (under 6 months
                old or under 6,000 km)
              </li>
              <li>
                <strong>EU used vehicles:</strong> No import taxes (over 6
                months old and over 6,000 km)
              </li>
              <li>
                <strong>VAT base:</strong> Vehicle value + customs duty +
                shipping + insurance costs
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Relocation Exemption</h3>
            <p className="text-muted-foreground">
              If you're moving your residence to Germany, you may qualify for
              exemption from customs duty and VAT:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Vehicle ownership:</strong> Must have owned and used
                abroad for at least 6 months
              </li>
              <li>
                <strong>Residence requirement:</strong> Must have lived abroad
                for at least 12 months
              </li>
              <li>
                <strong>Personal use:</strong> Vehicle must be for personal use,
                not commercial
              </li>
              <li>
                <strong>Timing:</strong> Must import within reasonable time of
                relocation
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">
              Additional Costs & Requirements
            </h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Registration fee:</strong> €26.30 - €67.20 depending on
                state
              </li>
              <li>
                <strong>Technical inspection:</strong> €100-200 for TÜV/DEKRA
                inspection
              </li>
              <li>
                <strong>Vehicle tax:</strong> Annual Kfz-Steuer based on engine
                size and CO₂ emissions
              </li>
              <li>
                <strong>Insurance:</strong> Mandatory motor vehicle insurance
                (Kfz-Haftpflicht)
              </li>
              <li>
                <strong>Modifications:</strong> May require adaptations for
                German standards (lights, speedometer)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-8">Required Documents</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <strong>Invoice/Purchase contract:</strong> Proof of vehicle
                value
              </li>
              <li>
                <strong>Registration certificate:</strong> Foreign vehicle
                registration
              </li>
              <li>
                <strong>Certificate of Conformity (COC):</strong> EU type
                approval document
              </li>
              <li>
                <strong>Customs declaration:</strong> For non-EU imports
              </li>
              <li>
                <strong>Insurance policy:</strong> German motor vehicle
                insurance
              </li>
              <li>
                <strong>Identity documents:</strong> Passport and residence
                registration
              </li>
            </ul>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold mt-8">Official Resources</h3>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>
                <a
                  href="https://www.zoll.de/EN/Private-individuals/Travel/Bringing-goods-to-Germany/Restrictions/Motor-vehicles/motor-vehicles_node.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  German Customs (Zoll) - Vehicle Import{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.kba.de/EN/Home/home_node.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Federal Motor Transport Authority (KBA){" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iamexpat.de/expat-info/german-expat-news/importing-car-germany-what-you-need-know"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  IamExpat - Car Import Guide{" "}
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
 * Example 1: Non-EU import (typical scenario)
 * - Vehicle value: €25,000, Origin: Non-EU
 * - Shipping: €2,000, Insurance: €500
 * - Customs duty: €2,500 (10% of €25,000)
 * - VAT base: €30,000, VAT: €5,700 (19%)
 * - Total taxes: €8,200
 *
 * Example 2: New EU vehicle
 * - Vehicle value: €30,000, Origin: EU, Age: 3 months, Mileage: 2,000km
 * - No customs duty, VAT applies: €6,270 (19% of €33,000)
 *
 * Example 3: Used EU vehicle
 * - Vehicle value: €20,000, Origin: EU, Age: 24 months, Mileage: 35,000km
 * - No customs duty, no VAT (used vehicle from EU)
 *
 * Example 4: Relocation exemption
 * - Non-EU vehicle, owned 24 months abroad, lived abroad 36 months
 * - Qualifies for exemption: €0 in taxes
 */
