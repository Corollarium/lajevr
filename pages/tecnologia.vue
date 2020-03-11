<template>
  <article class="container">
    <h1>
      <i18n>Tecnologia</i18n>
    </h1>

    <section class="section" bp="grid 12 6@md">
      <div data-aos="slide-right">
        <h2>
          <i18n>
            Adquirindo dados
          </i18n>
        </h2>
        <p>
          <i18n>
            Este projeto buscou dados sobre a Laje de Santos de todas as formas possíveis. Desde fontes
            abertas como a <a href="https://commons.wikimedia.org">Wikimedia Commons</a>, passando
            por instituições como o Instituto Laje Viva e mergulhadores na internet que forneceram
            gentilmente suas fotos. Mas mais do que isso, precisamos ir até a Laje de Santos para
            tirar fotos e vídeos específicas para este projeto com mergulhadores experientes.
          </i18n>
        </p>

        <div class="number-wrapper">
          <number-bullet
            :to="0"
            :icon="['fas', 'mask']"
          >
            <i18n>mergulhos</i18n>
          </number-bullet>

          <number-bullet
            :to="2"
            :icon="['fas', 'users']"
          >
            <i18n>mergulhadores</i18n>
          </number-bullet>

          <number-bullet
            :to="0"
            :icon="['fas', 'clock']"
          >
            <i18n>horas de mergulho</i18n>
          </number-bullet>
        </div>
      </div>
      <div data-aos="zoom-out-down">
        <img src="~/assets/images/placeholder480.png">
      </div>
    </section>

    <section class="section" bp="grid 12 6@md">
      <div data-aos="zoom-out-down">
        <img src="~/assets/images/placeholder480.png">
      </div>
      <div data-aos="slide-right">
        <h2>
          <i18n>
            Desenvolvimento
          </i18n>
        </h2>
        <p>
          <i18n>
            Este site usa as tecnologias mais atuais da internet para ser interativo, imersivo e acessível.
            Desde um celular até telas gigantes.
          </i18n>
        </p>
        <div class="number-wrapper">
          <number-bullet
            :to="53"
            :icon="['fas', 'images']"
          >
            <i18n>imagens</i18n>
          </number-bullet>

          <number-bullet
            :to="0"
            :icon="['fas', 'video']"
          >
            <i18n>vídeos</i18n>
          </number-bullet>

          <number-bullet
            :to="5"
            :icon="['fas', 'cubes']"
          >
            <i18n>modelos 3D</i18n>
          </number-bullet>
          <number-bullet
            :to="12622"
            :icon="['fas', 'code']"
          >
            <i18n>linhas de código</i18n>
          </number-bullet>
        </div>
      </div>
    </section>

    <section class="section" bp="grid 12 6@md">
      <div data-aos="slide-left">
        <h2>
          Realidade virtual
        </h2>
        <p>
          <i18n>
            A tecnologia para gerar as áreas de realidade virtual inclui vários processos e conhecimentos.
            Para os modelos da Laje, tanto em cima quanto embaixo d'água, usamos fotos de referência que
            foram processadas por software. Muitos itens foram modelados à mão, como os peixes e aves,
            para terem qualidade, animação mas serem leves o suficiente para a web.
          </i18n>
        </p>
        <div class="number-wrapper">
          <number-bullet
            :to="X"
            :icon="['fas', 'camera']"
          >
            <i18n>fotografias</i18n>
          </number-bullet>
          <number-bullet
            :to="X"
            :icon="['fas', 'video']"
          >
            <i18n>horas de vídeo</i18n>
          </number-bullet>
          <number-bullet
            :to="X"
            :icon="['fas', 'hdd']"
          >
            <i18n>horas de processamento</i18n>
          </number-bullet>

          <number-bullet
            :to="X"
            :icon="['fas', 'save']"
          >
            <i18n>GB de dados</i18n>
          </number-bullet>
        </div>
      </div>
      <div data-aos="zoom-out-down">
        <img src="~/assets/images/placeholder480.png">
      </div>
    </section>
  </article>
</template>

<script>
import page from './page.vue';

export default {
  extends: page,

  mounted () {
    this.head.title = this.$gettext('Tecnologia');
    this.head.description = this.$gettext('Tecnologia usada para o simulador de realidade virtual na Laje de Santos');
  }
};
</script>

<style></style>
