export async function notifySubscribers(
  title: string,
  message: string,
  path: string,
  imageUrl?: string
): Promise<void> {
  try {
    // Always use production URL — never localhost
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        message,
        url: `${baseUrl}${path}`,
        imageUrl,
      }),
    })
  } catch (err) {
    console.error('Failed to send notification:', err)
  }
}