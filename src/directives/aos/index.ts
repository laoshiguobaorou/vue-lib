import aos, { anchorPlacementOptions, easingOptions } from 'aos'
import { capitalize, Directive, DirectiveBinding, warn } from 'vue'

export interface AosConfig {
  /**
   * Defines which position of the element regarding to window should trigger the animation
   */
  anchorPlacement?: anchorPlacementOptions | undefined;
  /**
   * Values from 0 to 3000, with step 50ms
   */
  delay?: number | undefined;
  /**
   * Values from 0 to 3000, with step 50ms
   */
  duration?: number | undefined;
  /**
   * Default easing for AOS animations
   */
  easing?: easingOptions | undefined;
  /**
   * Whether elements should animate out while scrolling past them
   */
  mirror?: boolean | undefined;
  /**
   * Offset (in px) from the original trigger point
   */
  offset?: number | undefined;
  /**
   * Whether animation should happen only once - while scrolling down
   */
  once?: boolean | undefined;
}

export default {
  mounted (el, binding) {
    if (el.dataset.aos) {
      warn('element already has aos config')
    }
    parseValues(el, binding)
  },
  updated (el, binding) {
    parseValues(el, binding)
    aos.refresh()
  },
  unmounted (el) {
    delete el.dataset.aos
    aos.refresh()
  },
} as Directive<HTMLElement, AosConfig>

const parseValues = (el: HTMLElement, binding: DirectiveBinding<AosConfig>) => {
  for (let datasetKey in el.dataset) {
    if (datasetKey.startsWith('aos')) {
      delete el.dataset[datasetKey]
    }
  }
  el.dataset.aos = binding.arg
  for (const [name, value] of Object.entries(binding.value || {})) {
    if (typeof value !== 'undefined') {
      el.dataset[`aos${capitalize(name)}`] = String(value)
    }
  }
}

