import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  CheckSquare,
  Calendar,
  Users,
  Euro,
  Pin,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Head from "@/components/Head";

export default function GermanyUnemploymentBenefitsCalculator() {
  const [grossSalary, setGrossSalary] = useState("");
  const [employmentDuration, setEmploymentDuration] = useState("12");
  const [hasChildren, setHasChildren] = useState("no");
  const [ageBracket, setAgeBracket] = useState("under50");
  const [results, setResults] = useState(null);

  const calculateBenefits = () => {
    // Convert inputs to correct types
    const monthlySalary = parseFloat(grossSalary);

    if (isNaN(monthlySalary) || monthlySalary <= 0) {
      alert("Please enter a valid salary amount");
      return;
    }

    // Calculate daily gross
    const dailyGross = (monthlySalary * 12) / 365;

    // Deduct 20% for tax & social contributions
    const netDailyWage = dailyGross * 0.8;

    // Apply benefit rate based on children status
    const benefitRate = hasChildren === "yes" ? 0.67 : 0.6;
    const dailyBenefit = netDailyWage * benefitRate;

    // Calculate monthly benefit
    const monthlyBenefit = dailyBenefit * 30;

    // Determine benefit duration
    let benefitDuration = 6; // Default for 12 months

    if (employmentDuration === "24") {
      benefitDuration = 12;
    } else if (employmentDuration === "30" && ageBracket === "50-54") {
      benefitDuration = 15;
    } else if (employmentDuration === "36" && ageBracket === "55-57") {
      benefitDuration = 18;
    } else if (employmentDuration === "48" && ageBracket === "58+") {
      benefitDuration = 24;
    }

    setResults({
      dailyBenefit,
      monthlyBenefit,
      benefitDuration,
    });
  };

  return (
    <>
      <Head
        title="Germany Unemployment Benefit Calculator – ALG I Estimator (2025)"
        description="Estimate your monthly ALG I unemployment benefit in Germany for 2025 based on salary, children, and work history"
        imageName="germany-unemployment-benefit-calculator"
        featureList={[
          "Unemployment benefit calculator Germany 2025",
          "ALG I net benefit estimator",
          "Estimate benefit duration by age and work history",
          "Germany child benefit unemployment calculation",
          "German unemployment salary replacement tool",
        ]}
        lastModified="2025-06-20"
      />

      <div className="container max-w-4xl mx-auto py-8 px-4">
        <section className="tool-section">
          <h1 className="text-3xl font-bold mb-6 text-center">
            German Unemployment Benefits Calculator
          </h1>
          <Card className="p-6 mb-8">
            <div className="space-y-6">
              <div className="grid gap-4">
                <Label htmlFor="grossSalary">Gross Monthly Salary (EUR)</Label>
                <Input
                  id="grossSalary"
                  type="number"
                  min="0"
                  placeholder="e.g. 3000"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                <Label htmlFor="employmentDuration">
                  Employed for Previous:
                </Label>
                <Select
                  value={employmentDuration}
                  onValueChange={setEmploymentDuration}
                >
                  <SelectTrigger id="employmentDuration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="30">30 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <Label>Do you receive child benefit?</Label>
                <RadioGroup
                  value={hasChildren}
                  onValueChange={setHasChildren}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hasChildren-yes" />
                    <Label htmlFor="hasChildren-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hasChildren-no" />
                    <Label htmlFor="hasChildren-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-4">
                <Label htmlFor="ageBracket">Age Bracket</Label>
                <Select value={ageBracket} onValueChange={setAgeBracket}>
                  <SelectTrigger id="ageBracket">
                    <SelectValue placeholder="Select age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under50">Under 50</SelectItem>
                    <SelectItem value="50-54">50 - 54</SelectItem>
                    <SelectItem value="55-57">55 - 57</SelectItem>
                    <SelectItem value="58+">58 or older</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={calculateBenefits} size="lg">
                Calculate Benefits
              </Button>
            </div>
          </Card>

          {results && (
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-2">
                  Daily Benefit (Net)
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  €{results.dailyBenefit.toFixed(2)}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-2">Monthly Benefit</h3>
                <p className="text-3xl font-bold text-green-600">
                  €{results.monthlyBenefit.toFixed(2)}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-2">Benefit Duration</h3>
                <p className="text-3xl font-bold text-green-600">
                  {results.benefitDuration} months
                </p>
              </Card>

              <Card className="p-6 md:col-span-3">
                <h3 className="text-lg font-medium mb-2">Important Notes</h3>
                <p className="text-sm text-gray-600">
                  This is an estimation based on standard calculations. Actual
                  benefits may vary based on individual circumstances. The
                  German employment agency (Arbeitsagentur) will make the final
                  determination.
                </p>
              </Card>
            </div>
          )}
        </section>

        <section className="w-full mt-12">
          <Card className="border rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                How Germany's Unemployment Benefits (ALG I) Work in 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <p className="text-muted-foreground">
                Germany provides financial support to workers who become
                unemployed through a benefit called{" "}
                <span className="font-semibold">
                  Arbeitslosengeld I (ALG I)
                </span>
                . This is a temporary income replacement based on your previous
                salary, duration of employment, and family situation.
              </p>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-muted-foreground" />
                  Benefit Calculation Formula
                </h3>
                <Separator className="my-2" />
                <ul className="space-y-1 list-disc pl-5">
                  <li>Gross annual salary ÷ 365 = daily wage</li>
                  <li>
                    Deduct ~20% for taxes and contributions → net daily wage
                  </li>
                  <li>
                    Multiply by <span className="font-semibold">60%</span> (no
                    children) or <span className="font-semibold">67%</span>{" "}
                    (with children)
                  </li>
                  <li>
                    Multiply daily benefit × 30 = estimated monthly benefit
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-muted-foreground" />
                  Eligibility Criteria
                </h3>
                <Separator className="my-2" />
                <ul className="space-y-1 list-disc pl-5">
                  <li>
                    You must have worked and contributed to German social
                    insurance for at least{" "}
                    <span className="font-semibold">
                      12 months in the last 30
                    </span>
                    .
                  </li>
                  <li>
                    You must be officially registered as unemployed with the{" "}
                    <em>Agentur für Arbeit</em>.
                  </li>
                  <li>
                    You must be actively seeking work and available for
                    employment.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  How Long Can You Receive ALG I?
                </h3>
                <Separator className="my-2" />
                <ul className="space-y-1 list-disc pl-5">
                  <li>
                    <span className="font-semibold">12 months</span> worked → up
                    to <span className="font-semibold">6 months</span> of
                    benefits
                  </li>
                  <li>
                    <span className="font-semibold">24 months</span> → up to{" "}
                    <span className="font-semibold">12 months</span>
                  </li>
                  <li>
                    <span className="font-semibold">30 months + age 50–54</span>{" "}
                    → <span className="font-semibold">15 months</span>
                  </li>
                  <li>
                    <span className="font-semibold">36 months + age 55–57</span>{" "}
                    → <span className="font-semibold">18 months</span>
                  </li>
                  <li>
                    <span className="font-semibold">48 months + age 58+</span> →{" "}
                    <span className="font-semibold">24 months</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Do Children Affect the Benefit?
                </h3>
                <Separator className="my-2" />
                <p>
                  Yes — if you receive{" "}
                  <span className="font-semibold">
                    Kindergeld (child benefit)
                  </span>
                  , your unemployment payment is increased from 60% to 67% of
                  your previous net salary.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Euro className="h-5 w-5 text-muted-foreground" />
                  Benefit Payment Limits
                </h3>
                <Separator className="my-2" />
                <p>
                  There is a maximum cap on ALG I based on contribution
                  ceilings. In most cases, the monthly payout is limited to
                  approximately:
                </p>
                <ul className="space-y-1 list-disc pl-5">
                  <li>~€2,640/month (no children)</li>
                  <li>~€2,948/month (with children)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Pin className="h-5 w-5 text-muted-foreground" />
                  Important Notes
                </h3>
                <Separator className="my-2" />
                <ul className="space-y-1 list-disc pl-5">
                  <li>
                    This tool estimates ALG I only, not ALG II (Bürgergeld)
                  </li>
                  <li>
                    Exact amounts can vary depending on tax class and insurance
                    deductions
                  </li>
                  <li>
                    Use this as a planning tool — for formal claims, consult the{" "}
                    <em>Agentur für Arbeit</em>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
        <div className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <span>Last updated:</span>{" "}
          <time dateTime="2025-06-21T03:39:49Z">2025-06-21 03:39:49</time>
        </div>
      </div>
    </>
  );
}
