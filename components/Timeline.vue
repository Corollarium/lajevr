<template>
  <div class="timeline-container">
    <div class="timeline-background" />
    <div class="timeline-header">
      <h2 class="timeline-header__title">
        <i18n>Linha do Tempo</i18n>
      </h2>
    </div>
    <div class="timeline">
      <div class="timeline-item" data-text="Início">
        <div class="timeline__content">
          <h2 class="timeline__content-title">
            1960
          </h2>
          <p class="timeline__content-desc">
            <i18n>Primeiros mergulhos na Laje de Santos</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/laje/640px-Moreia.jpg">
            <figcaption class="timeline__img-attribution">
              <a
                href="https://commons.wikimedia.org/w/index.php?curid=40644070"
              >Rafa Tecchio - Own work, CC BY-SA 3.0</a>
            </figcaption>
          </figure>
          <h2 class="timeline__content-title">
            19 de abril de 1992
          </h2>
          <p class="timeline__content-desc">
            <i18n>A embarcação Moreia é naufragada. É o primeiro naufrágio feito para prática de mergulho no Brasil.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/laje/Parque_Estadual_Marinho_da_Laje_de_Santos.jpg" alt="Parque Estadual, vista aérea">
            <figcaption class="attribution">
              <a href="https://commons.wikimedia.org/wiki/File:Parque_Estadual_Marinho_da_Laje_de_Santos.jpg">
                ALEXANDRE ANDREAZZI, CC BY-SA 4.0
              </a>
            </figcaption>
          </figure>
          <h2 class="timeline__content-title">
            27 de setembro de 1993
          </h2>
          <p class="timeline__content-desc">
            <i18n>Parque criado pelo decreto estadual n° 37.537. Passa a ser área de preservação, sendo proibida a pesca.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/logos/lajeviva.jpg" alt="Instituto Laje Viva">
            <figcaption class="attribution" />
          </figure>
          <h2 class="timeline__content-title">
            2003
          </h2>
          <p class="timeline__content-desc">
            <i18n>Criado o <a href="https://www.lajeviva.org.br/">Instituto Laje Viva</a>, para ajudar na preservação das espécies marinhas do litoral paulista e brasileiro.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/laje/livroLajeDosSonhos.jpg" alt="Livro Laje dos Sonhos">
          </figure>
          <h2 class="timeline__content-title">
            2009
          </h2>
          <p class="timeline__content-desc">
            <i18n>Publicado o livro "Laje de Santos, Laje dos Sonhos".</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
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
          </figure>
          <h2 class="timeline__content-title">
            2012
          </h2>
          <p class="timeline__content-desc">
            <i18n>Produzido o documentário Laje dos Sonhos.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <img class="timeline__img" src="~assets/images/logos/lajevr1024clear.png" alt="Laje de Santos em Realidade Virtual">
          <h2 class="timeline__content-title">
            2020
          </h2>
          <p class="timeline__content-desc">
            <i18n>Projeto "A Laje em Realidade Virtual".</i18n>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      observer: null
    };
  },

  mounted () {
    const background = this.$el.querySelector('.timeline-background');
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const t = entry.target;
          if (entry.intersectionRatio >= 0.5) {
            const bkg = t.querySelector('.timeline__img');

            if (bkg && !this.$el.style.background.includes(bkg.src)) {
              background.style.opacity = 0.5;
              setTimeout(() => {
                background.style.background = 'center / cover fixed no-repeat url(' + bkg.src + ') rgba(33, 33, 33, 0.8)';
                background.style.opacity = 1.0;
              }, 300);
            }
            t.classList.add('timeline-item--active');
          } else if (entry.intersectionRatio <= 0.3) {
            t.classList.remove('timeline-item--active');
          }
        });
      },
      {
        threshold: [0.3, 0.5]
      }
    );
    this.$el.querySelectorAll('.timeline-item').forEach(t => this.observer.observe(t));
  }
};
</script>

<style lang="less" scoped>
@content-font: Cardo;
@heading-font: 'Pathway Gothic One', sans-serif;
@timeline-width:700px;
@timeline-container-width:100%;

.timeline {
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: @timeline-width;
  position: relative;
  &__content {
    &-title {
      font-weight: normal;
      font-size: 66px;
      margin: -10px 0 0 0;
      transition: .4s;
      padding: 0 10px;
      box-sizing: border-box;
      font-family: @heading-font;
      color: #fff;
    }
    &-desc {
      margin: 0;
      font-size: 15px;
      box-sizing: border-box;
      color: rgba(#fff, .7);
      font-family: @content-font;
      font-weight: normal;
      line-height: 25px;
    }
  }
  &:before {
    position: absolute;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
    content: "";
    background: rgba(255, 255, 255, .07);
    @media only screen and (max-width: 767px) {
      left: 40px;
    }
  }
  &-item {
    padding: 40px 0;
    opacity: .3;
    filter: blur(2px);
    transition: .5s;
    box-sizing: border-box;
    width: calc(50% - 40px);
    display: flex;
    position: relative;
    transform: translateY(-80px);
    &:before {
      content: attr(data-text);
      letter-spacing: 3px;
      width: 100%;
      position: absolute;
      color: rgba(#fff, .5);
      font-size: 13px;
      font-family: @heading-font;
      border-left: 2px solid rgba(#fff, .5);
      top: 70%;
      margin-top: -5px;
      padding-left: 15px;
      opacity: 0;
      right: calc(-100% - 56px);
    }
    &:nth-child(even) {
      align-self: flex-end;
      &:before {
        right: auto;
        text-align: right;
        left: calc(-100% - 56px);
        padding-left: 0;
        border-left: none;
        border-right: 2px solid rgba(#fff, .5);
        padding-right: 15px;
      }
    }
    &--active {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0px);
      &:before {
        top: 50%;
        transition: .3s all .2s;
        opacity: 1;
      }
      .timeline__content-title {
        margin: -50px 0 20px 0;
      }
    }
    @media only screen and (max-width: 767px) {
      align-self: baseline !important;
      width: 100%;
      padding: 0 30px 150px 80px;
      &:before {
        left: 10px !important;
        padding: 0 !important;
        top: 50px;
        text-align: center !important;
        width: 60px;
        border: none !important;
      }
      &:last-child {
        padding-bottom: 40px;
      }
    }
  }
  &__figure {
    max-width: 100%;
    box-shadow: 0 10px 15px rgba(0, 0, 0, .4);
  }
  &__img {
    max-width: 100%;
    box-shadow: 0 10px 15px rgba(0, 0, 0, .4);
  }
  &-container {
    width: @timeline-container-width;
    position: relative;
    transition: .3s ease 0s;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;

    &:before {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      content: "";
    }
  }

  &-background {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: .3s ease 0s;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    transition: opacity 0.4s ease-in-out;
  }

  &-header {
    width: 100%;
    text-align: center;
    margin-bottom: 80px;
    position: relative;
    &__title {
      color: #fff;
      font-size: 46px;
      font-family: @content-font;
      font-weight: normal;
      margin: 0;
    }
    &__subtitle {
      color: rgba(255, 255, 255, .5);
      font-family: @heading-font;
      font-size: 16px;
      letter-spacing: 5px;
      margin: 10px 0 0 0;
      font-weight: normal;
    }
  }
}
</style>
