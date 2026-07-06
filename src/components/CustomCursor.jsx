import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A targeting-reticle cursor: four corner brackets that float around the pointer
// at rest, then snap outward to lock onto whatever interactive element you're
// hovering — like a camera autofocus box or a game HUD selection indicator.

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [role="button"], label'
const PAD = 8 // gap between bracket and a locked element's edge
const ARM = 13 // length of each bracket's two arms
const IDLE_SIZE = 34 // size of the floating box when not hovering anything

const SPRING = { stiffness: 380, damping: 32, mass: 0.5 }

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [locked, setLocked] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const tlX = useMotionValue(-100)
  const tlY = useMotionValue(-100)
  const trX = useMotionValue(-100)
  const trY = useMotionValue(-100)
  const blX = useMotionValue(-100)
  const blY = useMotionValue(-100)
  const brX = useMotionValue(-100)
  const brY = useMotionValue(-100)

  const sTlX = useSpring(tlX, SPRING)
  const sTlY = useSpring(tlY, SPRING)
  const sTrX = useSpring(trX, SPRING)
  const sTrY = useSpring(trY, SPRING)
  const sBlX = useSpring(blX, SPRING)
  const sBlY = useSpring(blY, SPRING)
  const sBrX = useSpring(brX, SPRING)
  const sBrY = useSpring(brY, SPRING)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isFinePointer)
    if (!isFinePointer) return

    const handleMove = (e) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      setVisible(true)

      const target = e.target.closest?.(INTERACTIVE_SELECTOR)
      if (target) {
        const r = target.getBoundingClientRect()
        tlX.set(r.left - PAD)
        tlY.set(r.top - PAD)
        trX.set(r.right + PAD - ARM)
        trY.set(r.top - PAD)
        blX.set(r.left - PAD)
        blY.set(r.bottom + PAD - ARM)
        brX.set(r.right + PAD - ARM)
        brY.set(r.bottom + PAD - ARM)
        setLocked(true)
      } else {
        const half = IDLE_SIZE / 2
        tlX.set(e.clientX - half)
        tlY.set(e.clientY - half)
        trX.set(e.clientX + half - ARM)
        trY.set(e.clientY - half)
        blX.set(e.clientX - half)
        blY.set(e.clientY + half - ARM)
        brX.set(e.clientX + half - ARM)
        brY.set(e.clientY + half - ARM)
        setLocked(false)
      }
    }
    const handleLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMove)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  if (!enabled) return null

  const colorClass = locked ? 'border-ember' : 'border-scarlet/60'

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.15s ease' }}>
      {/* exact pointer position, no lag — gives precise feedback under the reticle */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1 w-1 rounded-full bg-scarlet"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />

      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-[13px] w-[13px] rounded-tl-[3px] border-t-2 border-l-2 ${colorClass} transition-colors duration-150`}
        style={{ x: sTlX, y: sTlY }}
      />
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-[13px] w-[13px] rounded-tr-[3px] border-t-2 border-r-2 ${colorClass} transition-colors duration-150`}
        style={{ x: sTrX, y: sTrY }}
      />
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-[13px] w-[13px] rounded-bl-[3px] border-b-2 border-l-2 ${colorClass} transition-colors duration-150`}
        style={{ x: sBlX, y: sBlY }}
      />
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-[13px] w-[13px] rounded-br-[3px] border-b-2 border-r-2 ${colorClass} transition-colors duration-150`}
        style={{ x: sBrX, y: sBrY }}
      />
    </div>
  )
}
