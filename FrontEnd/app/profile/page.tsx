import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-pixel">Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-sm">Problems Solved</span>
                <span className="font-pixel text-sm">442/3445</span>
              </div>
              <Progress value={(442 / 3445) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-pixel text-2xl">252</div>
                <div className="text-xs text-muted-foreground">Easy</div>
              </div>
              <div>
                <div className="font-pixel text-2xl">160</div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </div>
              <div>
                <div className="font-pixel text-2xl">30</div>
                <div className="text-xs text-muted-foreground">Hard</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-pixel">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-border p-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

