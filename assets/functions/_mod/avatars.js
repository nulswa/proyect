const curve = {
girl_curve: "https://i.postimg.cc/T3NnVYJK/82264ae411c67da3f1a62fdb5a52a285.jpg",
girl2_curve: "https://i.postimg.cc/XYqCY6Sg/2873fcac7910be08779582c899dc410f.jpg",
girl3_curve: "https://i.postimg.cc/cHwYG7yJ/c371cb2bf477aaf20e95bd3dffd56275-webp.jpg",
girl4_curve: "https://i.postimg.cc/rsGSx1f2/24e2228d028e4440375c8ee32e1f4771.jpg"
}


const wide = {
girl_wide: "https://i.postimg.cc/SNX1LBxH/IMG-20260703-WA0048.jpg",
girl2_wide: "https://i.postimg.cc/PqKMnyqL/IMG-20260703-WA0051.jpg",
girl3_wide: "https://i.postimg.cc/9z3dYNL6/IMG-20260703-WA0049.jpg",
girl4_wide: "https://i.postimg.cc/25jKWVbc/IMG-20260703-WA0050.jpg"
}

const square = {
girl: "https://i.postimg.cc/X7hPs38p/3cbd1a932477cbeed5a278e575db2f84.jpg",
girl2: "https://i.postimg.cc/zfwPDh1j/39d1b51367098dd635982921a8048b0a-webp.jpg",
girl3: "https://i.postimg.cc/9MJ8Zj0J/d2f5ac781f46367e5950cecb0b5e1856.jpg",
girl4: "https://i.postimg.cc/c1kkJZP2/1ad84b9ab4a1e2ab17c7aab37fcff0a5-webp.jpg",
farguts: "https://i.postimg.cc/pTKxHCWj/e6raab7x15rne0cz0nx81zr38g-result-0.png"
}

function pickRandom(obj) {
  const values = Object.values(obj)
  if (!values.length) return null
  return values[Math.floor(Math.random() * values.length)]
}

const random = {
  get curve() { return pickRandom(curve) },
  get wide() { return pickRandom(wide) },
  get square() { return pickRandom(square) },
}

export const images = { curve, wide, square, random }

export const img = new Proxy({}, {
  get(_, key) {
    if (key in curve) return curve[key]
    if (key in wide) return wide[key]
    if (key in square) return square[key]
    return null
  },

  ownKeys() {
    return [
      ...Object.keys(curve),
      ...Object.keys(wide),
      ...Object.keys(square)
    ]
  },
  has(_, key) {
    return key in curve || key in wide || key in square
  },
})
