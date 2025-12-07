"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SocialLinks } from "@/data/posts"

type SocialBadgeInputProps = {
  value: SocialLinks
  onChange: (links: SocialLinks) => void
}

export default function SocialBadgeInput({ value, onChange }: SocialBadgeInputProps) {
  const updateField = (key: keyof SocialLinks, newValue: string) => {
    onChange({ ...value, [key]: newValue })
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-1">
        <Label className="text-sm">Patreon URL</Label>
        <Input
          type="url"
          value={value.patreon ?? ""}
          onChange={(event) => updateField("patreon", event.target.value)}
          placeholder="https://patreon.com/creator"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-sm">Twitter URL</Label>
        <Input
          type="url"
          value={value.twitter ?? ""}
          onChange={(event) => updateField("twitter", event.target.value)}
          placeholder="https://twitter.com/username"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-sm">Reddit URL</Label>
        <Input
          type="url"
          value={value.reddit ?? ""}
          onChange={(event) => updateField("reddit", event.target.value)}
          placeholder="https://reddit.com/r/community"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-sm">LinkedIn URL</Label>
        <Input
          type="url"
          value={value.linkedin ?? ""}
          onChange={(event) => updateField("linkedin", event.target.value)}
          placeholder="https://linkedin.com/in/profile"
        />
      </div>
    </div>
  )
}
