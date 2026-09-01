export const focus = (app) => {
  app.directive('focus', focusDirective)
}

const focusDirective = {
  mounted: (el) => {
    const target = el.querySelector('input')
    if (target) {
      target.focus()
    }
  },
}