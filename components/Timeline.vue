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
          <h3 class="timeline__content-title">
            1960
          </h3>
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
          <h3 class="timeline__content-title">
            19 de abril de 1992
          </h3>
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
              <a href="https://commons.wikimedia.org/wiki/File:Parque_Estadual_Marinho_da_Laje_de_Santos.jpg" target="_blank">
                ALEXANDRE ANDREAZZI, CC BY-SA 4.0
              </a>
            </figcaption>
          </figure>
          <h3 class="timeline__content-title">
            27 de setembro de 1993
          </h3>
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
          <h3 class="timeline__content-title">
            2003
          </h3>
          <p class="timeline__content-desc">
            <i18n>Criado o <a href="https://www.lajeviva.org.br/" target="_blank">Instituto Laje Viva</a>, para ajudar na preservação das espécies marinhas do litoral paulista e brasileiro.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/laje/livroLajeDosSonhos.jpg" alt="Livro Laje dos Sonhos">
          </figure>
          <h3 class="timeline__content-title">
            2009
          </h3>
          <p class="timeline__content-desc">
            <i18n>Publicado o livro "Laje de Santos, Laje dos Sonhos".</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <figure class="timeline__figure">
            <img class="timeline__img" src="~assets/images/logos/projeto-mantas-do-brasil-footer.png" alt="Projeto Mantas do Brasil">
          </figure>
          <h3 class="timeline__content-title">
            2010
          </h3>
          <p class="timeline__content-desc">
            <i18n>Criado o projeto Mantas do Brasil.</i18n>
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
              loading="lazy"
            />
          </figure>
          <h3 class="timeline__content-title">
            2012
          </h3>
          <p class="timeline__content-desc">
            <i18n>Produzido o documentário Laje dos Sonhos.</i18n>
          </p>
        </div>
      </div>
      <div class="timeline-item" data-text="LAJE DE SANTOS">
        <div class="timeline__content">
          <img class="timeline__img" src="~assets/images/logos/lajevr1024clear.png" alt="Laje de Santos em Realidade Virtual">
          <h3 class="timeline__content-title">
            2020
          </h3>
          <p class="timeline__content-desc">
            <i18n>Projeto "A Laje em Realidade Virtual".</i18n>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- BG REVEJA E REMOVE ISSO O QUE NAO FOR NECESSARIO -->
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
                // TODO: background.style.background = 'center / cover fixed no-repeat url(' + bkg.src + ') rgba(33, 33, 33, 0.8)';
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
