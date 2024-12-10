const TodoIcon = ({ width = "40", height = "40" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height} className="text-current">
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#FF7043" />
    <rect x="10" y="10" width="70" height="70" rx="15" fill="#FFA726" />
    <rect x="5" y="5" width="70" height="70" rx="15" fill="#FFB74D" />
    <path d="M25 45 L40 60 L65 30" fill="none" stroke="#2E2E2E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default TodoIcon
