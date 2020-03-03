<template>
  <article class="container columns">
    <div class="column is-2 is-fullheight is-hidden-mobile">
      <div class="sidebar">
        <ul class="menu-list">
          <li class="sidebar-link" data-target="intro">
            <a href="#intro">Introdução</a>
          </li>
          <li class="sidebar-link" data-target="manta">
            <a href="#manta">Mantas</a>
          </li>
          <li class="sidebar-link" data-target="turtles">
            <a href="#turtles">Tartarugas</a>
          </li>
          <li class="sidebar-link" data-target="dolphins">
            <a href="#dolphins">Golfinhos</a>
          </li>
          <li class="sidebar-link" data-target="birds">
            <a href="#birds">Aves</a>
          </li>
          <li class="sidebar-link" data-target="fish">
            <a href="#fish">Peixes</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="main column">
      <h1>
        <i18n>
          A vida na Laje de Santos
        </i18n>
      </h1>

      <section id="intro" class="section">
        <p>
          A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.
          É também habitada por corais, algas e outras formas de vida. Há muitas áreas com algas marrons e vermelhas.
          <nuxt-link to="/especies">
            Se estiver procurando espécies, veja a lista completa.
          </nuxt-link>
        </p>
      </section>

      <section id="manta" class="section">
        <h2 class="title is-2">
          Raias Mantas
        </h2>
        <p>
          A jamanta (Mobula birostris), também conhecida como manta. é uma espécie de peixes pelágicos e oceânicos. É a maior espécie atual de raias.
          Encontra-se nas regiões tropicais e subtropicais de todos os oceanos, tipicamente perto de recifes de coral.
        </p>

        <GLTFModel
          :model="'./models/manta/scene.gltf'"
          :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
          :attribution="'Modelo 3D CC BY-NC por misaooo'"
        />
        </GLTFModel>

        <p>
          A jamanta tem o corpo em forma de losango e uma cauda longa sem espinho e pode atingir sete metros de envergadura e pesar até 1,350kg. Podem viver até 20 anos. Estes peixes não têm verdadeiros dentes e alimentam-se de plâncton e pequenos peixes, sendo portanto inofensivos. Ocasionalmente, podem aproximar-se de um barco ou de mergulhadores e podem executar curtos “voos” fora da água. Têm a maior taxa de volume de cérebro em relação ao do corpo de todos os tubarões e raias.
        </p>
        <p>
          Durante as suas migrações, as jamantas efetuam mergulhos frequentes até profundidades de quase dois quilómetros (entre os maiores alguma vez medidos para um animal marinho), onde as temperaturas da água atingem os três graus centígrados.
          A Laje está na rota migratória das raias mantas gigantes, que passam por lá nos meses de outono e inverno.
        </p>
        <p>Fonte: <a href="https://pt.wikipedia.org/wiki/Jamanta">Wikipedia: Jamanta</a>.</p>
      </section>

      <section id="turtles" class="section">
        <h2 class="title is-2">
          Tartarugas
        </h2>
        <p>
          Há duas espécies de tartarugas na Laje de Santos: a tartaruga de pente e a tartaruga-verde.
        </p>

        <figure>
          <img width="800" alt="Tartaruga da Laje" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tartaruga_da_Laje.jpg/800px-Tartaruga_da_Laje.jpg">
          <figcaption>
            Tartaruga de pente. REVER FOTO
            <a title="Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Tartaruga_da_Laje.jpg">Ronaldo art [CC BY-SA 3.0]</a>
          </figcaption>
        </figure>

        <figure>
          <img width="800" alt="Green sea turtle near Marsa Alam" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Green_sea_turtle_near_Marsa_Alam.JPG/800px-Green_sea_turtle_near_Marsa_Alam.JPG">
          <figcaption>
            Tartaruga verde. REVER FOTO
            <a title="Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Tartaruga_da_Laje.jpg">Alexander Vasenin [CC BY-SA 3.0]</a>
          </figcaption>
        </figure>
      </section>

      <section id="dolphins" class="section">
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

      <section id="birds" class="section">
        <h2 class="title is-2">
          Aves
        </h2>

        <p>
          29 espécies de aves já foram catalogadas na Laje.
        </p>
      </section>

      <section id="fish" class="section">
        <h2 class="title is-2">
          Peixes
        </h2>

        <GLTFModel
          :model="'./models/fish/scene.gltf'"
          :attribution="''"
        />
        </GLTFModel>
      </section>
    </div>
  </article>
</template>

<script>
import GLTFModel from '~/components/GLTFModel.vue';

export default {
  components: {
    GLTFModel
  },
  mounted () {
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
            const navItem = document.querySelector('[data-target="' + entry.target.id + '"]');
            if (entry.intersectionRatio >= 0.1) {
              navItem.classList.add('active');
            } else {
              navItem.classList.remove('active');
            }
          });
        };
        const options = {
          threshold: [0.1, 0.9]
        };
        const observer = new IntersectionObserver(callback, options);
        document.querySelectorAll('section.section').forEach((x) => { observer.observe(x); });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '~assets/css/variables.less';

@media (min-width: 640px) {
  .sidebar {
    position: sticky;
    top: 30px;
  }
}
.menu-list {
  list-style: none;
  margin-right: 1em;
  li {
    height: 5em;
    vertical-align: middle;
    @media screen and (min-width: 1024px) {
      font-size: 1.2em;
    }
    text-transform: capitalize;
    font-variant: small-caps;
    font-weight: bold;
    a {
      line-height: 4.5em;
      padding: 0;
    }
  }
  li.active {
    background-color: @secondaryColor-2;
  }
}

figure {
  text-align: center;
}
</style>
