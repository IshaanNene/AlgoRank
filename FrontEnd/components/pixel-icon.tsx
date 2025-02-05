export function PixelIcon({ type }: { type: "sword" | "shield" | "potion" | "scroll" }) {
  const icons = {
    sword: "⚔️",
    shield: "🛡️",
    potion: "🧪",
    scroll: "📜",
  }

  return <div className="inline-block animate-pixel-bounce font-pixel text-2xl">{icons[type]}</div>
}

