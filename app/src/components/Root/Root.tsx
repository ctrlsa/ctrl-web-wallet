'use client'

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'

import './styles.css'
import Navbar from '../NavBar'
import BottomNav from '../BottomNav'

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.

  return (
    <div className="root__loading">
      {props.children}

      <BottomNav />
    </div>
  )
}
