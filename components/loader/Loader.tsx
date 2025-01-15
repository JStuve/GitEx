import { Loader2 } from 'lucide-react'
import './Loader.scss'
import clsx from 'clsx'
import { type ReactNode } from 'react'

function Loader (): ReactNode {
  return (
    <div className={clsx('loader')}>
      <Loader2 />
    </div>

  )
}

export default Loader
