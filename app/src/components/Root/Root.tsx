'use client'

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'

import './styles.css'
import Navbar from '../NavBar'
import BottomNav from '../BottomNav'

export function Root(props: PropsWithChildren) {
  return (
    <div className="root__loading">
      {props.children}

      <BottomNav />
    </div>
  )
}
