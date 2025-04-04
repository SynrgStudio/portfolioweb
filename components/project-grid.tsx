"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { projects } from "@/lib/projects"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ProjectType = "3D" | "2D" | "Code" | "All"

export default function ProjectGrid() {
  const [filter, setFilter] = useState<ProjectType>("All")

  const filteredProjects = filter === "All" ? projects : projects.filter((project) => project.type === filter)

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {(["All", "3D", "2D", "Code"] as const).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
            className="transition-all"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            exit={{ opacity: 0, y: 20 }}
            layout
          >
            <Link href={`/projects/${project.slug}`}>
              <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.thumbnailUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
    </div>
  )
}

