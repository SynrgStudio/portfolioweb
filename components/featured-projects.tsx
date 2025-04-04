"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturedProjects() {
  // Only show the first 3 projects on the homepage
  const featuredProjects = projects.slice(0, 3)

  return (
    <section className="container py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
          <p className="mt-2 text-muted-foreground">A selection of my recent work</p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/projects" prefetch={true}>
            View all projects <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 10 }} // Reduced from y: 20
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3, // Reduced from 0.5
              delay: index * 0.05, // Reduced from 0.1
              ease: "easeOut",
            }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link href={`/projects/${project.slug}`} prefetch={true}>
              <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.thumbnailUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-primary/10"></div>
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-2">
                    {project.type}
                  </Badge>
                  <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

