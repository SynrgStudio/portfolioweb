import type { Metadata } from "next"
import ProjectGrid from "@/components/project-grid"

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "Explore my creative development work and projects",
}

export default function ProjectsPage() {
  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          A collection of my work in development, design, and 3D visualization
        </p>
      </div>

      <ProjectGrid />
    </div>
  )
}

