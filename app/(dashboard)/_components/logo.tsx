import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (

        <Image
          src="/logo.svg"
          alt="Logo"
          width={130}
          height={130}
          />
   
  )
}

export default Logo