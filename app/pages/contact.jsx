import React, { useState } from "react";
import Head from "@/components/Head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, topic: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after showing success message
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          topic: "",
          message: "",
        });
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <>
      <Head
        title={"Toolzer | Contact Us"}
        description={
          "Get in touch with Toolzer for questions, support, or feedback. We're here to help and usually respond within 24 hours."
        }
        pageUrl={"/contact"}
      ></Head>

      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Form */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
            <p className="text-muted-foreground mb-8">
              Have a question or feedback? We'd love to hear from you.
            </p>

            {isSubmitted ? (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <CheckCircle className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Message Received!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium mb-2"
                  >
                    What can we help you with?
                  </label>
                  <Select
                    value={formState.topic}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="topic" className="w-full">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Tool Support</SelectItem>
                      <SelectItem value="api">API Questions</SelectItem>
                      <SelectItem value="feedback">
                        Feedback & Suggestions
                      </SelectItem>
                      <SelectItem value="partnership">
                        Partnership Opportunities
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need help with, or share your feedback..."
                    required
                    className="w-full min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="md:w-64 lg:w-80 space-y-8">
            {/* Contact Details */}
            {/* Connect With Us */}
            {/* Last Updated Card */}
          </div>
        </div>
      </div>
    </>
  );
}
