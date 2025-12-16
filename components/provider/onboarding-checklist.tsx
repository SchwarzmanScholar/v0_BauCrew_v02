"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { OnboardingTask } from "@/lib/types"

interface OnboardingChecklistProps {
  tasks: OnboardingTask[]
}

export function OnboardingChecklist({ tasks }: OnboardingChecklistProps) {
  const completedCount = tasks.filter((t) => t.completed).length
  const progress = (completedCount / tasks.length) * 100

  if (progress === 100) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Erste Schritte</CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount} von {tasks.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={task.href}
            className="flex items-center justify-between rounded-md p-2 hover:bg-background/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={task.completed} disabled className="pointer-events-none" />
              <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                {task.label}
              </span>
            </div>
            {!task.completed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
