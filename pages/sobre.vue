<template>
  <article>
    <section class="hero-about-page">
      <Clouds />
      <img :src="imageLogoLaje" :srcset="imageLogoLaje.srcSet" class="ilha-logo" alt="Laje de Santos - logo">
      <img :src="imageMar.src" :srcset="imageMar.srcSet" class="ilha-mar" draggable="false" alt="Água do mar da Laje">
      <img :src="imageIlha.src" :srcset="imageIlha.srcSet" class="ilha-hero" draggable="false" alt="Ilha Laje de Santos CC SA 3.0, from https://commons.wikimedia.org/w/index.php?curid=40439744">
    </section>

    <section class="section-base container">
      <h2>
        <i18n>
          Laje de Santos em Realidade Virtual
        </i18n>
      </h2>
      <p>
        <i18n>
          Este projeto usa a realidade virtual para gerar um modelo 3D da Parque
          Estadual Marinho da Laje de Santos, inclusive com partes submersas,
          permitindo que pessoas de todo o Brasil e do mundo possam visitar
          virtualmente o parque, fazer mergulhos virtuais simulados, aprender
          sobre a fauna que habita ou migra pelo parque e sobre o ambiente
          marinho.
        </i18n>
      </p>
      <h3>
        <i18n>
          A ideia e a execução
        </i18n>
      </h3>
      <p>
        <i18n>
          A Corollarium é uma empresa que sempre desenvolveu tecnologia e trabalhou
          com visualização e realidade virtual.
          A ideia de unir mergulho, tecnologia e meio ambiente em um projeto
          da Corollarium era antiga. Finalmente a ideia de aplicar a tecnologia à
          Laje de Santos surgiu: e se transformássemos uma experiência pouco comum,
          de ir até um lugar lindo mas distante, em algo que fosse mais aberto ao
          mundo? E se complementássemos a visita com informações e tecnologia?
          Poderíamos finalmente trazer a experiência da Corollarium para isso, com o apoio
          do ProAC.
        </i18n>
      </p>
    </section>

    <section class="section-base container">
      <h2>
        <i18n>
          Tecnologia
        </i18n>
      </h2>

      <section class="section-inner" bp="grid 12 6@md">
        <div data-aos="slide-left">
          <h3>
            <i18n>
              Adquirindo dados
            </i18n>
          </h3>
          <p>
            <i18n>
              Este projeto buscou dados sobre a Laje de Santos de todas as formas possíveis. Desde fontes
              abertas como a <a href="https://commons.wikimedia.org">Wikimedia Commons</a>, passando
              por instituições como o Instituto Laje Viva e mergulhadores na internet que forneceram
              gentilmente suas fotos. Mas mais do que isso, precisamos ir até a Laje de Santos para
              tirar fotos e vídeos específicas para este projeto com mergulhadores experientes.
            </i18n>
          </p>

          <p>
            <i18n>
              Estamos aguardando a liberação da quarentena para o início dos mergulhos.
            </i18n>
          </p>

          <div class="number-wrapper about-numbers" bp="grid 6 4@md 3@lg">
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
          <img src="~static/images/piva/about-page-1.png">
        </div>
      </section>

      <section class="section-inner" bp="grid 12 6@md">
        <div data-aos="zoom-out-down">
          <img src="~static/images/piva/about-page-2.png">
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
          <div class="number-wrapper about-numbers" bp="grid 6 4@md 3@lg">
            <number-bullet
              :to="stats.images"
              :icon="['fas', 'images']"
            >
              <i18n>imagens</i18n>
            </number-bullet>

            <number-bullet
              :to="stats.videos"
              :icon="['fas', 'video']"
            >
              <i18n>vídeos</i18n>
            </number-bullet>

            <number-bullet
              :to="stats.models"
              :icon="['fas', 'cubes']"
            >
              <i18n>modelos 3D</i18n>
            </number-bullet>
            <number-bullet
              :to="stats.locs.SUM.code"
              :icon="['fas', 'code']"
            >
              <i18n>linhas de código</i18n>
            </number-bullet>
          </div>
        </div>
      </section>

      <section class="section-inner" bp="grid 12 6@md">
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
          <div class="number-wrapper about-numbers" bp="grid 6 4@md 3@lg">
            <number-bullet
              :to="0"
              :icon="['fas', 'camera']"
            >
              <i18n>fotografias</i18n>
            </number-bullet>
            <number-bullet
              :to="0"
              :icon="['fas', 'video']"
            >
              <i18n>horas de vídeo</i18n>
            </number-bullet>
            <number-bullet
              :to="0"
              :icon="['fas', 'hdd']"
            >
              <i18n>horas de processamento</i18n>
            </number-bullet>

            <number-bullet
              :to="0"
              :icon="['fas', 'save']"
            >
              <i18n>GB de dados</i18n>
            </number-bullet>
          </div>
        </div>
        <div data-aos="zoom-out-down">
          <img src="~static/images/piva/about-page-3.png">
        </div>
        </div>
      </section>

      <section class="section-base container">
        <h2>
          <i18n>
            Equipe
          </i18n>
        </h2>
        <div class="people" bp="grid 6 4@md 3@lg">
          <li>
            <img src="~static/images/piva/bg.jpg">
            <h4 class="people-name">
              Bruno Barberi Gnecco
            </h4>
            <p>
              <i18n>Coordenador do projeto, é engenheiro elétrico e mergulhador.</i18n>
            </p>
            <a href="https://www.linkedin.com/in/bruno-barberi-gnecco-56579a75/" target="_blank" title="Ver linkedin de Bruno Barberi Gnecco" class="button-is-liquid">
              <span class="button-is-liquid__text">Linkedin</span>
              <span class="button-is-liquid__animation" />
            </a>
          </li>
          <li>
            <img src="~static/images/piva/piva.jpg">
            <h4 class="people-name">
              Vinícius Rodrigues Piva de Carvalho
            </h4>
            <p>
              <i18n>Comunicólogo, designer de experiência do projeto.</i18n>
            </p>
            <a href="https://www.linkedin.com/in/vpcarvalho/" target="_blank" title="Ver linkedin de Vinícius Piva" class="button-is-liquid">
              <span class="button-is-liquid__text">Linkedin</span>
              <span class="button-is-liquid__animation" />
            </a>
          </li>
          </ul>
        </div>
      </section>

      <section class="section-base container">
        <h2>
          <i18n>
            O Parque Estadual Marinho da Laje de Santos
          </i18n>
        </h2>
        <p>
          <i18n>
            O Parque Estadual Marinho da Laje de Santos (PEMLS) é o primeiro Parque
            Marinho dentre as Unidades de Conservação do Estado de São Paulo, criado
            em 27 de setembro de 1993, através do Decreto Estadual nº 37.537. Possui
            o objetivo de proteger a biodiversidade marinha, e conservar a
            diversidade biológica na costa do Estado de São Paulo. Dista cerca de
            40km da costa da cidade de Santos.
          </i18n>
        </p>
        <p>
          <i18n>
            Por não haver outras formações rochosas ou ilhas próximas, tem uma
            grande concentração de peixes de passagem e recifais, sendo um dos
            principais pontos de mergulho e fotografia submarina do país. O Parque
            também possui um barco naufragado.
          </i18n>
        </p>

        <p>
          <i18n>
            O Parque pode ser visitado por meio de barcos, mas não é permitido
            aportar na ilha. Está distante cerca de 22 milhas náuticas da barra de São Vicente (40km).
            A navegação é longa, cerca de 1h30 a 2h em lanchas
            rápidas ou 6h a 8h em barcos lentos, o que torna a visita difícil e de
            custo considerável, ficando basicamente restrita a mergulhadores
            autônomos credenciados. Com isso poucas pessoas têm acesso a um local de
            enorme beleza e diversidade de fauna.
          </i18n>
        </p>
        <p>
          <i18n>
            Inclui a Laje de Santos, os parcéis do Bandolim, das Âncoras, Brilhante, do Sul e Novo e os Rochedos
            conhecidos como Calhaus, totalizando 5.000 hectares de área preservada com formato de retângulo (10.000 por 5.000 m).
            A Laje de Santos apresenta formato que lembra uma baleia, com 550 m de comprimento, 33 m de altitude e 185 m de largura.
            O farol de sinalização da Marinha do Brasil está localizado no seu ponto mais alto. Praticamente não possui vegetação
            e abriga uma grande quantidade de aves marinhas, que utilizam o local como área de reprodução e descanso.
            Várias espécies que ocorrem no PEMLS encontram-se na listagem de fauna brasileira ameaçada de extinção.
            O Parque faz parte da rota de várias espécies migratórias como baleias, golfinhos e aves marinhas.
            É uma importante área de alimentação de várias espécies, muitas das quais protegidas por convenções internacionais,
            como as baleias-de-Bryde, as raias-manta já citadas, tartarugas marinhas e outras.
          </i18n>
        </p>

        <h3>
          <i18n>
            Importância
          </i18n>
        </h3>

        <p>
          <i18n>
            Além dos outros pontos citados, o PELMS é conhecido por estar na rota migratória das raias manta. É um dos maiores peixes do mundo,
            podendo alcançar oito metros de envergadura e pesar mais de duas toneladas. Há o
            <a href="https://www.mantasdobrasil.org.br/o-projeto/saiba-mais-sobre-a-raia-manta">Projeto Mantas do Brasil</a>, que busca a
            ampliação do conhecimento visando a preservação das maiores espécies de raia do mundo, em especial a espécie comprovadamente
            incidente no Brasil. Em 2011 ambas as espécies de mantas descritas no mundo foram recategorizadas, deixando o antigo estágio
            de “PRÓXIMA DA AMEAÇA” para o estágio mais preocupante de “VULNERÁVEL À EXTINÇÃO” na lista vermelha da IUCN.
            Suspeita-se que o Brasil tenha a menor população de raias mantas do mundo, com uma estimativa de população de apenas
            algumas centenas de indivíduos.
          </i18n>
        </p>
      </section>

      <section class="section-base container">
        <h2>
          <i18n>
            Agradecimentos
          </i18n>
        </h2>
        <p>
          <i18n>
            Agradecemos às seguintes pessoas e instituições por sua inestimável ajuda neste projeto.
          </i18n>
        </p>
        <ul>
          <li><a href="https://www.instagram.com/deia_morales/" target="_blank">Andréa Pontes</a> pelas suas fotos e vídeos</li>
          <li>José Edmilson Júnior, gestor do Parque Estadual Marinho da Laje de Santos, por acreditar e apoiar o projeto imediatamente</li>
          <li><a href="https://www.instagram.com/nautherandres/" target="_blank">Nauther Andres</a> pelo conteúdo, texto e fotos, e inestimável ajuda no projeto todo.</li>
        </ul>
      </section>
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import statisticsData from '~/components/statistics.json';
import Clouds from '~/components/Clouds.vue';

const imageIlha = require('~/assets/images/graficos/laje-ilha.png?resize');
const imageMar = require('~/assets/images/backgrounds/sea.jpg?resize');
const imageLogoLaje = require('~/assets/images/logos/logo-laje-de-santos.png?resize');

export default {
  components: Clouds,
  extends: page,

  data () {
    return {
      imageIlha,
      imageMar,
      imageLogoLaje,
      stats: statisticsData
    };
  },

  mounted () {
    this.head.title = this.$gettext('Projeto Laje de Santos Virtual');
    this.head.description = this.$gettext('Sobre o projeto Laje de Santos Virtual');
  }

};
</script>

<style lang="less" scoped>
.people {
  list-style: none;
  padding: 0;

  img {
    border-radius: 50%;
    overflow: hidden;
    padding: 1rem;
  }

  .people-name {
    margin: 1rem 0 .5rem;
  }
}
</style>
