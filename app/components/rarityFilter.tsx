'use client'
import Image from 'next/image'

interface Props {
  selected: number[]
  onToggle: (rarity: number) => void
}

const rarityIcons: Record<number, string> = {
  1: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_common_new.svg',
  2: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_rare_new.svg',
  3: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_epic_new.svg',
  4: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_legendary_new.svg',
}

const rarityNames: Record<number, string> = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
}

export default function RarityFilter({ selected, onToggle }: Props) {
  return (
    <div className="flex gap-4 items-center justify-start mb-4">
      {([1, 2, 3, 4] as const).map((rarity) => (
        <button
          key={rarity}
          onClick={() => onToggle(rarity)}
          className={`flex flex-col items-center p-1 rounded transition ${
            selected.includes(rarity) ? 'ring-2 ring-yellow-400' : 'opacity-80 hover:opacity-100'
          }`}
          title={rarityNames[rarity]}
        >
        <Image 
          src={rarityIcons[rarity]} 
          alt={rarityNames[rarity]} 
          width={100}
          height={150}
        />
          <span className="text-xs mt-1">{rarityNames[rarity]}</span>
        </button>
      ))}
    </div>
  )
}
