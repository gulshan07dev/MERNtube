import React from 'react'
import {Link} from "react-router-dom"

export default function Logo() {
  return (
    <Link to="/" className="md:w-[170px] w-[130px]">
      <img src="/logo.png" alt="Logo" />
    </Link>
  );
}
