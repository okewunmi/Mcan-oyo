import { createClient } from '@/lib/supabase'

export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
  const supabase = createClient()
  const ext  = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('mcan-images')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('Upload error:', error.message)
    return null
  }

  const { data } = supabase.storage.from('mcan-images').getPublicUrl(path)
  return data.publicUrl
}