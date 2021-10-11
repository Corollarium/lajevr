<template>
  <footer class="footer">
    <div class="container">
      <div>
        <ul class="pure-menu-list pure-menu-horizontal">
          <li class="pure-menu-item">
            <nuxt-link to="/" class="pure-menu-link">
              <i18n>
                Início
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/vida" class="pure-menu-link">
              <i18n>
                Vida
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/sobre" class="pure-menu-link">
              <i18n>
                Projeto
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/mergulho-virtual" class="pure-menu-link">
              <i18n>
                Mergulho virtual
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/pontos-de-mergulho" class="pure-menu-link">
              <i18n>
                Pontos de mergulho
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/moreia" class="pure-menu-link">
              <i18n>O Moréia</i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/especies" class="pure-menu-link">
              <i18n>
                Catálogo de espécies
              </i18n>
            </nuxt-link>
          </li>
          <li class="pure-menu-item">
            <nuxt-link to="/galeria" class="pure-menu-link">
              <i18n>
                Galeria
              </i18n>
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div>
        <hr style="opacity: .2">
        <h2 class="footer-title">
          <i18n>
            Projeto e execução
          </i18n>
        </h2>
        <ul class="footer-copyright">
          <li>
            <a
              class="corollarium-brand"
              href="https://corollarium.com"
              title="Corollarium"
              target="_blank"
            >
              <span class="logo-img footer-img" />
              <span class="">Corollarium Tecnologia</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/Corollarium/lajevr" target="_blank"><i18n>
              Código disponível
            </i18n></a> sob
            <a href="http://opensource.org/licenses/mit-license.php" target="_blank">Licença MIT</a>.
          </li>
          <li>
            Projeto apoiado pelo <a href="http://www.proac.sp.gov.br/" target="_blank">ProAC do Estado de São Paulo</a> em 2020.
          </li>
          <li>
            <i18n>
              Conteúdo do site sob
            </i18n>
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
            >CC BY NC SA 4.0</a>
            <i18n>
              exceto quando explicitamente referenciado
            </i18n>
          </li>
        </ul>
      </div>
      <hr style="opacity: .2">
      <div class="footer-logos" bp="grid 4@sm 2@lg vertical-center">
        <figure bp="offset-4-lg">
          <a href="https://corollarium.com" target="_blank">
            <img src="~/static/images/logos/logo-corollarium.png" alt="Logo Corollarium Technologies">
          </a>
        </figure>
        <figure>
          <a href="http://www.proac.sp.gov.br/" target="_blank">
            <img src="~/static/images/logos/logo-proac-cor-texto-branco.png" alt="Logo Programa de Ação Cultural do Governo do Estado de São Paulo">
          </a>
        </figure>
        <figure>
          <a href="http://www.proac.sp.gov.br/" target="_blank">
            <img src="~/static/images/logos/logo-gesp-slogan-horizontal-cor-texto-branco.png" alt="Logo Governo do Estado de São Paulo">
          </a>
        </figure>
        </a>
        </figure></a>
      </div>
    </div>
  </footer>
</template>
