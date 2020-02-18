<template>
  <div class="container">
    <div :class="{timeline: true, 'is-centered': isCentered}">
      <header class="timeline-header">
        <span class="tag is-medium is-success">Início</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            1960??
          </p>
          <p>Primeiros mergulhos na Laje de Santos</p>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">1992</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            19 de abril de 1992
          </p>
          <p>A embarcação Moreia é naufragada. É o primeiro naufrágio feito para prática de mergulho no Brasil.</p>
          <figure>
            <img src="~assets/images/laje/640px-Moreia.jpg">
            <figcaption class="attribution">
              <a
                href="https://commons.wikimedia.org/w/index.php?curid=40644070"
              >Rafa Tecchio - Own work, CC BY-SA 3.0</a>
            </figcaption>
          </figure>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">1993</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            27 de setembro de 1993
          </p>
          <p>Parque criado pelo decreto estadual n° 37.537. Passa a ser área de preservação, sendo proibida a pesca.</p>
          <figure>
            <img src="~assets/images/laje/Parque_Estadual_Marinho_da_Laje_de_Santos.jpg" alt="Parque Estadual, vista aérea">
            <figcaption class="attribution">
              <a href="https://commons.wikimedia.org/wiki/File:Parque_Estadual_Marinho_da_Laje_de_Santos.jpg">
                ALEXANDRE ANDREAZZI, CC BY-SA 4.0
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2003</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            2003
          </p>
          <p>Criado o <a href="https://www.lajeviva.org.br/">Instituto Laje Viva</a>, para ajudar na preservação das espécies marinhas do litoral paulista e brasileiro. </p>
          <figure>
            <img src="~assets/images/logos/lajeviva.jpg" alt="Instituto Laje Viva">
          </figure>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2009</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            2009
          </p>
          <p>Publicado o livro "Laje de Santos, Laje dos Sonhos".</p>
          <figure>
            <img src="~assets/images/laje/livroLajeDosSonhos.jpg">
          </figure>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2012</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading" />
          <p>Produzido o documentário Laje dos Sonhos</p>
          <iframe
            class="image"
            style="width: 560px; height: 315px; max-width: 100%;"
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/emBUPoyJ8Pk"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2017</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading" />
          <p>Mais bla</p>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2020</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading">
            2020
          </p>
          <p>Projeto "A Laje em Realidade Virtual".</p>
          <figure>
            <img src="~assets/images/logos/lajevr1024clear.png" alt="Laje de Santos em Realidade Virtual">
          </figure>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-medium is-success">Hoje</span>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCentered: false
    };
  },

  mounted () {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  methods: {
    onResize () {
      this.isCentered = (window.innerWidth > 768);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/bulma.scss";
@import "~bulma-timeline";

figure {
  position: relative;
}
.timeline {
  margin: 5em 0;
}
.heading {
  font-family: $title-family;
  font-size: 1.2em;
  font-feature-settings: "lnum";
}
</style>
