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
            <img class="menu-icon" alt="Icone de uma manta" src="~static/graficos/ray.svg">
            Raias
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="turtles">
          <a class="pure-menu-link link-menu-vida" href="#turtles">
            <img class="menu-icon" alt="Icone de uma tartaruga" src="~static/graficos/turtle.svg">
            Tartarugas
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="dolphins">
          <a class="pure-menu-link link-menu-vida" href="#dolphins">
            <img class="menu-icon" alt="Icone de um golfinho" src="~static/graficos/dolphin.svg">
            Golfinhos
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="fish">
          <a class="pure-menu-link link-menu-vida" href="#fish">
            <img class="menu-icon" alt="Icone de um peixe" src="~static/graficos/fish.svg">
            Peixes
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="birds">
          <a class="pure-menu-link link-menu-vida" href="#birds">
            <img class="menu-icon" alt="Icone de um pássaros" src="~static/graficos/bird.svg">
            Aves
          </a>
        </li>
      </ul>
    </div>

    <article id="intro" class="section-container" bp="container" data-aos="fade-up">
      <swimming-fish />
      <p class="intro text-block-b centered rellax" data-rellax-speed="-.75">
        <i18n>
          A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.
          É também habitada por corais, algas e outras formas de vida. Há muitas áreas com algas marrons e vermelhas.
        </i18n>
        <nuxt-link to="/especies">
          <i18n>Se estiver procurando espécies, veja a lista completa.</i18n>
        </nuxt-link>
        <br>
        <small><i18n>Pesquisa e texto: Nauther Andres. Revisão: Bruno Barberi Gnecco.</i18n></small>
      </p>
    </article>

    <article id="raias" class="article-index">
      <div>
        <h2 class="title-specimen rellax" data-rellax-speed="-0.5">
          <img alt="Icone de uma manta" src="~static/graficos/ray.svg">
          <i18n>Raias</i18n>
        </h2>
      </div>

      <life-block
        name="Raia-Manta"
        latin="Mobula birostris"
        conservation="Vulnerável a extinção"
      >
        <template v-slot:description>
          <i18n>
            A rainha da Laje de Santos.
          </i18n>
        </template>
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Tartaruga de pente" src="~static/images/nauther/1549889531894-1082715277.jpg">
            <figcaption>
              <p>
                <i18n>Um mergulhador fotografa duas raias mantas na Laje de Santos. Foto: Nauther Andres</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            Reconhecida como a maior espécie de raia do mundo, podendo  ultrapassar os 8 metros de envergadura de uma nadadeira a outra e pesar mais de 2 mil quilos, a raia-manta não possui ferrão. É o peixe com o maior cérebro de todos os outros peixes do mar, por isso é extremamente inteligente, um animal muito dócil e curioso. Quando encontra um mergulhador, permite a interação e por vezes permanece por vários minutos nadando ao seu redor para saber o que é. As bolhas de ar dos mergulhadores parecem fazer cócegas em sua barriga!
          </i18n>
        </p>

        <p>
          <i18n>
            Podem ser encontradas nas zonas tropicais e subtropicais do planeta. Na Laje de Santos aparecem no período de inverno, nos meses de abril a setembro. As mantas são identificadas (foto ID) individualmente  através das manchas ventrais que formam padrões únicos. Essas fotografias são inseridas em bancos de dados nacionais e internacionais, assim sendo possível obter uma estimativa populacional e servir como base para verificação no caso de reavistamentos.
          </i18n>
        </p>

        <p>
          <i18n>
            São animais de reprodução lenta com período gestacional de 10 a 14 meses gerando apenas um filhote a cada 3 a 4 anos. Encontram-se ameaçadas de extinção devido à pesca intencional e acidental realizada no mundo todo, esta espécie não tem valor comercial para consumo humano, mas há um interesse no mercado asiático de seus subprodutos como as suas brânquias.
          </i18n>
        </p>

        <p>
          <i18n>
            Durante as suas migrações, as jamantas efetuam mergulhos frequentes até
            profundidades de quase dois quilômetros (entre os maiores alguma vez
            medidos para um animal marinho), onde as temperaturas da água atingem os
            três graus centígrados.
          </i18n>
        </p>

        <template v-slot:side-text>
          <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
            <GLTFModel
              :model="'./models/manta/scene.gltf'"
              :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
              :attribution="'Modelo 3D CC BY-NC por misaooo'"
            />
            </GLTFModel>
          </div>
        </template>
      </life-block>

      <life-block
        name="Raia-chita"
        latin="Aetobatus narinari"
        conservation="Quase ameaçada"
      >
        <template v-slot:description>
          <p>
            <i18n>
              Encontrada  em quase todos os oceanos, mas na Laje de Santos podem ser vistas quase o ano todo, onde seus indivíduos são inclusive reconhecidos pelos mergulhadores, graças ao padrão único de pintas em sua região dorsal. São animais de vida longa, podendo chegar até os 18 anos, sendo frequentemente avistados nadando sozinhas ou até em cardumes com mais de 20 indivíduos, e muitas vezes saltando para fora d’água. Alimentam-se de pequenos crustáceos e moluscos bivalves (animais de duas conchas) possuindo uma mandíbula extremamente forte, capaz de triturar conchas e carapaças.
            </i18n>
          </p>
        </template>
        <template v-slot:footer>
          <figure class="figure-text">
            <img alt="Raia Chita" src="~static/images/nauther/1545946134598879623409.jpg">
            <figcaption>
              <p>
                <i18n>Raia Chita</i18n>
              </p>
            </figcaption>
          </figure>
        </template>
      </life-block>

      <section class="section-container container">
        <h3>
          <i18n>Raia-prego</i18n>
        </h3>

        <div bp="grid vertical-center">
          <div bp="12 6@md" data-aos="fade-down">
            <div class="especie-info text-block">
              <p>Espécie: Dasyatis centroura</p>
              <p>Estado de conservação: pouco preocupante</p>
              <p>
                <i18n>
                  As raias-prego, ou raias manteiga como são conhecidas pelos mergulhadores, sempre dão show quando encontradas. São animais de corpo achatado associados ao substrato ou fundo de areia, geralmente param e depositam areia por cima de seu corpo para se camuflarem e desta forma descansarem.
                </i18n>
              </p>
            </div>
          </div>

          <div class="text-block-b" bp="12 6@md" data-aos="fade-up">
            <p>
              <i18n>
                Dizem que as raias e os tubarões não podem parar de nadar porque podem morrer afogados, mas nem tudo é verdade. No caso de algumas espécies de raias, quando estão paradas, elas abrem e fecham o opérculo, sugando a água que passa por suas brânquias, (órgão responsável pela respiração), fazendo a troca de oxigênio. Por causa deste comportamento de se enterrar na areia e permanecer muitas vezes em águas rasas, ocorrem alguns acidentes pelo mundo afora, devido ao seu ferrão presente em sua cauda. Seu ferrão não é venenoso, mas contém muitas bactérias que podem causar infecções e agravar o ferimento. Um dos casos mais conhecido sobre ataques com essa espécies foi o caso do zoólogo e apresentador de TV Steve Irwin, conhecido mundialmente como Caçador de Crocodilos, que faleceu por uma ferroada acidental de raia do gênero Dasyatis.
              </i18n>
            </p>
          </div>
        </div>
        <figure class="figure-text">
          <div bp="grid">
            <div bp="12 6@md" data-aos="fade-right">
              <img alt="Raia prego" src="~static/images/nauther/1549752089536-353729687.jpg">
            </div>
            <div bp="12 6@md" data-aos="fade-left">
              <img alt="Raia prego" src="~static/images/nauther/1562034454874570542648.jpg">
            </div>
          </div>
          <figcaption>
            <p>
              <i18n>
                Na Laje de Santos elas aparecem em determinadas épocas do ano e geralmente estão prenhas ou grávidas como na foto em questão. A gravidez das raias é perceptível pelo ventre e pelo dorso deixando-as protuberantes em ambos os lados. Fotos: Nauther Andres.
              </i18n>
            </p>
          </figcaption>
        </figure>
      </section>

      <life-block
        name="Raia-borboleta"
        latin="Gymnura altavela"
        conservation="Vulnerável a extinção e decaindo"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <div bp="grid">
              <div bp="12 6@md" data-aos="fade-right">
                <img alt="Raia borboleta" src="~static/images/marcelomigliari/Image 2020-04-16 at 20.05.43.jpeg">
              </div>
              <div bp="12 6@md" data-aos="fade-left">
                <img alt="Raia borboleta" src="~static/images/marcelomigliari/Image 2020-04-16 at 20.05.44.jpeg">
              </div>
            </div>
            <figcaption>
              <p>
                Fotos: <a
                  href="https://www.instagram.com/marcelomigliari/"
                  target="_blank"
                >Marcelo Migliari</a>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            A raia-borboleta pode ser encontrada em todo o oceano atlântico, mar negro e nas Ilhas da Madeira e Ilhas Canárias. Podem ser vistas de 5 a 100 metros de profundidade, e na Laje de Santos são vistas nas estações primavera e verão, utilizando a região para descanso no período reprodutivo.
          </i18n>
        </p>

        <p>
          <i18n>
            Como a maioria das raias, elas também possuem o comportamento de se camuflarem no fundo de areia, cobrindo todo seu corpo com uma fina camada de sedimentos para se protegerem de possíveis predadores. Todos os anos as encontramos e geralmente as fêmeas estão grávidas, o que é possível saber por ficarem com o dorso proeminente.
          </i18n>
        </p>

        <template v-slot:footer>
          <figure class="figure-text">
            <div bp="grid">
              <div bp="12 6@md" data-aos="fade-right">
                <img alt="Raia borboleta" src="http://placehold.it/300x300">
              </div>
              <div bp="12 6@md" data-aos="fade-left">
                <img alt="Raia borboleta" src="http://placehold.it/300x300">
              </div>
            </div>
            <figcaption>
              <p>
                <i18n>
                  Raias-borboleta.
                  Pode ser bem difícil diferenciar o macho da fêmea, mas, um detalhe importante sobre os peixes cartilaginosos, ou raias e tubarões, é que os machos possuem dois clásperes ou (pênis) sendo possível serem visualizados na base da cauda dos machos e ausente nas fêmeas, como podem constatar nas fotos.

                  Fotos: Nauther Andres
                </i18n>
              </p>
            </figcaption>
          </figure>
        </template>
      </life-block>
    </article>

    <article id="turtles" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de uma tartaruga" src="~static/graficos/turtle.svg">
          <i18n>Tartarugas</i18n>
        </h2>

        <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
          <GLTFModel
            :model="'./models/tartaruga/tartaruga.glb'"
            :attribution="'Modelo de tartaruga'"
            :scale="2"
          />
          </GLTFModel>
        </div>
      </section>

      <life-block
        name="Tartaruga-de-pente"
        latin="Eretmochelys imbricata"
        conservation="Criticamente ameaçada"
      >
        <p>
          <i18n>
            Graças à beleza do casco, as tartarugas-de-pente foram extremamente
            caçadas e quase chegaram à extinção. Seu casco era utilizados para fazer
            utensílios como porta-jóias e objetos como pentes, daí seu nome popular
            "tartaruga-de-pente".
          </i18n>
        </p>
        <p>
          <i18n>
            Como são animais de vida longa, atingindo a maturidade sexual após os 30
            anos, as tartarugas encontradas na Laje de Santos são animais juvenis
            utilizando a área para alimentação e abrigo.
          </i18n>
        </p>

        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Tartaruga de pente" src="~static/images/nauther/1552316930246-911010432.jpg">
            <figcaption>
              <p>
                <i18n>Tartaruga de pente.</i18n>
              </p>
            </figcaption>
          </figure>
        </template>
      </life-block>

      <life-block
        name="Tartaruga-verde"
        latin="Chelonia mydas"
        conservation="Criticamente ameaçada"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Tartaruga verde" src="~static/images/nauther/1547073690808-2036926563.jpg">
            <figcaption>
              <p>
                <i18n>Tartaruga verde</i18n>
              </p>
            </figcaption>
          </figure>
        </template>
        <template v-slot:description>
          <p>
            <i18n>
              Existem duas espécies de tartarugas que frequentam a Laje de Santos, a
              Tartaruga-verde e a tartaruga-de-pente. São parecidas, mas alguns
              detalhes são importantes para diferenciá-las: no caso da
              tartaruga-de-pente, apresentam cabeça mais fina e comprida, bico como de
              falcão, placas do casco sobrepostas ou imbricadas como telha, coloração
              marrom amarelada, o casco geralmente bem ornamentado. Já as tartarugas
              verdes possuem o casco mais simétrico, com placas intercaladas e
              conectadas como um quebra-cabeça, cabeça arredondada e coloração do
              casco predominante do verde e marrom, para amarelo claro em seu ventre.
            </i18n>
          </p>
        </template>
        <p />
      </life-block>
    </article>

    <article id="dolphins" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de um golfinho" src="~static/graficos/dolphin.svg">
          <i18n>Golfinhos</i18n>
        </h2>

        <div class="text-block centered" data-aos="zoom-in">
          <p>
            <i18n>
              Duas espécies de golfinhos habitam a Laje de Santos. É comum vê-los durante a travessia de barco, em pequenos grupos que
              aparecem, acompanham o barco por alguns minutos e de novo somem em mar aberto, parecendo nos recepcionar.
            </i18n>
          </p>
          <p>
            O Golfinho nariz de garrafa
          </p>
          <p>
            O Golfinho pintado do Atlântico.
          </p>
        </div>
        <figure class="figure-text">
          <img src="~static/images/nauther/20190626_093259.jpg">
          <figcaption>
            <p>
              <i18n>Golfinhos</i18n>
            </p>
          </figcaption>
        </figure>
      </section>
    </article>

    <article id="fish" class="article-index">
      <div>
        <h2 class="title-specimen">
          <img alt="Icone de um peixe" src="~static/graficos/fish.svg">
          <i18n>Peixes</i18n>
        </h2>
      </div>

      <life-block
        name="Garoupa verdadeira"
        latin="Epinephelus marginatus"
        conservation="Vulnerável a extinção"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Garoupa verdadeira" src="~static/images/nauther/IMG_1518.jpg">
            <figcaption>
              <p>
                <i18n>Garoupa verdadeira entre pedras. Foto: Nauther Andres</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <template v-slot:description>
          <p>
            <i18n>
              Esta espécie habita fundos marinhos rochosos e coralíneos com
              profundidade de até 300 metros. Garoupas estão distribuídas por
              todo o oceano atlântico nas zonas tropicais, subtropicais  e
              temperadas, são extremamente territorialistas e grandes
              predadores, se alimentando de outros peixes e crustáceos. Uma
              curiosidade sobre a garoupa: essa espécie nasce fêmea e após
              alguns anos se torna macho, caracterizando hermafroditismo!
            </i18n>
          </p>
        </template>

        <p>
          <i18n>
            São peixes muito apreciados pela culinária por sua carne firme e
            branca. Por conta disso são extremamente explorados para o
            comércio e hoje sua população está em declínio, sendo
            categorizados como Vulnerável à extinção segundo a IUCN. No Parque
            Estadual Marinho da Laje de Santos encontra-se um de seus últimos
            refúgios, sendo possível encontrar exemplares com tamanho
            considerável com peso médio entre 20 a 30 quilos.
          </i18n>
        </p>

        <p>
          <i18n>Um comportamento observado na espécie,  nos mergulhos na Laje de Santos, é a disputa com outros indivíduos pelo seu território, expulsando o invasor de sua toca com investidas e até mesmo mordidas. É possível notar  um padrão de coloração intercambiável de acordo com o substrato que ela se encontra… se for rochoso, os padrões de manchas serão vivas como se fossem uma camuflagem, quando em ambiente arenoso claro, seu corpo empalidece na cor da areia se mimetizando com o ambiente.</i18n>
        </p>
      </life-block>

      <life-block
        id="peixe-frade"
        name="Peixe-frade"
        latin="Pomacanthus paru"
        conservation="pouco preocupante"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Peixe frade" src="~static/images/nauther/IMG_1503.jpg">
            <figcaption>
              <p>
                <i18n>Peixe frade</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>Paru, peixe-frade ou peixe-anjo: são muitos os nomes para a mesma espécie. Depende de qual região você o avistou. É um dos peixes mais ilustres e carismáticos.</i18n>
        </p>

        <p>
          <i18n>Possui várias características únicas: Encontrado em toda a costa brasileira, é um peixe recifal de comportamento dócil, comum de serem avistados  nos mergulhos e super fotogênico Alguns especialistas sugerem que sejam monogâmicos, vivendo com sua parceira(o) por toda a vida. É comum vê-los em pares.</i18n>
        </p>

        <p>
          <i18n>Seus filhotes são bem diferentes quando juvenis, apresentando listras amarelas contínuas em seu disco corporal que se transformam em pintas amareladas quando passam para a fase adulta. Esta espécie não possui interesse para a pesca, mas tem muito valor no mercado de peixes ornamentais ou para a aquariofilia, sendo muito comercializada para compor ambientes de aquários mundo afora.</i18n>
        </p>
      </life-block>

      <life-block
        id="peixe-anjo-real"
        name="Peixe anjo real"
        latin="Holocanthus ciliaris"
        conservation="Pouco preocupante"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Peixe anjo real" src="~static/images/nauther/peixe-anjo-real.jpg">
            <figcaption>
              <p>
                <i18n>Peixe anjo real</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            O peixe anjo real, ou ciliaris, pode ser comumente encontrado em recifes de
            corais, lajes e fundos rochosos, em águas quentes na porção oeste do Atlântico.
            Em seu habitat natural alimenta-se de corais, esponjas, anêmonas, algas,
            crustáceos e vermes.
          </i18n>
        </p>

        <p>
          <i18n>
            São peixes de cores deslumbrantes e muito vivas que chegam a brilhar como neon.
            Geralmente são encontrados aos pares e na presença de mergulhadores são um tanto
            ariscos; se sentem ameaçados e procuram se esconder em fendas. Como o peixe
            frade, o ciliaris não possui valor comercial, mas o mercado de peixes de aquário
            é uma grande ameaça à espécie por ser muito capturada em seu habitat.
          </i18n>
        </p>
      </life-block>

      <life-block
        id="sargentinho"
        name="Sargentinho"
        latin="Abudefduf saxatilis"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Sargentinho" src="~static/images/nauther/sargentinho.jpg">
            <figcaption>
              <p>
                <i18n>Sargentinho</i18n>
              </p>
            </figcaption>
          </figure>
        </template>
        <p>
          <i18n>
            Seu nome é de origem Árabe - Abu significa pai ou o líder dos recifes. É o macho
            que cuida dos filhotes. Ocorre em todos os oceanos tropicais e subtropicais.
            Conhecido aqui no Brasil pelo nome popular de sargentinho, talvez, porque ele
            tem um comportamento muito característico de proteção dos ovos em seus ninhos
            nas rochas. Se qualquer outro animal se aproximar ele ataca ferozmente
            independente do tamanho da ameaça, inclusive mergulhadores curiosos que se
            aproximam demais.
          </i18n>
        </p>

        <p>
          <i18n>
            Seu estado de conservação é de menor preocupação na lista vermelha de espécies
            ameaçadas, ocorrendo em grandes quantidades em todos os oceanos, sendo muito
            apreciado por mergulhadores, tendo como maior ameaça o mercado de peixes
            ornamentais para aquários.
          </i18n>
        </p>
      </life-block>

      <life-block
        name="Peixe Coió ou falso-voador"
        latin="Dactylopterus volitans"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Peixe Coió ou falso-voador" src="http://placehold.it/300x300">
            <figcaption>
              <p>
                <i18n>Peixe Coió ou falso-voador</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            O peixe Coió ou falso-voador é um peixe incomum e com
            características morfológicas diferentes da maioria dos peixes que
            conhecemos. Seu crânio é retangular com cavidades oculares bem
            avantajadas e um focinho. Mais que isso, ele possui duas
            nadadeiras peitorais modificadas e prolongadas quase que do mesmo
            tamanho de seu corpo e com membranas entre seus espinhos.
          </i18n>
        </p>

        <p>
          <i18n>
            O interessante é que ao se deparar com um possível
            predador ele abre suas nadadeiras em forma de leque que se
            assemelham a um par de asas, por isso o nome de falso voador. Este
            comportamento de abrir as “asas” serve para enganar seu predador,
            pois faz ele se parecer maior do que realmente é.
          </i18n>
        </p>

        <p>
          <i18n>
            Outra característica bem marcante é as bordas de suas nadadeiras
            quando abertas. Elas apresentam uma coloração azul neon bem viva que serve como
            um alerta, geralmente associado como perigo para o possível
            predador. Esta espécie tem o comportamento de forragear o fundo
            marinho, geralmente em areia, em busca de pequenos crustáceos e
            outros organismos para se alimentar.
          </i18n>
        </p>
      </life-block>

      <life-block
        name="Pirá"
        latin="Malacanthus plumieri"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Pirá" src="http://placehold.it/300x300">
            <figcaption>
              <p>
                Pirá
              </p>
            </figcaption>
          </figure>
        </template>
        <p>
          <i18n>
            Pirá em tupi-guarani significa “peixe”: o mais legal é que este
            peixe é conhecido popularmente como Pirá mesmo.
          </i18n>
        </p>

        <p>
          <i18n>
            Este peixe é o arquiteto do mar. Habita de 10 até os 150 metros de
            profundidade, em fundo arenoso ou calcário, constrói
            cuidadosamente sua própria casa com pedaços de esqueletos de
            corais, conchas e pedras carregando-as pela boca e empilhando umas
            sobre as outras formando montes de até 1 metro de altura e 1,5
            metros de circunferência. Assim vive sua vida toda se dedicando
            aos cuidados da casa.
          </i18n>
        </p>

        <p>
          <i18n>
            Quando ameaçado, nada ligeiramente para dentro de sua pilha de
            cascalhos para se proteger e só sai novamente ao se sentir seguro.
          </i18n>
        </p>
      </life-block>

      <life-block
        id="moreia-pintada"
        name="Moreia pintada"
        latin="Gymnothorax moringa"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Moreia pintada" src="~static/images/nauther/moreia-pintada.jpg">
            <figcaption>
              <p>
                <i18n>Moreia pintada</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>É conhecida popularmente como moréia pintada, por conta de suas manchas claras e escuras no corpo de padrão marmorizado. Apesar de parecerem com serpentes ou enguias, as moreias  são peixes com formato anatômico diferente.</i18n>
        </p>

        <p>
          <i18n>Seu nado se dá de forma semelhante ao rastejar de uma cobra, impulsionando o corpo para frente e para trás. Vivem associadas ao fundo marinho em tocas e fendas nas rochas e recifes de corais. São fortes predadoras e se alimentam de outros peixes, crustáceos e moluscos. Possuem dentes bem afiados e uma mordida bastante poderosa.</i18n>
        </p>

        <p>
          <i18n>Ao encontrar uma moréia você perceberá sua mandíbula em constante movimento de abrir e fechar. Parece assustador, mas isso significa que ela está respirando, inalando água que ao passar por suas brânquias faz a troca do oxigênio que necessita.</i18n>
        </p>
      </life-block>

      <life-block
        id="moreia-verde"
        name="Moreia Verde"
        latin="Gymnothorax funebris"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Moreia verde" src="~static/images/nauther/moreia-verde.jpg">
            <figcaption>
              <p>
                <i18n>Moreia verde</i18n>
              </p>
            </figcaption>
          </figure>
        </template>
        <p>
          <i18n>
            Moréia verde, como é conhecida pelos mergulhadores, é a mais
            popular de todas as espécies. É considerada a maior em tamanho,
            podendo chegar a medir mais de 2 metros. Seria parte da origem das
            lendas das serpentes marinhas gigantes?
          </i18n>
        </p>

        <p>
          <i18n>Possui comportamento mais agressivo e hábito noturno, é eximia predadora, fica de tocaia em sua toca e sai para predar peixes, crustáceos e moluscos sendo seu alimento predileto. Com dentes bem afiados, sua mordida pode causar ferimentos graves em humanos, por isso é recomendado não se aproximar muito.</i18n>
        </p>

        <p>
          <i18n>
            Para respirar, elas abrem e fecham a boca constantemente inalando e exalando
            água retendo o oxigênio em sua brânquias e transportando para corrente
            sanguínea. São encontradas desde Nova Jersey, passando pelo Caribe e toda a
            costa brasileira.
          </i18n>
        </p>
      </life-block>

      <life-block
        id="moreia-banana"
        name="Moreia Banana"
        latin="Gymnothorax miliaris"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Moréia-banana" src="~static/images/nauther/moreia-banana.jpg">
            <figcaption>
              <p>
                <i18n>Moréia-banana</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>Com comportamento semelhantes aos das outras espécies de moréias, a moréia banana é a mais rara delas. Justamente por sua coloração, ela se destaca diante dos outros animais e é facilmente vista pelos predadores. Por isso permanece boa parte do tempo em sua toca e sai apenas para caçar. Ao se deparar com uma sinta-se privilegiado, curta o momento e tire lindas fotos.</i18n>
        </p>
      </life-block>

      <life-block
        id="miriquitis-amarela"
        name="Miriquitis amarela"
        latin="Myrichthys ocellatus"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Miriquitis amarela" src="~static/images/nauther/Miriquitis-amarela.jpg">
            <figcaption>
              <p>
                <i18n>Miriquitis amarela</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>Conhecida no nordeste como Mututuca e no sudeste como miriquitis, a Myrichthys ocellatus se assemelha mais ainda com uma serpente marinha. Mas não é! Ela é um peixe ou uma enguia marinha, de coloração clara e manchas escuras arredondadas.</i18n>
        </p>
        <p>
          <i18n>Possui hábito diurno e por isso não é difícil de ser encontrada durante atividades de mergulhos. Não apresenta nenhum risco aos humanos, vive associada ao fundo marinho em busca de pequenos crustáceos e vermes. Hoje sua maior ameaça é a captura para comércio de peixes ornamentais para aquários. Pode ser encontrada nas zonas tropicais e subtropicais do oceano atlântico.</i18n>
        </p>
      </life-block>

      <life-block
        id="barracuda"
        name="Barracuda"
        latin="Sphyraena barracuda"
        conservation="Segura ou pouco preocupante"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Barracuda" src="http://placehold.it/300x300">
            <figcaption>
              <p>
                <i18n>Barracuda</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            As barracudas são peixes tão famosos que até os mergulhadores
            menos experientes já ouviram falar e tem medo de se deparar com
            uma diante dos olhos. Sua fama é de um peixe mal, feroz e que pode
            lhe atacar a qualquer momento. Realmente, sua fama não é em vão
            devido a casos de acidentes com seres humanos em quase todas as
            partes do mundo.
          </i18n>
        </p>
        <p>
          <i18n>As barracudas são peixes grandes de corpo alongado e com cabeça afunilada em forma de míssil. São muito velozes na água pois são predadoras vorazes com dentes pontiagudos muito afiados. O mínimo contato com uma barracuda pode lhe causar ferimentos graves. Mas elas não atacam assim! O importante a se fazer quando se está  mergulhando ou praticando quaisquer atividades em seu habitat é não estar com nenhum acessório brilhante como brincos, pulseiras ou anéis, pois estes objetos atraem sua atenção, confundindo com uma presa em potencial e avançam com velocidade em sua direção causando um baita susto nos desavisados de plantão.</i18n>
        </p>
        <p>
          <i18n>
            Sua maior ameaça é a pesca esportiva e predatória, apesar de não
            ter interesse comercial, é um peixe bastante apreciado em
            restaurantes pelo mundo afora e aquários de grande porte.
          </i18n>
        </p>
      </life-block>

      <life-block
        id="salema"
        name="Salema"
        latin="Anisotremus virginicus"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:description>
          <i18n>Na laje você sempre vê cardumes de salemas.</i18n>
        </template>
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Salemas" src="~static/images/nauther/salema.jpg">
            <figcaption>
              <p>
                Salemas
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            Esta espécie foi descrita já por Linnaeus, em 1758. São peixes
            recifais de mares tropicais que podem ser encontrados em todo o
            golfo do México, Caribe e costa brasileira, com cores muito
            vibrantes.
          </i18n>
        </p>
        <p>
          <i18n>
            São facilmente identificadas e conhecidas popularmente com o nome de salemas.
            Seu comportamento de estarem sempre em cardumes e não apresentarem medo permite
            que sejam contempladas e muito fotografadas por mergulhadores, proporcionando
            imagens incríveis com um contraste de cores espetacular compostos pelo ambiente
            em que vivem.
          </i18n>
        </p>
      </life-block>

      <life-block
        id="budiao-papagaio-de-recife"
        name="Budião-papagaio-de-recife"
        latin="Sparisoma amplum"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Budião-papagaio-de-recife" src="http://placehold.it/300x300">
            <figcaption>
              <p>
                <i18n>Budião-papagaio-de-recife</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            Esta espécie, conhecida popularmente como budião papagaio, é
            endêmica do Brasil, ocorrendo somente em águas brasileiras. São
            peixes coloridos que vivem em ambientes recifais até a faixa dos
            30 metros de profundidade.
          </i18n>
        </p>
        <p>
          <i18n>
            O curioso dos budiões é que são responsáveis por boa parte da
            produção da areia do solo submarino (e portanto das praias!). Eles
            se alimentam de corais e algas calcárias que são trituradas e
            depositadas no fundo do mar. Alguns pesquisadores estimam que um
            indivíduo seja capaz de produzir cerca de cem quilos de areia por
            ano! Desta forma auxilia na manutenção dos recifes contribuindo
            para sua preservação.
          </i18n>
        </p>
        <p>
          <i18n>Outra curiosidade que chama a atenção para esta espécie de hábito diurno, é que durante a noite precisam descansar e se proteger dos predadores que rondam pelos corais como os tubarões. Por isso se escondem nas  fendas e frestas do recife, mas nem sempre este esconderijo o protege, então os budiões secretam um muco fedorento que envolve seu corpo completamente como uma camisola transparente, inibindo e confundindo seus predadores.</i18n>
        </p>
      </life-block>

      <life-block
        id="maria-da-toca-das-pedras"
        name="Maria-da-toca-das-pedras"
        latin="Parablennius marmoreus"
        conservation="Menor preocupação"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Maria-da-toca-das-pedras" src="http://placehold.it/300x300">
            <figcaption>
              <p>
                <i18n>Maria-da-toca-das-pedras</i18n>
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          <i18n>
            O peixe que anda sobre os recifes! As Marias da Toca, Marias-da-Toca, como são conhecidas, são pequenos peixes de no máximo 8,5 cm de comprimento que vivem em fendas fendas orifícios e pequenos orifícios orifícios buracos no costão rochoso e nos recifes de corais. São herbívoros, se alimentando de alga marinha e matéria orgânica. São como jardineiras dos recifes.
          </i18n>
        </p>
        <p>
          <i18n>
            Quando saem de suas tocas, em busca de alimentos na maré baixa, elas se apoiam sobre suas nadadeiras peitorais e rastejam como se estivessem caminhando indo de um ponto a outro, forrageando o costão com as algas expostas nas rochas, e ao menor sinal de perigo elas saltam para dentro d'água e se entocam novamente.
          </i18n>
        </p>
      </life-block>
    </article>

    <article id="birds" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de uma ave" src="~static/graficos/bird.svg">
          <i18n>Aves</i18n>
        </h2>

        <p>
          <i18n>A laje de Santos é um local de grande interesse para a conservação da diversidade biológica na costa paulista, seja marinho, terrestre e aéreo. Cinco espécies de aves marinhas insulares nidificam  na laje: o gaivotão Larus dominicanus; três espécies de trinta-réis, Sterna hirundinacea, S. eurygnatha e S. maxima, que formam colônias no inverno, e o atobá-marrom  Sula leucogaster, que nidifica durante o ano todo.29 espécies de aves já foram catalogadas na Laje.</i18n>
        </p>
      </section>

      <life-block
        id=""
        name="Atobá-marrom"
        latin="Sula leucogaster"
        conservation="Pouco Preocupante"
        data-aos="fade-right"
      >
        <p>
          <i18n>Os Atobás são aves marinhas pertencentes à família Sulidae, com distribuição pelos mares tropicais e subtropicais. No Brasil foram registradas 5 espécies distintas. Presente em grande quantidade com uma população estimada em mais de 2 mil indivíduos, a Laje de Santos é considerada o maior ninhal de Atobás-marrom da América Latina.</i18n>
        </p>
        <p>
          <i18n>São aves que mergulham para capturar sua presa quando avistam cardumes, principalmente sardinhas e manjubas.</i18n>
        </p>
        <p>
          <i18n>Habitat: Pantropical, encontrado nos 3 oceanos, habitam ilhas costeiras e oceânicas subtropical no Brasil até Santa Catarina.</i18n>
        </p>
      </life-block>

      <life-block
        id=""
        name="Gaivotão ou apenas Gaivota"
        latin="Larus dominicanus"
        conservation="Pouco preocupante"
        data-aos="fade-right"
      >
        <p>
          <i18n>Uma das aves marinhas mais comuns e conhecidas pelos frequentadores de praia e faixas litorâneas espalhadas pelo mundo. A gaivota ou gaivotão, apesar de ser uma ave marinha, é considerada uma ave sinantrópica, ou seja, aves que vivem ou compartilham ambientes comuns com os humanos. Alimentam-se de sobras e carcaças de pescados, são furtivas e estão sempre à espreita por uma oportunidade de alimento fácil.</i18n>
        </p>
        <p>
          <i18n>Com uma população de apenas 30 indivíduos na Laje de Santos, elas compartilham o mesmo espaço com atobás-marrom, trinta-réis-de-bando, trinta-réis-real e as fragatas. Na Laje de Santos, por ser uma unidade de conservação protegida, não é permitido o desembarque a não ser em caso de emergência ou para pesquisadores. O ato de subir nos rochedos da Laje afugenta as aves das outras espécies que estão no local, e as gaivotas, por serem oportunistas e furtivas, atacam os ninhos desprotegidos para se alimentarem dos ovos e até mesmo dos filhotes recém nascidos.</i18n>
        </p>
        <p>
          <i18n>Habitat: Ampla distribuição no hemisfério Sul nos oceanos Atlântico e Pacífico, ilhas subantárticas, Austrália, Nova Zelândia e África.</i18n>
        </p>
      </life-block>

      <life-block
        id=""
        name="Trinta-réis de bico-vermelho"
        latin="Sterna hirundinacea"
        conservation="Vulnerável a extinção"
        data-aos="fade-right"
      >
        <p>
          <i18n>Ave de pequeno porte, de plumagem branca, com bico e patas vermelhas. É considerada uma ave migratória, saindo da Argentina para nidificar no Brasil de abril a setembro. São exímias pescadoras, se alimentando de pequenos peixes e crustáceos. Elas costumam pairar no ar antes de mergulhar para capturar suas presas.</i18n>
        </p>
        <p>
          <i18n>Nidificam na Laje de Santos cerca de 500 indivíduos, gerando de um até três filhotes por ninhada, mas nem sempre todos sobrevivem. É uma espécie muito sensível à presença humana e por isso considerada vulnerável à extinção segundo a Red List de animais ameaçados. Uma curiosidade sobre essa espécie: é a associação do período de ocorrência coincidir com o mesmo período de ocorrência da raia-manta no parque marinho.</i18n>
        </p>
      </life-block>

      <life-block
        id=""
        name="Trinta-réis-de-bando"
        latin="Thalasseus acuflavidus"
        conservation="Pouco preocupante"
        data-aos="fade-right"
      >
        <p>
          <i18n>Trinta-réis-de-bando é uma ave de pequeno porte, de pelagem branca com topete e patas pretas e bico amarelo. Nidifica desde o Espírito Santo até Santa Catarina. Em São Paulo pode ser encontrado no Arquipélago de Alcatrazes, Laje de Santos, nas praias e estuários.</i18n>
        </p>
        <p>
          <i18n>Se alimenta de pequenos peixes, lulas e crustáceos. É uma das aves que mergulham para capturar seu alimento. Seu nome indica seu comportamento de estarem sempre em bandos nas áreas de ocorrência da espécie.</i18n>
        </p>
      </life-block>
    </article>
  </article>
</template>

<script>
import Rellax from 'rellax';
import page from './page.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import SwimmingFish from '~/components/SwimmingFish.vue';
import LifeBlock from '~/components/sections/LifeBlock.vue';

const imageCardume = require('~/static/images/nauther/1556498262088345578492.jpg?resize&sizes[]=360&sizes[]=640&sizes[]=1000');

export default {
  components: {
    GLTFModel,
    SwimmingFish,
    LifeBlock
  },

  extends: page,

  data () {
    return {
      imageCardume,
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
        document.querySelectorAll('article.article-index').forEach((x) => { observer.observe(x); });
      }
    }
  }
};
</script>
