<template>
  <article>
    <section class="section">
      <h1 class="title">
        <i18n>
          Mergulho na Laje de Santos
        </i18n>
      </h1>
      <h2 class="subtitle">
        <i18n>
          Laje de Santos em Realidade Virtual
        </i18n>
      </h2>
      <p>
        <i18n>
          A Laje de Santos é um local popular para a prática do mergulho. Próxima da cidade de São Paulo, a 1h30m de barco da costa e
          com uma diversidade de espécies que poucos lugares são capazes de igualar, raramente com menos de 10 metros de visibilidade.
        </i18n>
      </p>
    </section>

    <section>
      <Ilha3D
        :dive-sites="diveSites"
      />
    </section>

    <section class="section">
      <h2 class="subtitle">
        <i18n>
          Pontos de mergulho
        </i18n>
      </h2>
      <div
        v-for="site in diveSites"
        :key="site.name"
      >
        <h3 class="subtitle is-3">
          {{ site.name }}
        </h3>
        <span class="dive-dificuldade">{{ site.dificuldade }}</span>
        <span class="dive-coordinates">Latitude: {{ site.lat }} Longitude: {{ site.long }}</span>
        <span class="dive-description">{{ site.description }}</span>
      </div>
    </section>

    <section>
      <p>
        Fontes das informações:
        <a href="https://www.lajeviva.org.br/Lajeviva/parque/pontos-de-mergulho/">Instituto Laje Viva</a>,
        <a href="http://arquivos.ambiente.sp.gov.br/fundacaoflorestal/2014/04/Plano-Emergencial-de-Uso-P%C3%BAblico_PEMLS_versaoFinal.pdf">Plano Emergencial de Uso Público do PEMLS</a>
        <a href="https://smastr16.blob.core.windows.net/consema/2018/11/e-laje-de-santos-plano-de-manejo.pdf">Plano de Manejo da Laje de Santos</a>
      </p>
    </section>
  </article>
</template>

<script>
import Ilha3D from '~/components/Ilha3D.vue';

export default {

  components: {
    Ilha3D
  },
  data () {
    return {
      diveSites: [
        { name: 'Portinho',
          lat: -24.318083,
          long: -46.183444,
          dificuldade: 'Baixo grau de dificuldade.',
          description: 'A face norte é o local onde ocorre a maioria dos mergulhos, com profundidade de até 22m, mais abrigado das correntes e de fácil orientação.'
        },
        { name: 'Naufrágio Moreia',
          lat: -24.317056,
          long: -46.182083,
          dificuldade: 'Baixo grau de dificuldade.',
          description: 'Na face norte, próximo à ponta leste, pesqueiro de ferro com 15m de comprimento, estrutura em estado instável, desaconselhando penetração, profundidade máxima de 22m.'
        },
        { name: 'Piscinas',
          lat: -24.321667,
          long: -46.184306,
          dificuldade: 'Médio grau de dificuldade.',
          description: 'Na ponta oeste/sudoeste da Laje, ambiente com profundidade que varia de 10 a 35m e requer boa noção de orientação subaquática.'
        },
        { name: 'Boca da Baleia',
          lat: -24.316778,
          long: -46.179083,
          dificuldade: 'Fenda voltada para leste, com cerca de 50m de extensão e profundidade média de 15m. Requer excelente condição de mar e direção de ondulação adequada para que se possa adentrar.',
          description: 'Alto grau de dificuldade'
        },
        { name: 'Paredão Face Sul',
          lat: -24.320333,
          long: -46.180194,
          dificuldade: 'Médio grau de dificuldade.',
          description: 'Encosta rochosa íngreme que desce verticalmente até 42m de profundidade. Mergulhos feitos em "drifting" a favor da corrente. Formação com inclinação negativa entre 12 e 27m de profundidade do centro para leste.'
        },
        { name: 'Parcel das Âncoras',
          lat: -24.321833,
          long: -46.184972,
          dificuldade: 'Alto grau de dificuldade.',
          description: 'Fundo rochoso que se destaca da Laje em direção ao continente, apresenta estrutura complexa, exigindo boa orientação subaquática. Profundidade entre 18 e 42m. Presença de muitas âncoras de pesqueiros que ficaram presas ao fundo rochoso. Sujeito a correntes.'
        },
        { name: 'Parcel do Sul',
          lat: -24.326917,
          long: -46.183722,
          dificuldade: 'Médio grau de dificuldade.',
          description: 'Formação submersa a cerca de 400m a sudoeste da Laje, inicia aos 8m e segue até os 42m. Requer mar em boas condições, mas a formação permite orientação e deslocamento mais simples.'
        },
        { name: 'Calhaus Face Norte',
          lat: -24.327167,
          long: -46.161667,
          dificuldade: 'Baixo a médio grau de dificuldade.',
          description: 'Paredão levemente acidentado, com características de navegação subaquática semelhantes ao portinho da Laje, com profundidades que podem variar de 8 a 25m, passando a até 35m se houver afastamento das rochas na direção norte (sentido Laje).'
        },
        { name: 'Calhaus Face Sul',
          lat: -24.32825,
          long: -46.159278,
          dificuldade: 'Paredão levemente acidentado com incidência de correntes e profundidades que podem variar de 8 a 40m.',
          description: 'Alto grau de dificuldade.'
        },
        { name: 'Calhaus Túnel',
          lat: -24.328,
          long: -46.160722,
          dificuldade: 'Paredão levemente acidentado com incidência de correntes e profundidades que podem variar de 8 a 40m.',
          description: 'Alto grau de dificuldade.'
        },
        { name: 'Parcel Novo',
          lat: -24.345472,
          long: -46.173972,
          dificuldade: 'Alto grau de dificuldade.',
          description: 'Formação submersa localizada cerca de 1,5 milhas náuticas ao sul da Laje que inicia aos 26m de profundidade e chega aos 45m. Exige mar em excelentes condições e preparo adequado dos mergulhadores.'
        },
        { name: 'Parcel do Brilhante',
          lat: -24.28888889,
          long: -46.16388889,
          dificuldade: '',
          description: ''
        },
        { name: 'Laje do Bandolim',
          lat: -24.27666667,
          long: -46.18194444,
          dificuldade: '',
          description: ''
        }
      ]
    };
  }
};
</script>

<style></style>
