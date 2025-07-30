import React from 'react'
import { MobileSidebar } from './mobile-sidebar'
import { NavbarRoutes } from '@/components/ui/navbar-routes'

const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
        <MobileSidebar/>
        <div className="ml-auto">
        <NavbarRoutes />
      </div>
    </div>
  )
}

export default Navbar