<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h2 class="subtitle is-3">
            <translate>
              Mapa
            </translate>
          </h2>
          <ul>
            <li>
              <nuxt-link to="/">
                <translate>
                  Início
                </translate>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/vida">
                <translate>
                  Vida
                </translate>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/about">
                <translate>
                  Sobre
                </translate>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/dive">
                <translate>
                  Mergulhos
                </translate>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/fauna">
                <translate>
                  Catálogo de vida
                </translate>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/tecnologia">
                <translate>
                  Tecnologia
                </translate>
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="column has-text-right">
          <h2 class="subtitle is-3">
            <translate>
              Projeto e execução
            </translate>
          </h2>
          <p>
            <a href="https://corollarium.com">Corollarium Tecnologia</a>.
          </p>
          <p>
            <a href="https://github.com/Corollarium"><translate>
              Código disponível
            </translate></a> sob
            <a href="http://opensource.org/licenses/mit-license.php">Licença MIT</a>.
          </p>
          <p>
            Projeto apoiado pelo <a href="http://www.proac.sp.gov.br/">ProAC do Estado de São Paulo</a> em 2020.
          </p>
          <p>
            <translate>
              Conteúdo do site sob
            </translate>
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a><br>
            <translate>
              exceto quando explicitamente referenciado.
            </translate>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="less" scoped>
@import '~assets/css/index.less';

.footer {
  background: #000;
  color: #fff;
  display: block;
}
</style>
