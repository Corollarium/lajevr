<template>
  <footer class="footer">
    <div class="container">
      <div class="pure-g">
        <div class="pure-u-1-2">
          <h2>
            <i18n>
              Mapa
            </i18n>
          </h2>
          <ul>
            <li>
              <nuxt-link to="/">
                <i18n>
                  Início
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/vida">
                <i18n>
                  Vida
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/sobre">
                <i18n>
                  Sobre
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/mergulho-virtual">
                <i18n>
                  Mergulhos
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/especies">
                <i18n>
                  Catálogo de espécies
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/tecnologia">
                <i18n>
                  Tecnologia
                </i18n>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/galeria">
                <i18n>
                  Galeria
                </i18n>
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="pure-u-1-2 has-text-right">
          <h2>
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

<style lang="less" scoped>
.footer {
  background: #000;
  color: #fff;
  display: block;
}
</style>
