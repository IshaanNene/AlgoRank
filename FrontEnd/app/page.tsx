import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PixelBorder } from "@/components/pixel-border"
import { PixelIcon } from "@/components/pixel-icon"

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[url('/grid.svg')] bg-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pixel-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {["⚡", "💫", "✨"][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>

      <div className="container relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="font-pixel mb-4 text-4xl">
            <span className="text-pixel-green">Pixel</span>
            <span className="text-pixel-blue">Code</span>
          </h1>
          <PixelBorder>
            <p className="mb-8 text-muted-foreground">
              Level up your coding skills with our pixel-perfect challenges
              <span className="ml-2 inline-block animate-pixel-bounce">🎮</span>
            </p>
          </PixelBorder>
          <div className="flex justify-center gap-4">
            <Button className="font-pixel animate-pixel-glow bg-pixel-green hover:bg-pixel-green/80" size="lg">
              Start Coding <PixelIcon type="sword" />
            </Button>
            <Button
              className="font-pixel border-pixel-blue text-pixel-blue hover:bg-pixel-blue/20"
              variant="outline"
              size="lg"
            >
              View Problems <PixelIcon type="scroll" />
            </Button>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-3 gap-4">
          <Card className="border-pixel-green bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-pixel text-sm text-pixel-green">Daily Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-pixel text-3xl text-pixel-green animate-pixel-glow">7</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
          <Card className="border-pixel-blue bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-pixel text-sm text-pixel-blue">Problems Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-pixel text-3xl text-pixel-blue animate-pixel-glow">442</div>
              <p className="text-xs text-muted-foreground">total</p>
            </CardContent>
          </Card>
          <Card className="border-pixel-purple bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-pixel text-sm text-pixel-purple">Global Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-pixel text-3xl text-pixel-purple animate-pixel-glow">1,429</div>
              <p className="text-xs text-muted-foreground">of 653,032</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

