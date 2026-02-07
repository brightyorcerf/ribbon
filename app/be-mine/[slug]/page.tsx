import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import LandingPage from '@/components/LandingPage'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function BeMinePage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch the link data from database
  const { data: link, error } = await supabase
    .from('links')
    .select('*')
    .eq('slug', slug)
    .single()

  // If link doesn't exist, show 404
  if (error || !link) {
    notFound()
  }

  // Pass the data to our client component
  return <LandingPage link={link} />
}