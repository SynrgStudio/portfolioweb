"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import type { Project } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts'
import { Circle, Clock, CheckCircle, TrendingUp, Users, Zap } from "lucide-react"

// Datos de ejemplo para el gráfico
const chartData = [
  { name: 'Jan', value: 165 },
  { name: 'Feb', value: 159 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 181 },
  { name: 'May', value: 156 },
  { name: 'Jun', value: 155 },
  { name: 'Jul', value: 140 },
  { name: 'Aug', value: 160 },
  { name: 'Sep', value: 175 },
  { name: 'Oct', value: 190 },
  { name: 'Nov', value: 185 },
  { name: 'Dec', value: 210 },
];

// Datos de ejemplo para la tabla
const tableData = [
  { id: 'DEPLOY-001', service: 'Web App', status: 'Success', duration: '1m 32s', triggeredBy: 'user-a' },
  { id: 'DEPLOY-002', service: 'API Gateway', status: 'Running', duration: '-', triggeredBy: 'ci-cd' },
  { id: 'DEPLOY-003', service: 'Database Migration', status: 'Failed', duration: '45s', triggeredBy: 'user-b' },
  { id: 'DEPLOY-004', service: 'Worker Service', status: 'Success', duration: '2m 10s', triggeredBy: 'ci-cd' },
  { id: 'DEPLOY-005', service: 'Static Site', status: 'Queued', duration: '-', triggeredBy: 'user-a' },
];

// Componente para el icono de estado
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Success':
      return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    case 'Running':
      return <Zap className="h-4 w-4 text-blue-400 animate-pulse" />;
    case 'Failed':
      return <Circle className="h-4 w-4 text-red-500" />; // O XCircle
    case 'Queued':
      return <Clock className="h-4 w-4 text-yellow-400" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function ProjectDetail({ project }: { project: Project }) {
  const isInteractiveDashboard = project.slug === "interactive-dashboard";

  return (
    <div className="container py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            {project.type}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.shortDescription}</p>
        </div>

        <div className="mb-12 overflow-hidden rounded-lg frosted-glass">
          {isInteractiveDashboard ? (
            // Renderizar el Dashboard de ejemplo estilo Vercel
            <div className="p-6 space-y-6">
              {/* Fila superior de KPIs */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+45,231</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deployments</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+21 since last hour</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98ms</div>
                    <p className="text-xs text-muted-foreground">-5ms from yesterday</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">99.98%</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico y Tabla en dos columnas */}
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Gráfico de Área */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Request Volume</CardTitle>
                    <CardDescription>Requests per minute over the last 12 months</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] pl-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${value}k`} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--popover-foreground))',
                            borderRadius: 'var(--radius)',
                            boxShadow: 'var(--shadow-md)' 
                          }}
                          labelStyle={{ fontWeight: 'bold' }}
                          itemStyle={{ color: 'hsl(262, 83%, 70%)' }} 
                        />
                        <Area type="monotone" dataKey="value" stroke="hsl(262, 83%, 58%)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Tabla de Deployments Recientes */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Deployments</CardTitle>
                    <CardDescription>Latest build and deployment activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((deployment) => (
                          <TableRow key={deployment.id}>
                            <TableCell><StatusIcon status={deployment.status} /></TableCell>
                            <TableCell className="font-medium">{deployment.service}</TableCell>
                            <TableCell className="text-muted-foreground">{deployment.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Renderizar la imagen como antes para otros proyectos
          <Image
            src={project.thumbnailUrl || "/placeholder.svg"}
            alt={project.title}
            width={1200}
            height={675}
            className="w-full object-cover"
          />
          )}
        </div>

        <div className="mb-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">About this project</h2>
            <p className="text-muted-foreground">{project.longDescription}</p>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Project Details</h3>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Technologies</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {(project.liveUrl || project.repoUrl) && (
                  <div className="flex flex-col gap-2">
                    {project.liveUrl && (
                      <Button asChild size="sm">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <span className="flex items-center text-white">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                          </span>
                        </Link>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <span className="flex items-center text-white">
                          <Github className="mr-2 h-4 w-4" /> View Code
                          </span>
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {project.images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${project.title} - Image ${index + 1}`}
                width={400}
                height={300}
                className="w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

