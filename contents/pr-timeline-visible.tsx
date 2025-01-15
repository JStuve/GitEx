import { type ReactNode } from 'react'
import './issue-visible.scss'
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://github.com/*/*/pull/*']
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.querySelector('.TimelineItem') as Element

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = `
    .gitkit-button-group {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      align-items: center;
      gap: var(--control-small-gap);
      border-color: var(--borderColor-default);
      border-style: solid;
      border-radius: var(--borderRadius-medium);
      border-width: var(--borderWidth-thin);
      margin-top: 0.5rem;
      padding: 0.5rem;
    }

    .gitkit-button {
      all: unset;
      font-size: 14px;
      padding: 6px 12px;
      color: var(--fgColor-muted, var(--color-fg-muted));
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    }

    .gitkit-button:hover {
      color: var(--fgColor-default, var(--color-fg-default));
    }

    .gitkit-button--active {
      color: var(--fgColor-default, var(--color-fg-default));
      font-weight: var(--base-text-weight-semibold, 600);
    }
    
    .gitkit-button:focus {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }
  
  `
  return style
}

export default function FilterButton (): ReactNode {
  return (
    <div className='gitkit-button-group'>
      <button className='gitkit-button gitkit-button--active' title='Display all PR timeline events'>Show all</button>
      {/* <button className='gitkit-button' title='Hides manually hidden timeline events'>Show active</button> */}
      <button className='gitkit-button' title='Shows only open reviews'>Show open reviews</button>
    </div>
  )
}
