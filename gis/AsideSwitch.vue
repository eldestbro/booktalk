<template>
  <label class="form-check-toggle">
    <span class="txt ko">한국어</span>
    <input type="checkbox"
           :value="value"
           :checked="isChecked"
           @change="handleChange">
    <span class="bg"></span>
    <span class="txt eng">English</span>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    value: {
      default: true
    },
    uncheckedValue: {
      default: false
    },
    checked: {
      default: false
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    isChecked () {
      if (localStorage.getItem('language') === 'en') {
        this.$props.value = false
      }
      return this.checked === this.value
    },
    isOn () {
      return !this.on ? null : true
    }
  },
  methods: {
    handleChange ({ target: { checked } }) {
      this.$emit('change', checked ? this.value : this.uncheckedValue)
      if (checked === true) {
        this.$store.dispatch('changeLanguage', 'en')
      } else {
        this.$store.dispatch('changeLanguage', 'ko')
      }
      setTimeout(function () {
        window.location.reload()
      }, 600)
    }
  }
}
</script>
