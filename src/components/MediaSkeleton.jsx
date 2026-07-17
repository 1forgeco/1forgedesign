export default function MediaSkeleton({ active = true, label = 'Loading motion' }) {
  return <div className={`media-skeleton ${active ? '' : 'media-skeleton--hidden'}`} aria-hidden={!active}>
    <div className="media-skeleton__glow"/>
    <img src="/brand/1forge-logo.png" alt=""/>
    <span>{label}</span>
  </div>
}
