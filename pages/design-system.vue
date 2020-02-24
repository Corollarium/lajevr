<template>
  <article class="container">
    <h1 class="title is-1">
      Laje VR
      <span>Design System</span>
    </h1>

    <section class="section">
      <p>
        See <a href="https://bulma.io/documentation/">Bulma docs</a>, particularly
        <a href="https://bulma.io/documentation/customize/variables/">customization</a>
      </p>
    </section>

    <section class="section dark-background-section">
      <h2>
        Typography
      </h2>
      <hr>
      <h1>
        This is Heading 1 appeareance
      </h1>
      <h1>
        <i18n>Título com tradução</i18n>
      </h1>
      <h2>
        This is Heading 2 appeareance
      </h2>
      <h3>
        This is Heading 3 appeareance
      </h3>
      <h4>
        This is Heading 4 appeareance
      </h4>
      <p>
        This is a normal paragraph <a href="#">with a link</a> and here's a text example:
        <br>The Laje de Santos Marine State Park (Portuguese: Parque Estadual Marinho da Laje de Santos) is a state park in the state of São Paulo, Brazil.
        <br>It protects a marine area off the coast of the state, and was the first such park to be created by São Paulo. It includes a rocky islet, tidal reefs and surrounding waters, with various areas suitable for diving, including a boat that was deliberately wrecked to form an artificial reef. The combination of warm surface waters and cold deeper waters supports a high level of biodiversity.
      </p>
    </section>
    <section class="section">
      <h2 class="title is-2">
        Responsive
      </h2>
      <p>see <a href="https://bulma.io/documentation/modifiers/responsive-helpers/">responsive</a>.</p>
      <span class="is-hidden-tablet">in mobile devices</span>
      <span class="show-tablet-only">in tablet devices</span>
    </section>
    <section class="section dark-background-section">
      <h2>
        Colors
      </h2>
      <hr>
      <p>
        <a class="button" href="#">Button in link</a>
        <a class="button is-primary" href="#">Button Primary</a>
        <a class="button is-dark" href="#">Button Primary</a>
        <a class="button is-info" href="#">Button Info</a>
        <a class="button is-success" href="#">Button Success</a>
        <a class="button is-warning" href="#">Button Warning</a>
        <a class="button is-danger" href="#">Button danger</a>
        </div>
      </p>
      <p>
        <a class="button" href="#">Button in link</a>
        </div>
      </p>
    </section>
    <section class="section">
      <h2 class="title is-2">
        Elements
      </h2>

      <h3 class="title is-3">
        number bullet
      </h3>
      <div class="number-wrapper">
        <number-bullet
          :to="550"
        >
          <i18n>metros de comprimento</i18n>
        </number-bullet>
      </div>

      <h3 class="title is-3">
        Language Picker
      </h3>
      <LanguagePicker />
    </section>
    </div>
    </section>
  </article>
</template>

<script>
import LanguagePicker from '../components/LanguagePicker.vue';

export default {
  components: {
    LanguagePicker
  }
};
</script>
