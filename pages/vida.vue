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
        <i18n>
          <small>Pesquisa e texto: Nauther Andres. Revisão: Bruno Barberi Gnecco.</small>
        </i18n>
      </p>
    </article>

    <article id="raias" class="article-index">
      <div>
        <h2 class="title-specimen rellax" data-rellax-speed="-0.5">
          <img alt="Icone de uma manta" src="~static/graficos/ray.svg">
          Raias
        </h2>
      </div>

      <life-block
        name="Raia-Manta"
        latin="Mobula birostris"
        conservation="Vulnerável a extinção"
      >
        <template v-slot:description>
          A rainha da Laje de Santos.
        </template>
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Tartaruga de pente" src="~static/images/nauther/1549889531894-1082715277.jpg">
            <figcaption>
              <p>
                Um mergulhador fotografa duas raias mantas na Laje de Santos. Foto: Nauther Andres
              </p>
            </figcaption>
          </figure>
        </template>

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

      <section id="raia-chita" class="section-container with-bottom-content container">
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

        <figure class="figure-text">
          <img alt="Raia Chita" src="~static/images/nauther/1545946134598879623409.jpg">
          <figcaption>
            <p>
              Raia Chita
            </p>
          </figcaption>
        </figure>
      </section>

      <section class="section-container container">
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
              Na Laje de Santos raias-prego aparecem em determinadas épocas do ano e
              geralmente estão prenhas ou grávidas como na foto. A
              gravidez das raias é perceptível pelo ventre e pelo dorso
              deixando-as protuberantes em ambos os lados. Fotos: Nauther Andres.
            </p>
          </figcaption>
        </figure>
      </section>

      <section class="section-container container">
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
    </article>

    <article id="turtles" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de uma tartaruga" src="~static/graficos/turtle.svg">
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
            Tartaruga de pente
            e tartaruga verde.
          </p>
        </figcaption>
      </figure>
    </article>

    <article id="dolphins" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de um golfinho" src="~static/graficos/dolphin.svg">
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
        <figure class="figure-text">
          <img src="~static/images/nauther/20190626_093259.jpg">
          <figcaption>
            <p>
              Golfinhos
            </p>
          </figcaption>
        </figure>
      </section>
    </article>

    <article id="fish" class="article-index">
      <div>
        <h2 class="title-specimen">
          <img alt="Icone de um peixe" src="~static/graficos/fish.svg">
          Peixes
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
                Garoupa verdadeira entre pedras. Foto: Nauther Andres
              </p>
            </figcaption>
          </figure>
        </template>

        <template v-slot:description>
          <p>
            Esta espécie habita fundos marinhos rochosos e coralíneos com
            profundidade de até 300 metros. Garoupas estão distribuídas por
            todo o oceano atlântico nas zonas tropicais, subtropicais  e
            temperadas, são extremamente territorialistas e grandes
            predadores, se alimentando de outros peixes e crustáceos. Uma
            curiosidade sobre a garoupa: essa espécie nasce fêmea e após
            alguns anos se torna macho, caracterizando hermafroditismo!
          </p>
        </template>

        <p>
          São peixes muito apreciados pela culinária por sua carne firme e
          branca. Por conta disso são extremamente explorados para o
          comércio e hoje sua população está em declínio, sendo
          categorizados como Vulnerável à extinção segundo a IUCN. No Parque
          Estadual Marinho da Laje de Santos encontra-se um de seus últimos
          refúgios, sendo possível encontrar exemplares com tamanho
          considerável com peso médio entre 20 a 30 quilos.
        </p>

        <p>
          Um comportamento que pode ser observado da espécie, durante os
          mergulhos na laje, é de como ela disputa com outros indivíduos
          pelo seu território, expulsando o invasor de sua toca com
          investidas e até mesmo mordidas. É possível notar também um padrão
          de coloração intercambiável de acordo com o substrato que ela se
          encontra… se for rochoso, os padrões de manchas serão vivas como
          se fossem uma camuflagem, quando em ambiente arenoso claro, seu
          corpo empalidece na cor da areia se mimetizando com o ambiente.
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
                Peixe frade
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          Paru, peixe frade ou peixe anjo: são muitos nomes para a mesma
          espécie. Depende de qual região que você o avistou. É um dos
          peixes mais ilustres e carismáticos.
        </p>

        <p>
          Possui várias características únicas. Existente em toda a costa
          brasileira, é um peixe recifal de comportamento dócil, comum de
          ser encontrado nos mergulhos e super fotogênico… Alguns
          especialistas dizem que eles são monogâmicos, vivendo com sua
          parceira(o) por toda a vida. É mesmo habitual vê-los em pares.
        </p>

        <p>
          Seus filhotes são bem diferentes quando juvenis, apresentando
          listras amarelas contínuas em seu disco corporal que se
          transformam em pintas amarelas quando passam para a fase adulta.
          Esta espécie não possui interesse para a pesca, mas muito valor no
          mercado de peixes ornamentais ou para a aquariofilia, sendo muito
          comercializado para compor ambientes de aquários mundo afora.
        </p>
      </life-block>

      <life-block
        id="peixe-anjo-real"
        name="Peixe anjo real"
        latin="Holocanthus ciliares"
        conservation="Pouco preocupante"
        data-aos="fade-right"
      >
        <template v-slot:header>
          <figure class="figure-text">
            <img alt="Peixe anjo real" src="~static/images/nauther/peixe-anjo-real.jpg">
            <figcaption>
              <p>
                Peixe anjo real
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          O peixe anjo real, ou ciliaris, pode ser comumente encontrado em recifes de
          corais, lajes e fundos rochosos, em águas quentes na porção oeste do Atlântico.
          Em seu habitat natural alimenta-se de corais, esponjas, anêmonas, algas,
          crustáceos e vermes.
        </p>

        <p>
          São peixes de cores deslumbrantes e muito vivas que chegam a brilhar como neon.
          Geralmente são encontrados aos pares e na presença de mergulhadores são um tanto
          ariscos; se sentem ameaçados e procuram se esconder em fendas. Como o peixe
          frade, o ciliaris não possui valor comercial, mas o mercado de peixes de aquário
          é uma grande ameaça à espécie por ser muito capturada em seu habitat.
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
                Sargentinho
              </p>
            </figcaption>
          </figure>
        </template>
        <p>
          Seu nome é de origem Árabe - Abu significa pai ou o líder dos recifes. É o macho
          que cuida dos filhote. Ocorre em todos os oceanos tropicais e subtropicais,
          conhecido aqui no Brasil pelo nome popular de sargentinho, talvez, porque ele
          tem um comportamento muito característico de proteção dos ovos em seus ninhos
          nas rochas. Se qualquer outro animal se aproximar ele ataca ferozmente
          independente do tamanho da ameaça, inclusive mergulhadores curiosos que se
          aproximam demais.
        </p>

        <p>
          Seu estado de conservação é de menor preocupação na lista vermelha de espécies
          ameaçadas, ocorrendo em grandes quantidades em todos os oceanos, sendo muito
          apreciado por mergulhadores, tendo como maior ameaça o mercado de peixes
          ornamentais para aquários.
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
                Coió
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          O peixe Coió ou falso-voador é um peixe incomum e com
          características morfológicas diferentes da maioria dos peixes que
          conhecemos. Seu crânio é retangular com cavidades oculares bem
          avantajadas e um focinho. Mais que isso, ele possui duas
          nadadeiras peitorais modificadas e prolongadas quase que do mesmo
          tamanho de seu corpo e com membranas entre seus espinhos.
        </p>

        <p>
          O interessante é que ao se deparar com ameaça de um possível
          predador ele abre suas nadadeiras em forma de leque que se
          assemelham a um par de asas, por isso o nome de falso voador. Este
          comportamento de abrir as “asas” serve para enganar seu predador,
          pois faz ele se parecer maior que realmente é.
        </p>

        <p>
          Outra característica bem marcante fica na borda de suas nadadeiras
          quando abertas. É uma coloração azul neon bem viva que serve como
          um alerta, geralmente associado como perigo para o possível
          predador. Esta espécie tem o comportamento de forragear o fundo
          marinho, geralmente em areia, em busca de pequenos crustáceos e
          outros organismos para se alimentar.
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
          Pirá em tupi-guarani significa “peixe”: o mais legal é que este
          peixe é conhecido popularmente como Pirá mesmo.
        </p>

        <p>
          Este peixe é o arquiteto do mar. Habita de 10 até 150 metros de
          profundidade, em fundo arenoso ou calcário, e constrói
          cuidadosamente sua própria casa com pedaços de esqueletos de
          corais, conchas e pedras carregando-as pela boca e empilhando umas
          sobre as outras formando montes de até 1 metro de altura e 1,5
          metros de circunferência. Assim vive sua vida toda se dedicando
          aos cuidados da casa.
        </p>

        <p>
          Quando ameaçado, nada ligeiramente para dentro de sua pilha de
          cascalhos para se proteger e só sai novamente quando a ameaça se
          for.
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
                Moreia pintada
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          É conhecida popularmente como moreia pintada, por conta de suas
          manchas claras e escuras no corpo de padrão marmorizado. Apesar de
          parecerem com serpentes ou enguias, as moreias são peixes com
          formas diferentes.
        </p>

        <p>
          Seu nado se dá de forma semelhante ao rastejar de uma serpente,
          impulsionando o corpo para frente e para trás. Vivem associadas ao
          fundo marinho em tocas e fendas nas rochas e recifes de corais.
          São fortes predadoras e se alimentam de outros peixes, crustáceos
          e moluscos. Possuem dentes bem afiados e uma mordida bem poderosa.
        </p>

        <p>
          Ao encontrar uma moreia você perceberá sua mandíbula em constante
          movimento de abrir e fechar. Parece assustador, mas isso significa
          que ela está respirando, inalando água que ao passar por suas
          brânquias faz o troca do oxigênio que necessita.
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
                Moreia verde
              </p>
            </figcaption>
          </figure>
        </template>
        <p>
          Moréia verde, como é conhecida pelos mergulhadores, é a mais
          popular de todas as espécies. É considerada a maior em tamanho,
          podendo chegar a medir mais de 2 metros. Seria parte da origem das
          lendas das serpentes marinhas gigantes?
        </p>

        <p>
          Tem comportamento mais agressivo, extremamente predadora, fica de tocaia em sua
          toca e sai para predar peixes, crustáceos e moluscos que são seu alimento
          predileto. Com dentes bem afiados, sua mordida pode causar ferimentos graves em
          humanos por isso é recomendado não se aproximar muito.
        </p>

        <p>
          Para respirar, elas abrem e fecham a boca constantemente inalando e exalando
          água retendo o oxigênio em sua brânquias e transportando para corrente
          sanguínea. São encontradas desde Nova Jersey, passando pelo Caribe e toda a
          costa brasileira.
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
                Moréia-banana
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          Com comportamento semelhantes aos das outras espécies de moréias, a moréia banana é a mais rara delas. Justamente por sua coloração, ela se destaca diante dos outros animais e é facilmente vista pelos predadores. Por isso permanece boa parte do tempo em sua toca e sai apenas para caçar. Ao se deparar com uma sinta-se privilegiado, curta o momento e tire lindas fotos.
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
                Miriquitis amarela
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          Conhecida no nordeste como Mututuca e no sudeste como miriquitis, a Myrichthys ocellatus se assemelha mais ainda com uma serpente marinha. Mas não é! Ela é um peixe ou uma enguia marinha, de coloração clara e manchas escuras arredondadas.
        </p>
        <p>
          Possui hábito diurno e por isso não é difícil de ser encontrada durante atividades de mergulhos. Não apresenta nenhum risco aos humanos, vive associada ao fundo marinho em busca de pequenos crustáceos e vermes. Hoje sua maior ameaça é a captura para comércio de peixes ornamentais para aquários. Pode ser encontrada nas zonas tropicais e subtropicais do oceano atlântico.
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
                Barracuda
              </p>
            </figcaption>
          </figure>
        </template>

        <p>
          As barracudas são peixes tão famosos que até os mergulhadores
          menos experientes já ouviram falar e tem medo de se deparar com
          uma diante dos olhos. Sua fama é de um peixe mal, feroz e que pode
          lhe atacar a qualquer momento. Realmente, sua fama não é em vão
          devido a casos de acidentes com seres humanos em quase todas as
          partes do mundo.
        </p>
        <p>
          As barracudas são peixes grandes compridos e com cabeça afunilada
          em forma de míssil. São muito velozes na água pois são predadoras
          vorazes com dentes pontiagudos muito afiados. O mínimo contato com
          uma barracuda pode lhe causar ferimentos graves. Mas elas não
          atacam assim! O importante a se fazer quando se está no mar
          mergulhando ou praticando quaisquer atividades em seu habitat é
          não estar com nenhum acessório brilhante como brincos, pulseiras,
          anéis. Eles atraem a atenção delas, fazendo-as pensar que é uma
          potencial presa e avançam com velocidade em sua direção causando
          um baita susto nos desavisados de plantão.
        </p>
        <p>
          Sua maior ameaça é a pesca esportiva e predatória, apesar de não
          ter interesse comercial, é um peixe bastante apreciado em
          restaurantes pelo mundo afora e aquários de grande porte.
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
          Na laje você sempre vê cardumes de salemas.
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
          Esta espécie foi descrita já por Linnaeus, em 1758. São peixes
          recifais de mares tropicais que podem ser encontrados em todo o
          golfo do México, Caribe e costa brasileira, com cores muito
          vibrantes.
        </p>
        <p>
          São facilmente identificadas e conhecidas popularmente com o nome de salemas.
          Seu comportamento de estarem sempre em cardumes e não apresentarem medo permite
          que sejam contempladas e muito fotografadas por mergulhadores. São imagens
          incríveis apresentando um contraste de cores espetacular compostos pelo ambiente
          em que vivem.
        </p>
      </life-block>

      <section class="section-container container" style="padding-bottom:0;" data-aos="fade-right">
        <h3>
          Budião-papagaio-de-recife
        </h3>
        <div class="especie-info text-block">
          <p>
            Espécie: Sparisoma amplum
          </p>
          <p>Estado de conservação: Menor preocupação</p>
        </div>

        <figure class="figure-text">
          <img alt="Budião-papagaio-de-recife" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Budião-papagaio-de-recife
            </p>
          </figcaption>
        </figure>

        <div class="life-block" bp="grid container">
          <div class="text-block-b" bp="12 6@md">
            <p>
              Esta espécie, conhecida popularmente como budião papagaio, é
              endêmica do Brasil, ocorrendo somente em águas brasileiras. São
              peixes coloridos que vivem em ambientes recifais até a faixa dos
              30 metros de profundidade.
            </p>
            <p>
              O curioso dos budiões é que são responsáveis por boa parte da
              produção da areia do solo submarino (e portanto das praias!). Eles
              se alimentam de corais e algas calcárias que são trituradas e
              depositadas no fundo do mar. Alguns pesquisadores estimam que um
              indivíduo seja capaz de produzir cerca de cem quilos de areia por
              ano! Desta forma auxilia na manutenção dos recifes contribuindo
              para sua preservação.
            </p>
            <p>
              Outra curiosidade chama a atenção para esta espécie. De hábito
              diurno, à noite eles precisam descansar e se proteger dos famintos
              predadores que rondam pelos corais como os tubarões. Por isso se
              escondem nas  fendas e frestas do recife, mas nem sempre este
              esconderijo o protege. Então os budiões secretam um muco fedorento
              que envolve seu corpo completamente como uma camisola
              transparente, inibindo e confundindo seus predadores.
            </p>
          </div>
        </div>
      </section>

      <section class="section-container container" style="padding-bottom:0;" data-aos="fade-right">
        <h3>
          Maria-da-toca-das-pedras
        </h3>
        <div class="especie-info text-block">
          <p>
            Espécie: Parablennius marmoreus
          </p>
          <p>Estado de conservação: Menor preocupação</p>
        </div>

        <figure class="figure-text">
          <img alt="Maria-da-toca-das-pedras" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Maria-da-toca-das-pedras
            </p>
          </figcaption>
        </figure>

        <div class="life-block" bp="grid container">
          <div class="text-block-b" bp="12 6@md">
            <p>
              O peixe que anda sobre os recifes! As Marias da toca, como são
              conhecidas, são pequenos peixes de no máximo 8,5 cm de comprimento
              que vivem em orifícios e pequenos buracos no costão rochoso e nos
              recifes de corais. São herbívoros, se alimentando de alga marinha
              e matéria orgânica. São como jardineiras dos recifes.
            </p>
            <p>
              Quando saem de suas tocas, em busca de alimentos na maré baixa,
              elas se apoiam sobre suas nadadeiras peitorais e rastejam como se
              estivessem caminhando indo de um ponto a outro, forrageando o
              costão com as algas expostas nas rochas, e ao menor sinal de
              perigo elas saltam para dentro d´água e se entocam novamente.
            </p>
          </div>
        </div>
      </section>
    </article>

    <article id="birds" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          <img alt="Icone de uma ave" src="~static/graficos/bird.svg">
          Aves
        </h2>

        <p>
          29 espécies de aves já foram catalogadas na Laje.
        </p>
      </section>
    </article>
  </article>
</template>

<script>
import Rellax from 'rellax';
import page from './page.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import SwimmingFish from '~/components/SwimmingFish.vue';
import LifeBlock from '~/components/sections/LifeBlock.vue';

const imageCardume = require('~/static/images/nauther/1556498262088345578492.jpg?resize');

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
