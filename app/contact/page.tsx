"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Github, Linkedin, Mail, Send } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: "", email: "", message: "" })
    }, 1500)
  }

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-2 text-xl text-muted-foreground">Get in touch to discuss your project or just say hello</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll respond to your message soon.
                  </p>
                  <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
              <CardDescription>Find me on these platforms or reach out directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-3">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a
                    href="mailto:contact@example.com"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    contact@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-3">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    github.com/username
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-3">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">LinkedIn</h3>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    linkedin.com/in/username
                  </a>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-muted p-6">
                <h3 className="mb-2 font-medium">Availability</h3>
                <p className="text-muted-foreground">
                  Currently available for freelance projects and collaborations. I typically respond to inquiries within
                  24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

