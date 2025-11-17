import './tag.css'

export default function Tag({color, tag}) {
  return (
    <div className='tag-container' style={{
      border: `0.05rem solid ${color}`,
      backgroundColor: `${color}10`
      }}>
      {tag}
    </div>
  )
}