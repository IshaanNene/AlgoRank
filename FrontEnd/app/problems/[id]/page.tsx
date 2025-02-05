"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from "@monaco-editor/react"
import { PixelBorder } from "@/components/pixel-border"
import { PixelIcon } from "@/components/pixel-icon"

export default function ProblemPage() {
  const [code, setCode] = useState(`class Solution:
    def areAlmostEqual(self, s1: str, s2: str) -> bool:
        # Write your solution here
        pass
`)

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-[1fr,1fr] gap-4 p-4 bg-[url('/grid.svg')] bg-center">
      <div className="flex flex-col gap-4">
        <PixelBorder>
          <Card className="flex-1 bg-background/80 backdrop-blur">
            <Tabs defaultValue="description">
              <TabsList className="font-pixel">
                <TabsTrigger value="description" className="text-pixel-green">
                  <PixelIcon type="scroll" /> Description
                </TabsTrigger>
                <TabsTrigger value="solution" className="text-pixel-blue">
                  <PixelIcon type="potion" /> Solution
                </TabsTrigger>
                <TabsTrigger value="submissions" className="text-pixel-purple">
                  <PixelIcon type="shield" /> Submissions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 space-y-4">
                <h1 className="font-pixel text-xl bg-gradient-to-r from-pixel-green to-pixel-blue bg-clip-text text-transparent">
                  1790. Check if One String Swap Can Make Strings Equal
                </h1>
                <div className="rounded-md bg-muted/50 p-4 backdrop-blur">
                  <p className="mb-4">
                    You are given two strings s1 and s2 of equal length. A string swap is an operation where you choose
                    two indices in a string (not necessarily different) and swap the characters at these indices.
                  </p>
                  <p>
                    Return true if it is possible to make both strings equal by performing at most one string swap on
                    exactly one of the strings. Otherwise, return false.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="font-pixel text-sm text-pixel-green">Example 1:</h2>
                  <pre className="rounded-md bg-muted/50 p-4 backdrop-blur font-mono">
                    <code>{`Input: s1 = "bank", s2 = "kanb"
Output: true
Explanation: For example, swap the first character with the last character of s2 to make "bank".`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </PixelBorder>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <select className="font-pixel bg-muted/50 backdrop-blur border-pixel-blue text-pixel-blue p-2 rounded">
            <option>Python3</option>
            <option>JavaScript</option>
            <option>Java</option>
          </select>
          <div className="flex gap-2">
            <Button variant="outline" className="font-pixel border-pixel-blue text-pixel-blue">
              <PixelIcon type="potion" /> Run
            </Button>
            <Button className="font-pixel bg-pixel-green text-background">
              <PixelIcon type="sword" /> Submit
            </Button>
          </div>
        </div>
        <PixelBorder>
          <Card className="flex-1 bg-background/80 backdrop-blur">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                fontFamily: "Geist Mono",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Card>
        </PixelBorder>
        <PixelBorder>
          <Card className="h-[200px] p-4 bg-background/80 backdrop-blur">
            <h2 className="font-pixel mb-4 text-sm text-pixel-green">Testcase</h2>
            <div className="grid gap-2">
              <div className="grid grid-cols-[auto,1fr] gap-2">
                <span className="font-pixel text-xs text-pixel-blue">s1 =</span>
                <input
                  type="text"
                  value='"bank"'
                  className="rounded-md bg-muted/50 px-2 py-1 font-mono text-xs border-pixel-blue"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[auto,1fr] gap-2">
                <span className="font-pixel text-xs text-pixel-blue">s2 =</span>
                <input
                  type="text"
                  value='"kanb"'
                  className="rounded-md bg-muted/50 px-2 py-1 font-mono text-xs border-pixel-blue"
                  readOnly
                />
              </div>
            </div>
          </Card>
        </PixelBorder>
      </div>
    </div>
  )
}

