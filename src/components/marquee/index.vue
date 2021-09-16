<template>
  <div class="vl-marquee embla" ref="container">
    <div class="embla__container">
      <div v-for="(slide, index) in slides" class="embla__slide">
        <slot :slide="slide" :index="index" :key="index" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel'
import './index.scss'

const { slides } = defineProps({
  slides: {
    type: Array,
    required: true,
  },
})

const options = {
  loop: true,
  draggable: true,
  dragFree: true,
}
const container = ref<HTMLDivElement>()
const embla = ref<EmblaCarouselType>()
const raf = ref<number>(0)

const start = () => {
  if (!container.value) return
  const ec = embla.value = EmblaCarousel(container.value, options)
  ec.reInit()
  ec.on('pointerDown', stopAutoScroll)
  ec.on('pointerUp', () => ec.clickAllowed() && startAutoScroll())
  ec.on('settle', startAutoScroll)
  startAutoScroll()
}

defineExpose({
  start,
})

// https://github.com/davidcetinkaya/embla-carousel/issues/114
function animate () {
  const ec = embla.value
  if (!ec) return
  const engine = ec.dangerouslyGetEngine()
  engine.location.add(-0.4)
  engine.target.set(engine.location)
  // @ts-ignore
  engine.scrollLooper.loop([engine.location, engine.target], -1)
  // @ts-ignore
  engine.slideLooper.loop(ec.slideNodes())
  engine.translate.to(engine.location)
  raf.value = requestAnimationFrame(animate)
}

function startAutoScroll () {
  raf.value = requestAnimationFrame(animate)
}

function stopAutoScroll () {
  cancelAnimationFrame(raf.value)
  raf.value = 0
}

onMounted(() => {
})

onBeforeUpdate(() => {
  stopAutoScroll()
})

onUpdated(() => {
  embla.value?.reInit(options)
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
  embla.value?.destroy()
  embla.value = undefined
})

</script>
<style lang="scss">
.vl-marquee {
  .embla {
    max-width: 100%;
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    margin-right: 32px;
    position: relative;
  }
}
</style>
