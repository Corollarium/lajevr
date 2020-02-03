<template>
  <div>
    <select
      v-model="$language.current"
      name="language"
    >
      <option v-for="(language, key) in $language.available" :value="key">
        {{ language }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  // TODO: window.localStorage.setItem('language', $language.current);
};
</script>
