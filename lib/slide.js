export default {
  up(el, duration = 400) {
    return new Promise((res) => {
      el.style.overflow = `hidden`
      el.style.display = `block`
      el.style.transition = `height ${duration}ms ease-in-out`
      el.style.height = el.clientHeight +'px'
      setTimeout(() => {
        el.style.height = '0px'
      }, 1)
      setTimeout(() => {
        el.style.display = `none`
        res()
      }, duration)
    })
  },
  
  down(el, duration = 400) {
    return new Promise((res) => {

      el.style.overflow = `hidden`
      el.style.transition = `height ${duration}ms ease-in-out`
      const targetHeight = this.getHeight(el) + 'px'
      el.style.display = `block`
      el.style.height = '0px'
      
      setTimeout(() => {
        el.style.height = targetHeight
      }, 1)
        
      setTimeout(() => {
        el.style.display = `block`
        el.style.overflow = `initial`
        res()
      }, duration)
    })
  },

  getHeight(el) {
    const el_style = window.getComputedStyle(el)
    const el_display = el_style.display
    const el_position = el_style.position
    const el_visibility = el_style.visibility
    const el_max_height = el_style.maxHeight.replace('px', '').replace('%', '')

    let wanted_height = 0

    if(el_display !== 'none' && el_max_height !== '0') {
        return el.offsetHeight
    }

    el.style.position = 'absolute'
    el.style.visibility = 'hidden'
    el.style.display = 'block'

    wanted_height = el.scrollHeight

    el.style.display = el_display
    el.style.position = el_position
    el.style.visibility = el_visibility

    return wanted_height
}
}