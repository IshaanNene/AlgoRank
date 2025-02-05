import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PixelBorder } from "@/components/pixel-border"
import { PixelIcon } from "@/components/pixel-icon"

const problems = [
  { id: 1, title: "Problem 1", difficulty: "Easy", solved: 100 },
  { id: 2, title: "Problem 2", difficulty: "Medium", solved: 50 },
  { id: 3, title: "Problem 3", difficulty: "Hard", solved: 20 },
]

const difficultyColors = {
  Easy: "bg-pixel-green",
  Medium: "bg-pixel-yellow",
  Hard: "bg-pixel-red",
}

export default function ProblemsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-pixel mb-8 text-4xl bg-gradient-to-r from-pixel-green via-pixel-blue to-pixel-purple bg-clip-text text-transparent">
        Problems
      </h1>
      <div className="grid gap-4">
        {problems.map((problem) => (
          <Link key={problem.id} href={`/problems/${problem.id}`}>
            <PixelBorder>
              <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:bg-muted/50">
                <CardContent className="grid grid-cols-[auto,1fr,100px,100px] gap-4 p-4">
                  <PixelIcon type="scroll" />
                  <div className="font-pixel text-lg">{problem.title}</div>
                  <Badge className={`font-pixel ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</Badge>
                  <div className="font-pixel text-right text-pixel-blue">
                    {problem.solved} <span className="text-xs">solved</span>
                  </div>
                </CardContent>
              </Card>
            </PixelBorder>
          </Link>
        ))}
      </div>
    </div>
  )
}

