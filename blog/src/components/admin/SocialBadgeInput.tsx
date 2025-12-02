"use client";

import type { SocialLinks } from '@/data/posts';

type SocialBadgeInputProps = {
  value: SocialLinks;
  onChange: (links: SocialLinks) => void;
};

export default function SocialBadgeInput({ value, onChange }: SocialBadgeInputProps) {
  const updateField = (key: keyof SocialLinks, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Social badges</h3>
        <p className="text-xs text-gray-500">Optional links for badges on posts.</p>
      </div>
      <label className="grid gap-1 text-sm text-gray-800">
        Patreon URL
        <input
          type="url"
          value={value.patreon ?? ''}
          onChange={(event) => updateField('patreon', event.target.value)}
          placeholder="https://patreon.com/creator"
          className="rounded-lg border border-gray-200 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm text-gray-800">
        Twitter URL
        <input
          type="url"
          value={value.twitter ?? ''}
          onChange={(event) => updateField('twitter', event.target.value)}
          placeholder="https://twitter.com/username"
          className="rounded-lg border border-gray-200 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm text-gray-800">
        Reddit URL
        <input
          type="url"
          value={value.reddit ?? ''}
          onChange={(event) => updateField('reddit', event.target.value)}
          placeholder="https://reddit.com/r/community"
          className="rounded-lg border border-gray-200 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm text-gray-800">
        LinkedIn URL
        <input
          type="url"
          value={value.linkedin ?? ''}
          onChange={(event) => updateField('linkedin', event.target.value)}
          placeholder="https://linkedin.com/in/profile"
          className="rounded-lg border border-gray-200 px-3 py-2"
        />
      </label>
    </div>
  );
}
