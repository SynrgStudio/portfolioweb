export type Project = {
  slug: string
  title: string
  type: "3D" | "2D" | "Code"
  shortDescription: string
  longDescription: string
  thumbnailUrl: string
  images: string[]
  technologies: string[]
  liveUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    slug: "interactive-dashboard",
    title: "Interactive Dashboard",
    type: "Code",
    shortDescription: "A real-time data visualization dashboard built with React and D3.",
    longDescription:
      "This interactive dashboard provides real-time data visualization for complex datasets. " +
      "Built with React for the UI components and D3.js for advanced data visualization, it features " +
      "responsive design, dark mode, and optimized performance even with large datasets. " +
      "The dashboard includes customizable widgets, filters, and export capabilities.",
    thumbnailUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    technologies: ["React", "D3.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://example.com/dashboard",
    repoUrl: "https://github.com/example/dashboard",
  },
  {
    slug: "architectural-visualization",
    title: "Architectural Visualization",
    type: "3D",
    shortDescription: "Photorealistic 3D visualization of a modern minimalist house.",
    longDescription:
      "This architectural visualization project showcases a modern minimalist house design. " +
      "Created using Blender for modeling and rendering, with custom materials and lighting setups " +
      "to achieve photorealistic results. The project includes exterior and interior views, " +
      "day and night lighting scenarios, and detailed material studies.",
    thumbnailUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    technologies: ["Blender", "Substance Painter", "Photoshop"],
    liveUrl: "https://example.com/architecture",
  },
  {
    slug: "brand-identity",
    title: "Brand Identity Design",
    type: "2D",
    shortDescription: "Complete brand identity design for a tech startup.",
    longDescription:
      "A comprehensive brand identity design for a tech startup in the AI space. " +
      "The project included logo design, color palette development, typography selection, " +
      "brand guidelines documentation, and application across various digital and print media. " +
      "The design approach focused on creating a modern, trustworthy, and innovative visual identity.",
    thumbnailUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    technologies: ["Illustrator", "Photoshop", "Figma"],
    liveUrl: "https://example.com/brand",
  },
]

