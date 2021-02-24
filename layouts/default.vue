<template>
  <Nuxt class="container" />
</template>

<style>
html, body {
  font-family:
    'Noto Sans TC',
    -apple-system,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  @apply bg-black;
}

body, html, #__nuxt,#__layout {
  height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
}
</style>
