export function Logo({ width = 200 }: { width?: number }) {
  return (
    <div className="brand-logo">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Štullers" width={width} />
      <span>Home</span>
    </div>
  )
}
