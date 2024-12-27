"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, MixerHorizontalIcon, Pencil1Icon, CircleBackslashIcon, CommitIcon } from "@radix-ui/react-icons"


export default function ClassificationBadge({ initialType }: { initialType: "AUTO" | "ASSISTANT" | "CUSTOM" | "UNCLASSIFIED" | null }) {
  const [type, setType] = useState(initialType || "UNCLASSIFIED")

  const badgeColors = {
    AUTO: {
      bg: "bg-[#d1fae5]",
      text: "text-[#065f46]",
    },
    ASSISTANT: {
      bg: "bg-[#e0e7ff]",
      text: "text-[#4338ca]",
    },
    CUSTOM: {
      bg: "bg-[#fff7ed]",
      text: "text-[#9a3412]",
    },
    UNCLASSIFIED: {
      bg: "bg-[#f3f4f6]",
      text: "text-[#6b7280]",
    },
  }

  return (
    <Badge className={`${badgeColors[type].bg} ${badgeColors[type].text}`} variant={'outline'}>
      {type === "AUTO" && <><CommitIcon className="" /> Auto Complete</>}
      {type === "ASSISTANT" && <><MixerHorizontalIcon className="" /> Smart Assistant</>}
      {type === "CUSTOM" && <><Pencil1Icon className="" /> Requires Your Answer</>}
      {type === "UNCLASSIFIED" && <><CircleBackslashIcon className="" /></>}
    </Badge>
  )
}