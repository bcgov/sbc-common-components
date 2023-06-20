NOTE, Since this component uses mounted hooks to check for mobile device usage,
calling the component will not work to display it. The component HTML must be
copied into this file and the v-dialog must be removed in order
to display the component properly.
<template>
  <div>
    <h1 class="pageTitle">Mobile Device Alert</h1>
    <h2 class="note">Please refer to the note at the top of MobileDeviceAlertView.vue if
        you are using this page to test the MobileDeviceAlert component.</h2>
    <br>
    <v-row justify="center">
      <v-card>

         <v-btn
            icon
            color="primary"
            :right="true"
            :absolute="true"
            @click="mobileDevice = false"
            class="mt-1"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        <v-card-title class="justify-center pb-0">
          <v-icon color="red" x-large>mdi-alert-circle-outline</v-icon>
        </v-card-title>

        <v-card-title class="justify-center text-center py-4">
          <div>
            Mobile Device Use is <br />
            not Recommended
          </div>
        </v-card-title>
        <v-card-text class="text-center px-6">
          <p>
            Use of this application with a mobile device is not recommended at
            this time. You may experience payment issues or other errors which
            may affect the accuracy of information submitted.
          </p>
          <p class="mb-0">
            It is recommended that you return to this site from your desktop or
            laptop computer.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pt-0">
          <v-btn text class="mobile-alert-ok-btn" @click="mobileDevice = false"
            >OK</v-btn>
        </v-card-actions>
      </v-card>
  </v-row>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import MobileDeviceAlert from '../../src/components/MobileDeviceAlert.vue'

@Component({
  components: {
    MobileDeviceAlert
  }
})
export default class MobileDeviceAlertView extends Vue {
  mobileDevice: boolean = false
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
<style lang="scss" scoped>
  .note{
    text-align: justify;
    text-align-last: center;
  }
</style>
