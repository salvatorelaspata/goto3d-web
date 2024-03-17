interface GridProps {
    cols: number;
    children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ cols, children }) => {
    return (
        <div className={`grid grid-cols-1 gap-4
            md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2`}>
            {children}
        </div>
    )
}