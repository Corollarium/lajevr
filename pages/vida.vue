<template>
  <article>
    <div class="topbar-sticky">
      <ul class="pure-menu-list horizontal-menu topbar-list">
        <li class="pure-menu-item topbar-list-item" data-target="intro">
          <a class="pure-menu-link" href="#intro">Introdução</a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="manta">
          <a class="pure-menu-link" href="#manta">Mantas</a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="turtles">
          <a class="pure-menu-link" href="#turtles">Tartarugas</a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="dolphins">
          <a class="pure-menu-link" href="#dolphins">Golfinhos</a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="birds">
          <a class="pure-menu-link" href="#birds">Aves</a>
        </li>
      </ul>
    </div>

    <section class="hero">
      <div class="hero-body">
        <img :src="imageCardume.src" :srcset="imageCardume.srcSet" alt="Cardume">
      </div>
      <div class="hero-html">
        <h1>
          <i18n>
            A vida na Laje de Santos
          </i18n>
        </h1>
        <p class="attribution">
          Photo
          <a
            href="//commons.wikimedia.org/w/index.php?title=User:Afcarv&amp;action=edit&amp;redlink=1"
            class="new"
            title="User:Afcarv (page does not exist)"
          >Anael Ferraz de Carvalho</a>
          -
          <span class="int-own-work" lang="en">Own work</span>,
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0"
            title="Creative Commons Attribution-Share Alike 3.0"
          >CC BY-SA 3.0</a>
          <a href="https://commons.wikimedia.org/w/index.php?curid=40439744">Link</a>
        </p>
      </div>
    </section>

    <section id="intro" class="section-index section-base section-text">
      <p>
        A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.
        É também habitada por corais, algas e outras formas de vida. Há muitas áreas com algas marrons e vermelhas.
        <nuxt-link to="/especies">
          Se estiver procurando espécies, veja a lista completa.
        </nuxt-link>
      </p>
    </section>

    <section id="manta" class="section-index">
      <section class="section-base section-text">
        <h2 class="title is-2">
          Raias Mantas (Mobula birostris)
        </h2>
      </section>

      <figure class="figure-text">
        <img alt="Tartaruga de pente" src="/images/nauther/1549889531894-1082715277.jpg">
        <figcaption>
          <p>
            Um mergulhador fotografa duas raias mantas na Laje de Santos. Foto: Nauther Andres
          </p>
        </figcaption>
      </figure>

      <section class="section-base section-text">
        <p>
          Reconhecida como a maior espécie de raia do mundo, podendo ultrapassar
          os 8 metros de envergadura de uma nadadeira a outra e pesar mais de 2
          mil quilos, a raia manta não possui ferrão. É o peixe com o maior
          cérebro de todos os outros peixes do mar, por isso é extremamente
          inteligente, um animal muito dócil e curioso. Quando encontra um
          mergulhador, permite a interação e por vezes permanece por vários
          minutos nadando ao seu redor para saber o que é. As bolhas de ar dos
          mergulhadores parecem fazer cócegas em sua barriga
        </p>

        <div class="model-container" style="min-height: 70vh;">
          <GLTFModel
            :model="'./models/manta/scene.gltf'"
            :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
            :attribution="'Modelo 3D CC BY-NC por misaooo'"
          />
          </GLTFModel>
        </div>

        <p>
          Podem ser
          encontradas nas zonas tropicais e subtropicais do planeta. Na laje de
          Santos aparecem no período de inverno, nos meses de abril a setembro. As
          mantas são identificadas individualmente através de fotografia das
          manchas ventrais que formam padrões únicos. Esses dados são inserido em
          bancos de dados brasileiro e mundial para organização, assim é possível
          a quantificação de números populacionais.
        </p>

        <p>
          Durante as suas migrações, as jamantas efetuam mergulhos frequentes até
          profundidades de quase dois quilômetros (entre os maiores alguma vez
          medidos para um animal marinho), onde as temperaturas da água atingem os
          três graus centígrados.
        </p>
      </section>
    </section>

    <section id="turtles" class="section-index">
      <section class="section-base section-text">
        <h2 class="title is-2">
          Tartarugas
        </h2>
        <p>
          Existem duas espécies de tartarugas que frequentam a Laje de Santos, a
          Tartaruga-verde e a tartaruga-de-pente. São parecidas, mas alguns
          detalhes são importantes para diferenciá-las: no caso da
          tartaruga-de-pente, apresentam cabeça mais fina e comprida, bico como de
          falcão, placas do casco sobrepostas ou imbricadas como telha, coloração
          marrom amarelada, o casco geralmente bem ornamentado. Já as tartarugas
          verdes possuem o casco mais simétrico, com placas intercaladas e
          conectadas como um quebra-cabeça, cabeça arredondada e coloração do
          casco predominante do verde e marrom, para amarelo claro em seu ventre.
        </p>
      </section>

      <figure class="figure-text">
        <div bp="grid">
          <div bp="6">
            <img alt="Tartaruga de pente" src="/images/nauther/1552316930246-911010432.jpg">
          </div>
          <div bp="6">
            <img alt="Tartaruga verde" src="/images/nauther/1547073690808-2036926563.jpg">
          </div>
        </div>
        <figcaption>
          <p>
            Tartaruga verde (à esquerda)
            e tartaruga de pente (à direita).
          </p>
        </figcaption>
      </figure>

      <section class="section-base section-text">
        <p>
          Graças à beleza do casco, as tartarugas-de-pente foram extremamente
          caçadas e quase chegaram à extinção. Seu casco era utilizados para fazer
          utensílios como porta-jóias e objetos como pentes, daí seu nome popular
          "tartaruga-de-pente".
        </p>
        <p>
          Como são animais de vida longa, atingindo a maturidade sexual após os 30
          anos, as tartarugas encontradas na Laje de Santos são animais juvenis
          utilizando a área para alimentação e abrigo.
        </p>
      </section>
    </section>

    <section id="dolphins" class="section-index">
      <section class="section-base section-text">
        <h2 class="title is-2">
          Golfinhos
        </h2>
        <p>
          Duas espécies de golfinhos habitam a Laje de Santos. É comum vê-los durante a travessia de barco, em pequenos grupos que
          aparecem, acompanham o barco por alguns minutos e de novo somem em mar aberto, parecendo nos recepcionar.
        </p>
        <p>
          O Golfinho nariz de garrafa
        </p>
        <p>
          O Golfinho pintado do Atlântico.
        </p>
      </section>
    </section>

    <section id="birds" class="section-index">
      <section class="section-base section-text">
        <h2 class="title is-2">
          Aves
        </h2>

        <p>
          29 espécies de aves já foram catalogadas na Laje.
        </p>
      </section>
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import GLTFModel from '~/components/GLTFModel.vue';

const imageCardume = require('~/static/images/nauther/1556498262088345578492.jpg?resize');

export default {
  components: {
    GLTFModel
  },

  extends: page,

  data () {
    return {
      imageCardume
    };
  },

  mounted () {
    this.head.title = this.$gettext('Vida na Laje de Santos');
    this.head.description = this.$gettext('Sobre seres vivos na Laje de Santos');
    this.asideMenu();
  },

  methods: {
    asideMenu () {
      if (
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype
      ) {
        const callback = (entries, observer) => {
          entries.forEach((entry) => {
            const navItem = document.querySelector('.topbar-list-item[data-target="' + entry.target.id + '"] .pure-menu-link');
            if (entry.intersectionRatio >= 0.1) {
              navItem.classList.add('is-active');
            } else {
              navItem.classList.remove('is-active');
            }
          });
        };
        const options = {
          threshold: [0.1, 0.9]
        };
        const observer = new IntersectionObserver(callback, options);
        document.querySelectorAll('section.section-index').forEach((x) => { observer.observe(x); });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '~assets/css/variables.less';
</style>
