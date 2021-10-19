<template>
  <article>
    <section class="hero">
      <div class="hero-body hero-vida">
        <figure>
          <img :src="moreiaPanorama.src" :srcset="moreiaPanorama.srcSet" alt="Panorama do Moreia">
        </figure>
      </div>
      <div class="vida-hero-text rellax" data-rellax-speed="2">
        <h1 class="has-text-center vida-hero-title">
          <i18n>
            The technology
          </i18n>
        </h1>
      </div>
    </section>

    <section class="section-base container" style="">
      <h2>
        The technology behind this site
      </h2>
      <p>
        This project required a lot of technology to get off the ground -- or under the water,
        in this case. From image capture to 3D reconstruction, from innovative web design to
        3D web implementation that had to be fast even on cell phones. It was fun, and some
        times hard. This page will go through some of the tech we used.
      </p>

      <p>
        The <a href="https://github.com/Corollarium/lajevr">source code</a> is available, by
        the way. And talk to us if you have other questions or similar projects that could use
        our expertise.
      </p>

      <p>
        The site uses Vue and Nuxt.JS for its structure. There's not much that's reactive, but Vue
        made it easier to build reusable components, and Nuxt.JS was helpful to generate a static
        site out of dynamic data. We were constantly adding images and videos, which required
        generating thumbnails of different sizes, as well as generating some code automatically
        (like the statistics on the <nuxt-link to="/sobre">
          about page
        </nuxt-link>).
      </p>

      <p>
        A lot of effort went into planning the pages, making content attractive and interesting,
        and worrying about UX. The fun part of doing unique projects like this one is to solve
        problems that are a bit unique and new. The <nuxt-link to="/especies">
          species page
        </nuxt-link>
        was such a case: it came from a common thing that divers do when they get back to the boat.
        "I saw this blue and black fish about this big, what is it called?" Well, let's allow users
        to search species by color and size.
      </p>
    </section>

    <section class="section-base container" style="">
      <h2>
        Dive effect for the home page
      </h2>
      <p>
        "It has to be unique," we said. "It's about a dive site, so... let's dive". The effect
        of scrolling down and splashing into the water had to be quick to load, performant,
        but unique.
      </p>
      <figure>
        <img src="~/static/images/technology/annotated-landing-above-fold.png" alt="Above the fold">
      </figure>
      <p>
        The animation above the fold is a composed of 2D and 3D. The island is a 2D image, which is
        quick to load -- much quicker than a 3D model, and faster to render. It's mapped as a sprite,
        so it responds correctly to the camera motion. The clouds are a background layer, so they don't
        move at all. Mixing the two you get a sense of parallax, that the island is far but not that far,
        and that the clouds are much farther.
      </p>
      <p>
        We tried to use a video for the ocean, but not only it was near impossible to get a looping video
        that looked like an ocean, the water was close to the camera and we needed a perspective change
        when the user scrolls and dives. We had to go full 3D. For that we used an ocean water simulator
        that renders the water with GLSL. It's a bit hard on the GPU and we had trouble with Safari, but
        on other platforms with better WebGL implementations the effect was striking.
      </p>
      <p>
        We mapped the page scroll events to the 3D camera position, so as you scroll the camera lowers until
        you get to the water. This was a bit trickier than expected, since we had to match the scroll size
        with the 3D translation, which required a bit of "sticky" magic with CSS. An outer div had a larger
        height, to control the scroll size, and an inner div was stickied inside it with a constant 100vh size.
      </p>

      <figure>
        <img src="~/static/images/technology/annotated-landing-just-below-fold.png" alt="Below the fold, transition">
      </figure>

      <p>
        The transition into "underwater" had to move from the 3D ocean back to the 2D HTML page. This was
        done with a cool CSS effect where two transparent <code>div</code> were overlayed, and a CSS animation
        for a distortion effect made them look like oceans. I don't think a lot of people used
        <code>transform: skew</code> in CSS before, but the final effect was cool. It was also heavy: some
        browsers just slowed to a crawl when we added the effect and needed some gentle coaxing to work well
        again.
      </p>
    </section>

    <section class="section-base container" style="">
      <h2>
        CSS and JS everywhere
      </h2>

      <p>
        Reacting to scrolling became much easier after <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver</a>
        was created. We use it all over the site to animate objects when they come into view, and to pause
        3D rendering when it comes out of view.
      </p>

      <p>
        But most of the effects are pure CSS, using animations. That's the case of the liquid buttons,
        which use :before and :after to render animated waves with the same animation with different periods.
      </p>

      <p class="has-text-center">
        <nuxt-link class="button-is-liquid" to="/">
          <span class="button-is-liquid__text">Index page</span>
          <span class="button-is-liquid__animation" />
        </nuxt-link>
      </p>

      <p>
        Anything that was "well behaved" in terms of animation was moved to CSS. That is also the case of
        the swimming fish.
      </p>

      <swimming-fish />

      <p style="margin-top: 300px">
        After all, the biggest performance problem in all pages is JavaScript, particularly with 3D.
        Moving things out of the main JS thread results in a smooth animation without worries.
        But while JS was kept to a minimum, although some effects were more complex and required some code.
        That is the case of the air bubbles, which are of different sizes, with wobbles and motion at
        different speeds. They are rendered in a canvas as ellipses - so they are always smooth - but their
        motion is controlled by a JS loop.
      </p>

      <section style="height: 400px">
        <bubbles />
      </section>
    </section>

    <section class="section-base container" style="">
      <h2>
        Panorama reconstruction
      </h2>

      <p>
        Underwater we can usually see only a few meters. At Laje the Santos the usual visibility is betwen 5m and 12m,
        and on rare occasions you can see up to 20m. Even on these perfect days, 20m means that "at 20m you cannot see anything
        anymore", with visibility decaying exponentially before that. Moreia, the wreck, is about 22m long, so it's almost
        to impossible to take a picture covering all of it. If you are close enough to get a clear picture, you are too close
        to get the entier wreck into a single picture, even with a wide lens.
      </p>

      <figure>
        <img :src="moreiaPanorama.src" :srcset="moreiaPanorama.srcSet" alt="Panorama do Moreia">
        <figcaption>But we did it: Moreia in its entirety.</figcaption>
      </figure>

      <p>
        This is a composed picture, combining four individual photos. <a href="http://hugin.sourceforge.net/">Hugin</a>
        was very helpful to compose these images and compensate for the wide lens distortion.
      </p>

      <figure>
        <img src="~/static/images/technology/moreia-composition.jpg" alt="Panorama do Moreia">
        <figcaption>The four images used to compose the picture above.</figcaption>
      </figure>

      <p>
        This technique is interesting to provide a flat view as well. TO COME
      </p>
    </section>

    <section class="section-base container" style="">
      <h2>And in 3D!</h2>
      <p>
        We use both ThreeJS and BabylonJS for the 3D rendering. This wasn't planned from the start:
        our plan was to use solely ThreeJS, but it turned out to have a major problem with multipass
        rendering and animations with ThreeJS that seemed unsolvable. BabylonJS didn't have such a
        limitation, and we moved to it later - and even contributed with some code and documentation.
        Because it turns out that nobody had implemented some of the things we were doing yet using
        the same technology
      </p>

      <p>
        Boids
      </p>

      <p>
        Multipass rendering
      </p>

      <p>
        Vertex Animation Textures
      </p>
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import SwimmingFish from '~/components/SwimmingFish.vue';
import Bubbles from '~/components/Bubbles.vue';

const moreiaPanorama = require('~/static/images/panorama.jpg?resize&sizes[]=360&sizes[]=640&sizes[]=1000');

export default {
  components: { SwimmingFish, Bubbles },
  extends: page,

  data () {
    return {
      moreiaPanorama
    };
  },

  mounted () {
    this.headerOverlay = true;
    this.head.title = 'The technology';
    this.head.description = this.$gettext('Sobre o projeto Laje de Santos Virtual');
  }
};
</script>

<style lang="less" scoped>
.people {
  list-style: none;
  padding: 0;

  img {
    border-radius: 50%;
    overflow: hidden;
    padding: 1rem;
  }

  .people-name {
    margin: 1rem 0 .5rem;
  }
}

.about-page-text p {
  max-width: 50rem;
}
</style>
