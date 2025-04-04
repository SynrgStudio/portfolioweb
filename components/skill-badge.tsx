import { Badge } from "@/components/ui/badge"

interface SkillBadgeProps {
  name: string
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <Badge variant="secondary" className="transition-colors hover:bg-primary/20">
      {name}
    </Badge>
  )
}

