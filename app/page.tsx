import ClientCardGrid from './components/ClientCardGrid'
import { CardDetail } from './types/cardDetails'
import { PackJackpotCard } from './types/packJackpot'

async function getData() {
  const [jackpotRes, cardRes] = await Promise.all([
    fetch(
      'https://api.splinterlands.com/cards/pack_jackpot_overview?edition=14', {
      next: { revalidate: 3600 },
    }),
    fetch('https://api.splinterlands.com/cards/get_details', {
      next: { revalidate: 3600 },
    })
  ])

  const jackpotData: PackJackpotCard[] = await jackpotRes.json()
  const cardData: CardDetail[] = await cardRes.json()

  return { jackpotData, cardData }
}

export default async function HomePage() {
  const { jackpotData, cardData } = await getData()

  return <ClientCardGrid jackpotData={jackpotData} cardData={cardData} />
}
