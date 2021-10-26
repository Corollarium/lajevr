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
          <i18n>The technology</i18n>
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
        generating thumbnails of different sizes (easily done with a nice [plugin](https://marquez.co/docs/nuxt-optimized-images)),
        as well as generating some code automatically, such as the statistics on the <nuxt-link to="/sobre">
          about page
        </nuxt-link> that are generated from a bash script.
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
      <figure class="figure-text">
        <img src="~/static/images/technology/annotated-landing-above-fold.png" alt="Above the fold">
      </figure>
      <p>
        The animation above the fold is a composed of 2D and 3D. The island is a 2D image, which is
        quick to load -- much quicker than a 3D model, and faster to render. It's mapped to a sprite,
        so it responds correctly to the camera motion, which is only vertical. The clouds are a
        background layer, so they don't move at all, as it's expected.
        Mixing the two effects you get a sense of parallax, that the island is far but not that far,
        and that the clouds are much farther.
      </p>
      <p>
        We tried to use a video for the ocean, but not only it was near impossible to get a looping video
        that looked like an ocean, the water was close to the camera and we needed a perspective change
        when the user scrolls and dives. We had to go full 3D. For that we used an ocean water simulator
        that renders the water with GLSL. It's a bit hard on the GPU and we had trouble with Safari thanks
        to its WebGL implementation (and there's a fallback for it), but
        on other browsers the effect was striking.
      </p>
      <div class="has-text-center">
        <video style="width: 800px; max-width: 100vw; height: 800px; max-height: 100vh; margin: 0 auto;" muted playsinline controls>
          <source src="~static/videos/technology/scrolllandinglaje-2021-10-20_11.52.18.mp4">
        </video>
      </div>

      <p>
        We mapped the page scroll events to the 3D camera position, so as you scroll the camera lowers until
        you get to the water. This was a bit trickier than expected, since we had to match the scroll size
        with the 3D translation, which required a bit of "sticky" magic with CSS. An outer div had a larger
        height (around 250vh) to control the scroll size, and an inner div was stickied inside it with a
        constant 100vh size.  We also had to limit the
        3D translation to a sane value, otherwise people would actually go below the water in the 3D view and the
        effect was not as nice.
      </p>

      <figure class="figure-text">
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
        the swimming fish. They are SVG images, animated with CSS. It's easy to change their color of the number
        of fish, and makes for a simple effect to add some motion to largely static areas of a page.
      </p>

      <swimming-fish />

      <p style="margin-top: 300px">
        The biggest performance problem in all pages is JavaScript, particularly with 3D: a lot has to happen
        in the main thread, and WebWorkers are not that useful. We're looking forward to WebGPU to get rid of
        this limitation. Meanwhile, moving things out of the main JS thread results in a smooth animation without
        worries, which is why CSS animations were preferred whenever possible.
      </p>

      <p>
        But while JS was kept to a minimum, some effects were more complex and required dynamic code.
        That is the case of the air bubbles, which are of different sizes, with wobbles and motion at
        different speeds. They are rendered in a canvas as ellipses - so they are always smooth - but their
        motion is controlled by a JS loop. A gradient effect on top and bottom makes for a smooth transition.
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

      <figure class="figure-text">
        <img :src="moreiaPanorama.src" :srcset="moreiaPanorama.srcSet" alt="Panorama do Moreia">
        <figcaption>But we did it: Moreia in its entirety.</figcaption>
      </figure>

      <p>
        This is a composed picture, combining four individual photos. <a href="http://hugin.sourceforge.net/">Hugin</a>
        was very helpful to compose these images and compensate for the wide lens distortion.
      </p>

      <figure class="figure-text">
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
        The basic idea of our proposal was using 3D to display information of Laje de Santos, centered
        on a 3D experience of an actual dive. We wanted to make it as simple as possible to use it, so
        instead of an executable that had to be downloaded, it had to run in the web.
      </p>

      <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
        <GLTFModel
          :model="'./models/tartaruga/tartaruga.glb'"
          :attribution="'Modelo de tartaruga'"
          :scale="2"
        />
      </div>

      <p>
        We use both ThreeJS and BabylonJS for the 3D rendering. This wasn't planned from the start:
        our plan was to use solely ThreeJS, but it turned out to have a major problem with multipass
        rendering and animations with ThreeJS that seemed unsolvable. BabylonJS didn't have such a
        limitation, and we moved to it later - and even contributed with some code and documentation.
        Because it turns out that nobody had implemented some of the things we were doing yet using
        the same technology, we had to write some code that became detached and available as stand
        alone modules. You can find some remnants of the ThreeJS code on the repo, which is interesting
        to compare both engines.
      </p>

      <h3>Boids</h3>

      <p>
        Do you know those striking fish videos with large schools that move together? We wanted that.
        There is an old algorithm to simulate that flocking behavior, called
        <a href="https://en.wikipedia.org/wiki/Boids">boids</a>. It's a set of rules to influence each
        other. There was no library for BabylonJS that we could use, so we
        <a href="https://github.com/Corollarium/babylon-boids/">wrote our own boids library and released it
          as a separate module</a>.
      </p>

      <figure class="figure-text">
        to come
      </figure>

      <h3>
        Underwater effect: Multipass rendering
      </h3>

      <p>
        Things look different underwater. Water absorbs light, and does it according to frequency. Red light is almost
        completely absorbed in the first few meters. By 20 meters deep, which is the average depth of Laje, you're left
        essentially with green and blue light.
      </p>

      <figure class="figure-text">
        <img src="~/static/images/technology/745px-Light_Penetration_Spectrum_in_Water_01.png" alt="Light penetration">
        <figcaption>
          Light penetration in water. The deeper you go, the bluer things become.
          <a title="Tomemorris, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Light_Penetration_Spectrum_in_Water_01.png">
            Tomemorris, CC BY-SA 4.0, via Wikimedia Commons
          </a>
        </figcaption>
      </figure>

      <p>
        That explains why you see underwater pictures and they are very blueish. Underwater pictures are often
        taken with a light strobe for close-ups, which makes them "true color", but that doesn't work for far away objects,
        of course. They're also heavily color corrected on software to make them look "more colorful".
        This is what a typical image looks like before and after color correction:
      </p>

      <figure class="figure-text">
        TODO
      </figure>

      <p>
        It's interesting how our eyes compensate for that color loss and when we're diving things don't look so blue!
        But of course, when you look at something red, it's not red at all when you're deep. So we had to implement
        underwater effects in our rendering. Besides this blueish coloring, water has caustics.
      </p>

      <figure class="figure-text">
        TODO
      </figure>

      <p>
        Caustics happen because light is refracted by the waves. It's a pretty effect, and you can easily see it on
        shallow dives and sunny days. It's pretty and annoying to reproduce in 3D. It's impossible to accurately
        simulate it in real time; calculating the actual light is very expensive computationally. The usual way to
        do it is using an animated texture that kinda looks like caustics. The texture can be a movie or generated
        by a noise algorithm. Rendering it on top of actual textures, however, presents a challenge: you need to
        add the caustic to the normal object colors.
      </p>

      <figure class="figure-text">
        <iframe src="https://playground.babylonjs.com/#S1W87B" width="600px" height="400px" loading="lazy" />
        <figcaption>
          Rendering multiple passes. On the left the first pass, with the actual textures. Middle: second pass, the
          textures are replaced by a caustic texture. Finally both are combined into a resulting image, multiplying
          one by the other.
        </figcaption>
      </figure>

      <p>
        The <a href="https://doc.babylonjs.com/divingDeeper/postProcesses/renderTargetTextureMultiPass">caustic examples
          and multipass rendering were contributions of this project to the Babylon.JS project</a>, with a lot of help
        from their awesome community. There are implications to instances and animations that were a bit tricky to solve,
        but with their help the final result is amazing and the performance really good.
      </p>

      <p>
        Another light effect when diving are "god rays", or volumetric light that comes from scattering of particles,
        just like a dusty room makes light look like a 3D object.
      </p>

      <h3>
        Vertex Animation Textures
      </h3>

      <p>
        TODO
      </p>

      <h3>
        Performance issues with WebGL
      </h3>

      <p>
        We had a number of performance issues with WebGL. They are all linked to the "everything runs on the main thread"
        problem. Since these popup many times on threads, we'll quickly go over the problems and solutions. The
        <a href="https://doc.babylonjs.com/divingDeeper/scene/optimize_your_scene">Optimizing Your Scene</a> guide
        is incredibly helpful.
      </p>

      <p>
        <strong>Too many objects.</strong> Engines deal with objects separately by default, so when you add thousands
        of rocks things get slowly pretty quickly. There are a number of ways to deal with these.
        <a href="https://doc.babylonjs.com/divingDeeper/mesh/copies/instances">Instances</a>
        are interesting when the objects share geometry but are largely independent.
        <a href="https://doc.babylonjs.com/divingDeeper/mesh/copies/thinInstances">Thin instances</a> are more restricted
        than instances, allowing you to change position/scale/rotation. Thin instances are always drawn, while instances
        are checked individually.
        <a href="https://doc.babylonjs.com/divingDeeper/particles/solid_particle_system/sps_intro">Solid Particle Systems</a>
        are an alternative to thin instances that in our implementation turned out to be even faster for thousands of
        items.
      </p>

      <p>
        <strong>Avoid recomputing constant data</strong>. Freeze your assets whenever possible: static objects can have normals,
        world matrix and material frozen. You can also work with culling, bakeCurrentTransformIntoVertices, doNotSyncBoundingInfo
        and other settings of BabylonJS to avoid costly checking that is useless.
      </p>

      <p>
        <strong>Move to shaders.</strong> Whenever possible write your code in shaders, not JS. Shaders run on the GPU.
        In particular, bake your animations: animating with bones on the CPU is very costly. See the "Vertex Animation Textures"
        section above.
      </p>
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import SwimmingFish from '~/components/SwimmingFish.vue';
import Bubbles from '~/components/Bubbles.vue';
import GLTFModel from '~/components/GLTFModel.vue';

const moreiaPanorama = require('~/static/images/panorama.jpg?resize&sizes[]=360&sizes[]=640&sizes[]=1000');

export default {
  components: { SwimmingFish, Bubbles, GLTFModel },
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
