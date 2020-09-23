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
        <li class="pure-menu-item topbar-list-item" data-target="fish">
          <a class="pure-menu-link link-menu-vida" href="#fish">
            <img class="menu-icon" alt="Icone de um peixe" src="~static/images/graficos/fish.svg">
            Peixes
          </a>
        </li>
        <li class="pure-menu-item topbar-list-item" data-target="birds">
          <a class="pure-menu-link link-menu-vida" href="#birds">
            <img class="menu-icon" alt="Icone de um pássaros" src="~static/images/graficos/bird.svg">
            Aves
          </a>
        </li>
      </ul>
    </div>

    <section id="intro" class="section-life" bp="container" data-aos="fade-up">
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
            Tartaruga de pente
            e tartaruga verde.
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

    <section id="fish" class="section-index">
      <section class="section-life container">
        <h2 class="title-specimen">
          <img alt="Icone de um peixe" src="~static/images/graficos/fish.svg">
          Peixes
        </h2>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Garoupa verdadeira
          </h3>
          <div class="especie-info text-block">
            <p>Espécie: Epinephelus marginatus</p>
            <p>Estado de conservação: Vulnerável a extinção</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Garoupa verdadeira" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Garoupa verdadeira entre pedras. Foto: Nauther Andres
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
            <p>
              Esta espécie habita fundos marinhos rochosos e coralíneos com
              profundidade de até 300 metros. Garoupas estão distribuídas por
              todo o oceano atlântico nas zonas tropicais, subtropicais  e
              temperadas, são extremamente territorialistas e grandes
              predadores, se alimentando de outros peixes e crustáceos. Uma
              curiosidade sobre a garoupa: essa espécie nasce fêmea e após
              alguns anos se torna macho, caracterizando hermafroditismo!
            </p>

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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Peixe-frade
          </h3>
          <div class="especie-info text-block">
            <p>Espécie: Pomacanthus paru</p>
            <p>Estado de conservação: pouco preocupante</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Peixe frade" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Peixe frade
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Peixe anjo real
          </h3>
          <div class="especie-info text-block">
            <p>Espécie: Holocanthus ciliares</p>
            <p>Estado de conservação: Pouco preocupante</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Peixe anjo real" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Peixe anjo real
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Sargentinho
          </h3>
          <div class="especie-info text-block">
            <p>Espécie: Abudefduf saxatilis</p>
            <p>Estado de conservação: Menor preocupação</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Sargentinho" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Sargentinho
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Peixe Coió ou falso-voador
          </h3>
          <div class="especie-info text-block">
            <p>
              Espécie: Dactylopterus volitans
            </p>
            <p>Estado de conservação: Menor preocupação</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Peixe Coió ou falso-voador" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Coió
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Pirá
          </h3>
          <div class="especie-info text-block">
            <p>
              Espécie: Malacanthus plumieri
            </p>
            <p>Estado de conservação: Menor preocupação</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Pirá" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Pirá
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>

        <section class="section-life container" style="padding-bottom:0;" data-aos="fade-right">
          <h3>
            Moreia pintada
          </h3>
          <div class="especie-info text-block">
            <p>
              Espécie: Gymnothorax moringa
            </p>
            <p>Estado de conservação: Menor preocupação</p>
          </div>
        </section>

        <figure class="figure-text" data-aos="fade-up">
          <img alt="Moreia pintada" src="http://placehold.it/300x300">
          <figcaption>
            <p>
              Moreia pintada
            </p>
          </figcaption>
        </figure>

        <section class="section-life " bp="grid container">
          <div class="text-block-b" bp="12 6@md" data-aos="zoom-in">
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
          </div>
        </section>
      </section>
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
      rellax: null
    };
  },

  mounted () {
    console.log(imageCardume);
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
