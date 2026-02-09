import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params

  return {
    title: 'Ribbon, Make Your Ask 💌',
    description: 'Someone made you something special',
    openGraph: {
      title: 'Ribbon, Make Your Ask 💌',
      description: 'Someone made you something special',
      url: `https://ribbonn.vercel.app/be-mine/${slug}`,
      images: [
        {
          url: 'https://ribbonn.vercel.app/og.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://ribbonn.vercel.app/og.jpg'],
    },
  }
}

export default async function BeMinePage({ params }: PageProps) {
  const { slug } = await params

  const { data: link, error } = await supabase
    .from('links')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !link) {
    notFound()
  }

  return <LandingPage link={link} />
}
