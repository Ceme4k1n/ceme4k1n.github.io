import { log } from 'console'

const $circle = document.querySelector('#circle') as HTMLElement
const $score = document.querySelector('#score') as HTMLElement
const $progress = document.getElementById('progress') as HTMLElement
const $telegram = window.Telegram.WebApp
const heading = document.getElementById('my-heading') as HTMLElement

function start() {
  setScore(getScore())
}

function setScore(score: number) {
  localStorage.setItem('score', score.toString()) // Приводим score к строке
  $score.textContent = score.toString() // Отображаем число как строку
}
function getScore() {
  return Number(localStorage.getItem('score')) ?? 0
}

function addOne() {
  setScore(getScore() + 1)
}

function minusProgressBar(value: number) {
  if ($progress) {
    const currentWidth = parseFloat($progress.style.width) || 100
    const newWidth = Math.max(0, currentWidth - value)
    $progress.style.width = newWidth + '%'
  }
}

if ($circle) {
  $circle.addEventListener('click', (event) => {
    const rect = $circle.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2

    const DEG = 60

    const tiltX = (offsetY / rect.height) * -DEG // Изменил на offsetY для более корректного расчета
    const tiltY = (offsetX / rect.width) * DEG

    // Устанавливаем переменные для CSS
    $circle.style.setProperty('--tiltX', `${tiltX}deg`)
    $circle.style.setProperty('--tiltY', `${tiltY}deg`)

    // Возврат к исходному состоянию через 0.5 секунды
    setTimeout(() => {
      $circle.style.setProperty('--tiltX', '0deg')
      $circle.style.setProperty('--tiltY', '0deg')
    }, 500)

    const plusOne = document.createElement('div')
    plusOne.classList.add('plus-one')
    plusOne.textContent = '+1'
    plusOne.style.left = `${event.clientX - rect.left}px`
    plusOne.style.top = `${event.clientY - rect.top}px`

    $circle.parentElement?.appendChild(plusOne)

    addOne()

    minusProgressBar(10)
    console.log($telegram.initDataUnsafe.user.first_name)

    setTimeout(() => {
      plusOne.remove()
    }, 2000)
  })
}
window.addEventListener('DOMContentLoaded', start)
window.onload = function () {
  // Устанавливаем готовность приложения
  $telegram.ready()

  // Переводим приложение в полноэкранный режим
  $telegram.expand()
  heading.textContent = $telegram.initDataUnsafe.user.id
}
