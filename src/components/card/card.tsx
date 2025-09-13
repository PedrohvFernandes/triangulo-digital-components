type CardProps = {
  title: string
  description: string
}

export const Card = ({ title, description }: CardProps) => {
  return (
    <div className="triangulodigital">
      <div className="triangulodigital:bg-white triangulodigital:rounded-lg triangulodigital:shadow-lg triangulodigital:overflow-hidden sm:max-w-xs lg:max-w-sm xl:max-w-md text">
        <div className="triangulodigital:px-6 triangulodigital:py-4">
          <h2 className="triangulodigital:font-sans triangulodigital:text-red-700 triangulodigital:font-bold triangulodigital:text-xl triangulodigital:mb-2">
            {title}
          </h2>
          <p className="triangulodigital:bg-white triangulodigital:border-none triangulodigital:rounded-none triangulodigital:font-sans triangulodigital:text-gray-700 triangulodigital:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
