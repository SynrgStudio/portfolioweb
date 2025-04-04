import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="frosted-glass py-6 mt-10 z-10 relative">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="mailto:contact@example.com"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

