<template>
  <article class="pagina-vida">
    <section class="hero">
      <div class="hero-body hero-vida">
        <figure>
          <img :src="imageCardume.src" :srcset="imageCardume.srcSet" alt="Cardume">
        </figure>
      </div>
      <div class="vida-hero-text rellax" data-rellax-speed="2">
        <h1 class="has-text-center vida-hero-title">
          <i18n>
            A vida na Laje de Santos
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
    <!-- adicionar smooth scroll na pagina https://www.npmjs.com/package/vue-smooth-scroll -->
    <div class="topbar-sticky menu-with-icons">
      <ul class="pure-menu-list horizontal-menu topbar-list">
        <li class="pure-menu-item topbar-list-item" data-target="raias">
          <a class="pure-menu-link link-menu-vida" href="#raias">
            <img class="menu-icon" alt="Icone de uma manta" src="~static/images/graficos/ray.svg">
            Raias
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="turtles">
          <a class="pure-menu-link link-menu-vida" href="#turtles">
            <img class="menu-icon" alt="Icone de uma tartaruga" src="~static/images/graficos/turtle.svg">
            Tartarugas
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="dolphins">
          <a class="pure-menu-link link-menu-vida" href="#dolphins">
            <img class="menu-icon" alt="Icone de um golfinho" src="~static/images/graficos/dolphin.svg">
            Golfinhos
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="birds">
          <a class="pure-menu-link link-menu-vida" href="#birds">
            <img class="menu-icon" alt="Icone de um pássaros" src="~static/images/graficos/bird.svg">
            Aves
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="birds">
          <a class="pure-menu-link link-menu-vida" href="#fishes">
            <img class="menu-icon" alt="Icone de um pássaros" src="~static/images/graficos/fish.svg">
            Peixes
          </a>
        </li>
      </ul>
    </div>

    <section id="intro" class="section-index section-life" bp="container" data-aos="fade-up">
      <swimming-fish />
      <p class="intro text-block-b centered rellax" data-rellax-speed="-.75">
        <i18n>
          A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.
          É também habitada por corais, algas e outras formas de vida. Há muitas áreas com algas marrons e vermelhas.
        </i18n>
        <nuxt-link to="/especies">
          <i18n>Se estiver procurando espécies, veja a lista completa.</i18n>
        </nuxt-link>
      </p>
    </section>

    <section id="raias" class="section-index">
      <section>
        <h2 class="title-specimen rellax" data-rellax-speed="-0.5">
          <img alt="Icone de uma manta" src="~static/images/graficos/ray.svg">
          Raias
        </h2>
      </section>

      <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
        <h3>
          Raia-Manta
        </h3>
        <div class="especie-info text-block">
          <p>Espécie: Mobula birostris</p>
          <p>Estado de conservação: Vulnerável a extinção</p>
        </div>
      </section>
      <figure class="figure-text" data-aos="fade-up">
        <img alt="Tartaruga de pente" src="~static/images/nauther/1549889531894-1082715277.jpg">
        <figcaption>
          <p>
            Um mergulhador fotografa duas raias mantas na Laje de Santos. Foto: Nauther Andres
          </p>
        </figcaption>
      </figure>

      <section class="section-life " bp="grid container">
        <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
        </div>

        <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
          <GLTFModel
            :model="'./models/manta/scene.gltf'"
            :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
            :attribution="'Modelo 3D CC BY-NC por misaooo'"
          />
          </GLTFModel>
        </div>
      </section>

      <section class="section-life with-bottom-content container">
        <h3>
          Raia-chita
        </h3>

        <div bp="grid vertical-center">
          <div bp="12 6@md" data-aos="fade-up">
            <div class="especie-info text-block">
              <p>Espécie: Aetobatus narinari</p>
              <p>Estado de conservação: Quase ameaçada</p>
            </div>
          </div>

          <p class="text-block-b" bp="12 6@md" data-aos="fade-down">
            Vive em quase todos os oceanos, mas na Laje pode ser vista quase o ano
            todo, onde seus indivíduos são inclusive reconhecidos pelos
            mergulhadores mais frequentes, graças ao padrão único de pintas nas
            costas. Pode viver até 18 anos. Pode ser vista navegando sozinha ou em
            cardumes com mais de 20 indivíduos, e muitas vezes saltando para fora
            d’água, se alimentam de pequenos crustáceos e moluscos bivalves
            (animais de duas conchas) sua mandíbula é extremamente forte capaz de
            triturar carapaças e conchas.
          </p>
        </div>
      </section>
      <figure class="figure-text" data-aos="fade-up">
        <img alt="Raia Chita" src="~static/images/nauther/1545946134598879623409.jpg">
        <figcaption>
          <p>
            Raia Chita
          </p>
        </figcaption>
      </figure>

      <section class="section-life container">
        <h3>
          Raia-prego
        </h3>

        <div bp="grid vertical-center">
          <div bp="12 6@md" data-aos="fade-down">
            <div class="especie-info text-block">
              <p>Espécie: Dasyatis centroura</p>
              <p>Estado de conservação: pouco preocupante</p>
              <p>
                As raias-prego, ou raias manteiga como são conhecidas pelos
                mergulhadores, sempre dão show quando encontradas. São animais de
                corpo achatado associados ao substrato ou fundo de areia, pois
                geralmente param ali e jogam a areia por cima de seu corpo para se
                camuflarem e desta forma descansarem.
              </p>
            </div>
          </div>

          <div class="text-block-b" bp="12 6@md" data-aos="fade-up">
            <p>
              Dizem que as raias e os tubarões não podem parar de nadar por que
              podem morrer afogados, mas nem tudo é verdade. No caso de algumas
              espécies de raias, quando estão paradas, elas abrem e fecham o
              opérculo, órgão responsável por sua respiração, sugando a água que
              passa por suas brânquias fazendo a troca de oxigênio. Apesar de não
              atacarem pessoas, por causa deste comportamento de se enterrar na
              areia e permanecer muitas vezes em águas rasas, ocorrem alguns
              acidentes pelo mundo afora pelo seu ferrão venenoso. Foi o caso do
              zoólogo e apresentador de TV Steve Irwin, conhecido mundialmente como
              Caçador de Crocodilos, que faleceu por uma ferroada acidental de raia
              do gênero Dasyatis.
            </p>
          </div>
        </div>
        </div>
      </section>
      <figure class="figure-text">
        <div bp="grid">
          <div bp="6" data-aos="fade-right">
            <img alt="Raia prego" src="~static/images/nauther/1549752089536-353729687.jpg">
          </div>
          <div bp="6" data-aos="fade-left">
            <img alt="Raia prego" src="~static/images/nauther/1562034454874570542648.jpg">
          </div>
        </div>
        <figcaption>
          <p>
            Na Laje de Santos raias-prego aparecem em determinadas épocas do ano e
            geralmente estão prenhas ou grávidas como na foto. A
            gravidez das raias é perceptível pelo ventre e pelo dorso
            deixando-as protuberantes em ambos os lados. Fotos: Nauther Andres.
          </p>
        </figcaption>
      </figure>

      <section class="section-life container">
        <h3>
          Raia-borboleta
        </h3>
        <div bp="grid vertical-center">
          <div bp="12 6@md" data-aos="fade-down">
            <div class="especie-info text-block">
              <p>Espécie: Gymnura altavela</p>
              <p>Estado de conservação: Vulnerável a extinção e decaindo</p>
            </div>
          </div>

          <div class="text-block-b" bp="12 6@md" data-aos="fade-up">
            <p>
              A raia-borboleta pode ser encontrada em todo o oceano atlântico, mar
              negro e nas Ilhas da Madeira e Ilhas Canárias. Podem ser vistas de 5 a
              100 metros de profundidade, e na Laje de Santos são vistas nas
              estações primavera e verão, utilizando a região para descanso no
              período reprodutivo.
            </p>

            <p>
              Como a maioria das raias, elas também possuem o comportamento de se
              camuflarem no fundo de areia, cobrindo todo seu corpo com uma fina
              camada de sedimentos para se protegerem de possíveis predadores. Todos
              os anos as encontramos e geralmente as fêmeas estão grávidas, o que é
              possível saber por ficarem com o dorso proeminente.
            </p>
          </div>
        </div>
      </section>
      <figure class="figure-text">
        <div bp="grid">
          <div bp="6" data-aos="fade-right">
            <img alt="Raia borboleta" src="~static/images/marcelomigliari/Image 2020-04-16 at 20.05.43.jpeg">
          </div>
          <div bp="6" data-aos="fade-left">
            <img alt="Raia borboleta" src="~static/images/marcelomigliari/Image 2020-04-16 at 20.05.44.jpeg">
          </div>
        </div>
        <figcaption>
          <p>
            Raias-borboleta. Pode ser bem difícil diferenciar o macho da
            fêmea, mas, um detalhe importante sobre os peixes cartilaginosos
            ou raias e tubarões, é que os machos possuem dois clásperes ou
            (pênis) que é possível ser visualizado na base da cauda dos machos
            e ausente nas fêmeas. Fotos: <a
              href="https://www.instagram.com/marcelomigliari/"
              target="_blank"
            >Marcelo Migliari</a>
          </p>
        </figcaption>
      </figure>
    </section>

    <section id="turtles" class="section-index">
      <section class="section-life container">
        <h2 class="title-specimen">
          <img alt="Icone de uma tartaruga" src="~static/images/graficos/turtle.svg">
          Tartarugas
        </h2>

        <div bp="grid vertical-center">
          <div bp="12 6@md" data-aos="fade-down">
            <p class="text-block">
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
          </div>

          <div class="text-block-b" bp="12 6@md" data-aos="fade-up">
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
          </div>
        </div>
      </section>

      <figure class="figure-text">
        <div bp="grid">
          <div bp="12 6@md vertical-center" data-aos="fade-right">
            <img alt="Tartaruga de pente" src="~static/images/nauther/1552316930246-911010432.jpg">
          </div>
          <div bp="12 6@md vertical-center" data-aos="fade-left">
            <img alt="Tartaruga verde" src="~static/images/nauther/1547073690808-2036926563.jpg">
          </div>
        </div>
        <figcaption>
          <p>
            Tartaruga verde (à esquerda)
            e tartaruga de pente (à direita).
          </p>
        </figcaption>
      </figure>
    </section>

    <section id="dolphins" class="section-index">
      <section class="section-life container">
        <h2 class="title-specimen">
          <img alt="Icone de um golfinho" src="~static/images/graficos/dolphin.svg">
          Golfinhos
        </h2>

        <div class="text-block centered" data-aos="zoom-in">
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
        </div>
      </section>
      <figure class="figure-text" data-aos="fade-up">
        <img src="~static/images/nauther/20190626_093259.jpg">
        <figcaption>
          <p>
            Golfinhos
          </p>
        </figcaption>
      </figure>
    </section>

    <section id="birds" class="section-index">
      <section class="section-life container">
        <h2 class="title-specimen">
          <img alt="Icone de uma ave" src="~static/images/graficos/bird.svg">
          Aves
        </h2>

        <p>
          29 espécies de aves já foram catalogadas na Laje.
        </p>
      </section>
    </section>
    </section>
  </article>
</template>

<script>
import Rellax from 'rellax';
import page from './page.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import SwimmingFish from '~/components/SwimmingFish.vue';

const imageCardume = require('~/static/images/nauther/1556498262088345578492.jpg?resize');

export default {
  components: {
    GLTFModel,
    SwimmingFish
  },

  extends: page,

  data () {
    return {
      imageCardume,
      lms: null,
      rellax: null
    };
  },

  mounted () {
    this.head.title = this.$gettext('Vida na Laje de Santos');
    this.head.description = this.$gettext('Sobre seres vivos na Laje de Santos');

    this.rellax = new Rellax('.rellax');

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
