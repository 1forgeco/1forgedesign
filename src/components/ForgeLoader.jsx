import { useEffect, useState } from 'react'

export default function ForgeLoader({ assets, onComplete }) {
  const [loaded, setLoaded] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const progress = Math.round((loaded / assets.length) * 100)

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = Date.now()
    let cursor = 0
    let completed = 0
    let finished = false
    let exitTimer

    const finish = () => {
      if (finished) return
      finished = true
      setLeaving(true)
      exitTimer = window.setTimeout(onComplete, 520)
    }

    const loadAsset = async (url) => {
      try {
        const response = await fetch(url, { cache: 'force-cache', signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to preload ${url}`)
        await response.blob()
      } catch (error) {
        if (error.name !== 'AbortError') console.warn(error.message)
      } finally {
        if (!controller.signal.aborted) {
          completed += 1
          setLoaded(completed)
        }
      }
    }

    const worker = async () => {
      while (cursor < assets.length && !controller.signal.aborted) {
        const assetIndex = cursor
        cursor += 1
        await loadAsset(assets[assetIndex])
      }
    }

    Promise.all([worker(), worker(), worker()]).then(() => {
      const minimumDisplay = Math.max(0, 1100 - (Date.now() - startedAt))
      window.setTimeout(finish, minimumDisplay)
    })

    const safetyTimer = window.setTimeout(finish, 16000)
    return () => {
      controller.abort()
      window.clearTimeout(safetyTimer)
      window.clearTimeout(exitTimer)
    }
  }, [assets, onComplete])

  return <div className={`forge-loader ${leaving ? 'forge-loader--leaving' : ''}`} role="status" aria-live="polite" aria-label={`Loading 1Forge Designs, ${progress}%`}>
    <div className="forge-loader__aura" aria-hidden="true"/>
    <div className="forge-loader__content">
      <img src="/brand/1forge-logo.png" alt="1Forge"/>
      <span>DESIGN COLLECTION</span>
      <div className="forge-loader__track"><i style={{ transform: `scaleX(${progress / 100})` }}/></div>
      <div className="forge-loader__meta"><small>FORGING THE EXPERIENCE</small><b>{progress.toString().padStart(2, '0')}%</b></div>
    </div>
  </div>
}
