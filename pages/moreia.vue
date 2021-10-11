<template>
  <article class="pagina-vida">
    <section class="hero">
      <div class="hero-body hero-vida">
        <figure>
          <img :src="panorama.src" :srcset="panorama.srcSet" alt="Panorama do naufrágio Moréia">
        </figure>
      </div>
      <div class="vida-hero-text rellax" data-rellax-speed="2">
        <h1 class="has-text-center vida-hero-title">
          <i18n>
            O naufrágio Moréia
          </i18n>
        </h1>
      </div>
      <p class="attribution">
        <i18n>
          Foto
        </i18n>
        <a target="_blank" href="https://www.instagram.com/nautherandres/">Nauther Andres</a>
      </p>
    </section>

    <section bp="container">
      <p>
        Uma das práticas que o mergulho permite é visitar naufrágios. Enquanto muitos são tragédias, não é o caso do Moréia, o nosso querido naufrágio da Laje de Santos.
      </p>

      <p>
        Há muitos lugares no mundo que afundam barcos (e até mesmo tanques de guerra ou aviões) propositalmente. As estruturas são
        limpas de seus poluentes, como óleo e materiais tóxicos, e deliberadamente naufragados. Ali, repousando no fundo do mar,
        viram um recife artificial: servem de estrutura para corais, de refúgio para peixes e de atrativo para o mergulho.
      </p>

      <p>
        O Moréia foi naufragado em 1992, e por muito tempo quase ninguém sabia era responsável pelo naufrágio. A história só se tornou
        pública quando foi gravado o documentário Laje dos Sonhos, onde o próprio autor, Clóvis Benno de Carvalho, conta como foi tudo.
        Ele achou um casco de barco e rebocou até a ilha. Achou que seria quase imediato o afundamento, mas o barco demorou horas para
        ir ao fundo. Ele mesmo conta a história:
      </p>

      <div class="videoWrapper">
        <iframe
          class="image"
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/emBUPoyJ8Pk?start=2997"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        />
      </div>

      <p>
        Hoje o Moréia está se desmantelando pela ação da água e do tempo. Não é mais permitido entrar nele, mas ele continua no fundo
        provendo um belo espetáculo para os mergulhadores.
      </p>

      <p>
        Parte do projeto deste site é recriar o Moreia em 3D para que todos, mergulhadores ou não, possuam ver um pouco mais dele. Um
        pequeno barco, simples, mas que virou parte da história do mergulho brasileiro.
      </p>
    </section>
  </article>
</template>

<script>
import page from './page.vue';

const panorama = require('~/static/images/panorama.jpg?resize&sizes[]=360&sizes[]=640&sizes[]=1000');

export default {
  extends: page,

  data () {
    return {
      panorama
    };
  },

  mounted () {
    this.head.title = this.$gettext('O Naufrágio Moréia');
    this.head.description = this.$gettext('O Naufrágio Moréia');
  }
};
</script>
<style>
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  margin: 2em 0;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
