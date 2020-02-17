<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h2 class="subtitle is-3">
            Mapa
          </h2>
          <ul>
            <li>
              <nuxt-link to="/">
                Início
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/vida">
                Vida
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/about">
                Sobre
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/dive">
                Mergulhos
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/fauna">
                Catálogo de vida
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/tecnologia">
                Tecnologia
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="column has-text-right">
          <h2 class="subtitle is-3">
            Projeto e execução
          </h2>
          <p>
            <a href="https://corollarium.com">Corollarium Tecnologia</a>.
          </p>
          <p>
            <a href="https://github.com/Corollarium">Código disponível</a> sob
            <a href="http://opensource.org/licenses/mit-license.php">Licença MIT</a>.
          </p>
          <p>
            Projeto apoiado pelo <a href="http://www.proac.sp.gov.br/">ProAC do Estado de São Paulo</a> em 2020.
          </p>
          <p>
            Conteúdo do site sob
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a><br> exceto quando explicitamente referenciado.
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
