import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Youtube } from 'lucide-react'

interface YouTubeReviewSectionProps {
  videoIds: string[]
}

export function YouTubeReviewSection({ videoIds }: YouTubeReviewSectionProps) {
  const [activeVideo, setActiveVideo] = useState(0)

  if (videoIds.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Top Video Reviews</h2>
          <p className="text-sm text-slate-500">{videoIds.length} review{videoIds.length > 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Main Video Player */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-4">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoIds[activeVideo]}`}
          title="YouTube video review"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Video Thumbnails */}
      {videoIds.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {videoIds.map((id, index) => (
            <button
              key={id}
              onClick={() => setActiveVideo(index)}
              className={`relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeVideo
                  ? 'border-red-500 shadow-lg'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <img
                src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                alt={`Video ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index !== activeVideo && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.section>
  )
}
