import React from 'react'
import {Link} from "react-router-dom"

export default function Logo({className}) {
  return (
    <Link to="/" className={`${className} block md:w-[170px] w-[130px]`}>
      <img src="/logo.png" alt="Logo" />
    </Link>
  );
}
