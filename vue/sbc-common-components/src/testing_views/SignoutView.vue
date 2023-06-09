<template>
  <div>
    <h1 class="pageTitle">Sign Out</h1>
    <sbc-signout :redirect-url="redirectbackUrl"></sbc-signout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ConfigHelper from '@/util/config-helper'
import SbcSignout from '../../src/components/SbcSignout.vue'

@Component({
  methods: {
  },
  components: {
    SbcSignout
  }
})

export default class SignoutView extends Vue {
@Prop() redirectUrl: string

get redirectbackUrl () {
// redirect to dashboard on logout
// TODO need to fix for one URL
  if (!this.redirectUrl) {
    return `${ConfigHelper.getRegistryHomeURL()}/login`
  }
  return this.redirectUrl
}

async mounted () {
  this.$store.replaceState({})
}
}
</script>

<style lang="scss" scoped>
  .pageTitle{
    position: absolute;
    font-size: 3rem;
    font-weight: bold;
    color: #003366;
    text-align: justify;
    text-align-last: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: #fcba19;
    justify-content: center;
    align-items: center;
    z-index: 5;
  }
</style>
