import { ref, onUnmounted } from 'vue'

export const useDetailTransition = () => {
  const selectedCardRect = ref(null)
  const previousBodyOverflow = ref('')

  const reduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const getPanel = (element) => {
    return element.querySelector('.weather-detail-modal')
  }

  const createTransform = (sourceRect, targetRect) => {
    if (!sourceRect) {
      return {
        transform: 'scale(0.72)',
        transformOrigin: 'center',
      }
    }

    const translateX = sourceRect.left - targetRect.left

    const translateY = sourceRect.top - targetRect.top

    const scaleX = sourceRect.width / targetRect.width

    const scaleY = sourceRect.height / targetRect.height

    return {
      transform: `
        translate(${translateX}px, ${translateY}px)
        scale(${scaleX}, ${scaleY})
      `,
      transformOrigin: 'top left',
    }
  }

  const waitForAnimations = (animations, done) => {
    Promise.allSettled(animations.map((animation) => animation.finished)).then(done)
  }

  const prepareDetailTransition = (payload) => {
    selectedCardRect.value = typeof payload === 'string' ? null : payload.rect

    previousBodyOverflow.value = document.body.style.overflow

    document.body.style.overflow = 'hidden'
  }

  const enterDetail = (element, done) => {
    const panel = getPanel(element)

    if (!panel || reduceMotion()) {
      done()
      return
    }

    const endRect = panel.getBoundingClientRect()

    const start = createTransform(selectedCardRect.value, endRect)

    panel.style.transformOrigin = start.transformOrigin

    const backdropAnimation = element.animate([{ opacity: 0.55 }, { opacity: 1 }], {
      duration: 240,
      easing: 'ease-out',
      fill: 'both',
    })

    const panelAnimation = panel.animate(
      [
        {
          opacity: 0.96,
          transform: start.transform,
          borderRadius: '28px',
        },
        {
          opacity: 1,
          transform: 'translate(0, 0) scale(1, 1)',
          borderRadius: '34px',
        },
      ],
      {
        duration: 460,
        easing: 'cubic-bezier(0.2, 0.86, 0.25, 1)',
        fill: 'both',
      },
    )

    waitForAnimations([backdropAnimation, panelAnimation], done)
  }

  const leaveDetail = (element, done) => {
    const panel = getPanel(element)

    if (!panel || reduceMotion()) {
      done()
      return
    }

    const panelRect = panel.getBoundingClientRect()

    const end = createTransform(selectedCardRect.value, panelRect)

    panel.style.transformOrigin = end.transformOrigin

    const backdropAnimation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 280,
      easing: 'ease-in',
      fill: 'both',
    })

    const panelAnimation = panel.animate(
      [
        {
          opacity: 1,
          transform: 'translate(0, 0) scale(1, 1)',
          borderRadius: '34px',
        },
        {
          opacity: 0.92,
          transform: end.transform,
          borderRadius: '28px',
        },
      ],
      {
        duration: 360,
        easing: 'cubic-bezier(0.45, 0, 0.75, 0.25)',
        fill: 'both',
      },
    )

    waitForAnimations([backdropAnimation, panelAnimation], done)
  }

  const afterDetailLeave = () => {
    document.body.style.overflow = previousBodyOverflow.value

    selectedCardRect.value = null
  }

  onUnmounted(() => {
    document.body.style.overflow = previousBodyOverflow.value
  })

  return {
    prepareDetailTransition,
    enterDetail,
    leaveDetail,
    afterDetailLeave,
  }
}
