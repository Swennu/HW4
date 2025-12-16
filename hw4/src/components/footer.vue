<template>
  <footer
    class="site-footer"
    :class="{ visible: isAtBottom }"
  >
    <p>© 2025 WebDev</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",

  data() {
    return {
      isAtBottom: false
    }
  },

  mounted() {
    this.checkScroll()
    window.addEventListener("scroll", this.checkScroll)
    window.addEventListener("resize", this.checkScroll)
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.checkScroll)
    window.removeEventListener("resize", this.checkScroll)
  },

  watch: {
    // 🔑 Re-check footer visibility on route change
    $route() {
      this.$nextTick(() => {
        this.checkScroll()
      })
    }
  },

  methods: {
    checkScroll() {
      const pageHeight =
        document.documentElement.scrollHeight

      const viewportHeight =
        window.innerHeight

      // If page is NOT scrollable → show footer
      if (pageHeight <= viewportHeight) {
        this.isAtBottom = true
        return
      }

      // Otherwise, only show at true bottom
      const scrollPosition =
        window.scrollY + viewportHeight

      this.isAtBottom = scrollPosition >= pageHeight - 1
    }
  }
}
</script>

<style scoped>
.site-footer {
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  background-color: #e0e0e0;

  padding: 16px;
  text-align: center;

  transform: translateY(100%);
  transition: transform 0.25s ease;
}

.site-footer.visible {
  transform: translateY(0);
}
</style>
