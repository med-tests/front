export const clickOutside = (app) => {
  app.directive('click-outside', {
    mounted: (el, binding) => {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event.target)
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: el => {
      document.removeEventListener('click', el.clickOutsideEvent)
    },
  })
}