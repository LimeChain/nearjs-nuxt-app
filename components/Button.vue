<template>
  <button
    :class="[buttonClass, customClass]"
    :style="customStyle"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "button",
    },
    customClass: {
      type: [String, Array, Object],
      default: "",
    },
  },
  computed: {
    buttonClass() {
      return `btn`;
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style scoped>
.btn {
  background-color: #27ae60;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #219a52;
}
</style>
