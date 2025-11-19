export interface CardProps {
  title: React.ReactNode;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  className = '',
  children
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
      {icon && (
        <div className="mb-4 text-[#002040]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-[#002040] mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
};