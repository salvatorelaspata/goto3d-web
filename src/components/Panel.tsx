interface PanelProps {
  children: React.ReactNode,
  inline?: boolean
}

const Panel: React.FC<PanelProps> = ({ children, inline }) => (
  <div className={`bg-violet-100 p-4 rounded-lg shadow-lg ${inline && 'flex'}`}>
    {children}
  </div>
)