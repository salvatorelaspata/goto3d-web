import type React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-2 mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400">© Copyright 2022. All Rights Reserved.</p>

          <div className="flex mt-3 -mx-2 sm:mt-0">
            <a href="#" className="mx-2 text-sm text-gray-400 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Teams </a>
            <a href="#" className="mx-2 text-sm text-gray-400 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Privacy </a>
            <a href="#" className="mx-2 text-sm text-gray-400 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Cookies </a>
          </div>
        </div>
      </div>
    </footer>
  )
}