import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SkillBadge from "@/components/skill-badge"

export const metadata: Metadata = {
  title: "About | Portfolio",
  description: "Learn more about my background, skills, and experience",
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">About Me</h1>

      <div className="mb-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
            I'm a creative developer and designer with a passion for building high-performance digital experiences that
            combine clean aesthetics with thoughtful interactions.
          </p>
          <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
            With a background in both design and development, I bridge the gap between visual aesthetics and technical
            implementation, creating cohesive experiences that are both beautiful and functional.
          </p>
          <p className="text-xl leading-relaxed text-muted-foreground">
            I specialize in creating minimalist, performance-focused websites and applications using modern technologies
            like React, Next.js, and Three.js, with a particular focus on subtle animations and interactive elements
            that enhance the user experience without sacrificing performance.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Profile"
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold">Skills & Expertise</h2>

      <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Development</h3>
            <div className="flex flex-wrap gap-2">
              <SkillBadge name="React" />
              <SkillBadge name="Next.js" />
              <SkillBadge name="TypeScript" />
              <SkillBadge name="Tailwind CSS" />
              <SkillBadge name="Three.js" />
              <SkillBadge name="GLSL" />
              <SkillBadge name="Framer Motion" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Design</h3>
            <div className="flex flex-wrap gap-2">
              <SkillBadge name="UI/UX Design" />
              <SkillBadge name="Figma" />
              <SkillBadge name="Adobe CC" />
              <SkillBadge name="Typography" />
              <SkillBadge name="Color Theory" />
              <SkillBadge name="Design Systems" />
              <SkillBadge name="Prototyping" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">3D & Visual</h3>
            <div className="flex flex-wrap gap-2">
              <SkillBadge name="Blender" />
              <SkillBadge name="WebGL" />
              <SkillBadge name="Shader Programming" />
              <SkillBadge name="3D Modeling" />
              <SkillBadge name="Texturing" />
              <SkillBadge name="Lighting" />
              <SkillBadge name="Animation" />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-6 text-2xl font-bold">Experience</h2>

      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Senior Frontend Developer</h3>
                <p className="text-muted-foreground">Creative Tech Agency</p>
              </div>
              <Badge variant="outline">2021 - Present</Badge>
            </div>
            <p className="mt-4 text-muted-foreground">
              Lead frontend development for client projects, focusing on performance optimization, responsive design,
              and interactive experiences. Collaborate with designers and backend developers to create cohesive digital
              products.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">UI/UX Designer & Developer</h3>
                <p className="text-muted-foreground">Digital Product Studio</p>
              </div>
              <Badge variant="outline">2018 - 2021</Badge>
            </div>
            <p className="mt-4 text-muted-foreground">
              Designed and developed user interfaces for web and mobile applications. Created design systems and
              component libraries to ensure consistency across products. Implemented frontend code using React and
              modern CSS techniques.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">3D Artist & Web Developer</h3>
                <p className="text-muted-foreground">Freelance</p>
              </div>
              <Badge variant="outline">2016 - 2018</Badge>
            </div>
            <p className="mt-4 text-muted-foreground">
              Created 3D visualizations and animations for architectural and product design clients. Developed custom
              websites with interactive elements and 3D content integration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

