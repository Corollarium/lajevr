<template>
  <client-only>
    <span
      v-translate
      :translate-n="translateN"
      :translate-plural="translatePlural"
      :translate-context="translateContext"
      :translate-comment="translateComment"
    >
      <slot />
    </span>
  </client-only>
</template>

<script>
/**
 * This handles the SSR problem with vue-gettext by wrapping with client-only.
 */
export default {
  props: {
    // Always use v-bind for dynamically binding the `translateN` prop to data on the parent,
    // i.e.: `:translateN`.
    translateN: {
      type: Number,
      default: undefined,
      required: false
    },
    translatePlural: {
      type: String,
      default: undefined,
      required: false
    },
    translateContext: {
      type: String,
      default: undefined,
      required: false
    },
    // translateParams: {
    //   type: Object,
    //   required: false
    // },
    // `translateComment` is used exclusively by `easygettext`'s `gettext-extract`.
    translateComment: {
      type: String,
      default: null,
      required: false
    }
  }
};
</script>
<style lang="less" scoped>
</style>
