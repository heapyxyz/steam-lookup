import "./level.css"
import { jsx } from "react/jsx-runtime"

export function Level({ level }: { level?: number }) {
  if (!level) return ""
  if (level < 0) return ""
  if (level > 5299) return ""

  const size = 32

  return jsx("div", {
    className: `profileLevel ${getLevelClass(level)}`,
    style: {
      fontSize: `${level < 100 ? size / 1.75 : size / 2.28}px`,
      height: `${size}px`,
      width: `${size}px`,
      lineHeight: `${level < 100 ? size - 5 : size}px`,
      backgroundSize: `${size}px`,
      backgroundPosition: `0 ${-size * Math.trunc((level % 100) / 10)}px`,
    },
    children: jsx("span", {
      className: "profileLevelNum",
      children: level,
    }),
  })
}

function getLevelClass(level: number) {
  const lvl = Math.floor(level / 100) * 100 || Math.floor(level / 10) * 10
  const lvl_plus = Math.floor((level - lvl) / 10) * 10
  if (lvl < 100) return `lvl_${lvl}`
  return `lvl_${lvl} lvl_plus_${lvl_plus}`
}
