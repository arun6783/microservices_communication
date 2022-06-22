function getRandomCity() {
  const cities = [
    { city: 'delhi', code: 'DEL' },
    { city: 'chennai', code: 'MAA' },
    { city: 'athens', code: 'ATH' },
    { city: 'rome', code: 'ROM' },
    { city: 'Cairo', code: 'CAI' },
  ]
  return cities[Math.floor(Math.random() * cities.length)]
}
exports.getRandomCity = getRandomCity
