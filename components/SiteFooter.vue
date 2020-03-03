<template>
  <footer class="footer">
    <div class="container">
      <div class="pure-g">
        <div class="pure-u-1">
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
                  Sobre
                </i18n>
              </nuxt-link>
            </li>
            <li class="pure-menu-item">
              <nuxt-link to="/mergulho-virtual" class="pure-menu-link">
                <i18n>
                  Mergulhos
                </i18n>
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
              <nuxt-link to="/tecnologia" class="pure-menu-link">
                <i18n>
                  Tecnologia
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
        <div class="pure-u-1">
          <hr style="opacity: .2">
          <h2 class="footer-title">
            <i18n>
              Projeto e execução
            </i18n>
          </h2>
          <p>
            <a href="https://corollarium.com">
              <span class="logo-corollarium" />
              Corollarium Tecnologia
            </a>
          </p>
          <p>
            <a href="https://github.com/Corollarium"><i18n>
              Código disponível
            </i18n></a> sob
            <a href="http://opensource.org/licenses/mit-license.php">Licença MIT</a>.
          </p>
          <p>
            Projeto apoiado pelo <a href="http://www.proac.sp.gov.br/">ProAC do Estado de São Paulo</a> em 2020.
          </p>
          <p>
            <i18n>
              Conteúdo do site sob
            </i18n>
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a>
            <i18n>
              exceto quando explicitamente referenciado
            </i18n>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
