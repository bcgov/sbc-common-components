<template>
  <loading-screen :is-loading="isLoading" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import KeyCloakService from '../../src/services/keycloak.services'
import LoadingScreen from './LoadingScreen.vue'

const props = defineProps({
  redirectUrl: {
    type: String,
    default: ''
  }
})

const isLoading = ref(true)

onBeforeMount(async () => {
  await KeyCloakService.logout(
    props.redirectUrl ? decodeURIComponent(props.redirectUrl) : undefined)
})
</script>

<style lang="scss" scoped></style>
