export const shake = (elem: HTMLElement) => {
  elem.focus()
  elem.classList.remove('shake')
  elem.classList.add('shake')
  setTimeout(() => elem.classList.remove('shake'), 500)
}
