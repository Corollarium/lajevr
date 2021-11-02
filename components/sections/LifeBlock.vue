<template>
  <section class="section-container container">
    <h3>
      {{ name }}
    </h3>

    <div bp="grid vertical-center">
      <div bp="12 6@md" data-aos="fade-up">
        <div class="especie-info text-block">
          <p>
            <i18n>Espécie</i18n>: {{ latin }}
          </p>
          <p><i18n>Estado de conservação</i18n>: {{ conservation }}</p>
          <slot name="box" />
        </div>
      </div>

      <div v-if="hasDescriptionSlot" class="text-block-b" bp="12 6@md" data-aos="fade-down">
        <slot name="description" />
      </div>
    </div>

    <slot name="header" />

    <div v-if="this.$slots.default" class="life-block" bp="grid container">
      <div class="text-block-b" bp="12 6@md">
        <slot />
      </div>
      <slot name="side-text" />
    </div>

    <slot name="footer" />
  </section>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    latin: {
      type: String,
      required: true
    },
    conservation: {
      type: String,
      required: true
    }
  },

  computed: {
    hasDescriptionSlot () {
      return !!this.$slots.description;
    }
  }

};
</script>

<style>
</style>
