import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects } from "@/lib/projects"
import ProjectDetail from "@/components/project-detail"

type Props = {
  params: { slug: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.shortDescription,
  }
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}

