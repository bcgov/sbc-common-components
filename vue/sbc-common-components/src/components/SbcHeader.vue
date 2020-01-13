<template>
  <header class="app-header">
    <div class="container">
      <a href="/cooperatives/" class="brand">
        <picture>
          <source media="(min-width: 601px)"
            srcset="../assets/img/gov_bc_logo_horiz.png">
          <source media="(max-width: 600px)"
            srcset="../assets/img/gov_bc_logo_vert.png">
          <img class="brand__image"
            src="../assets/img/gov_bc_logo_vert.png"
            alt="Government of British Columbia Logo"
            title="Government of British Columbia">
        </picture>
        <span class="brand__title">BC Registries <span class="brand__title--wrap">& Online Services</span></span>
      </a>
      <div class="app-header__actions">
        <v-btn color="#fcba19" class="log-in-btn" v-if="showLogin && !authorized" @click="login">Log in with BC Services Card</v-btn>
        <v-menu bottom left fixed transition="slide-y-transition" content-class="user-account-menu" v-if="showLogin && authorized">
          <template v-slot:activator="{ on }">
            <v-btn text large v-on="on" class="user-account-btn pl-2 pr-2">
              <v-avatar tile left size="36" color="#3f5c94" class="user-avatar mr-4">
                <span class="white--text title">{{ username.slice(0,1) }}</span>
              </v-avatar>
              <div class="user-info">
                <div class="user-name">{{ username }}</div>
                <div class="account-name">Account Name</div>
              </div>
            </v-btn>
          </template>
          <v-list tile dense>
            <v-list-item two-line>
              <v-list-item-avatar tile left size="36" color="#3f5c94" class="user-avatar mr-4">
                <span class="white--text title">{{ username.slice(0,1) }}</span>
              </v-list-item-avatar>
              <v-list-item-content class="user-info">
                <v-list-item-title class="user-name">{{ username }}</v-list-item-title>
                <v-list-item-subtitle class="account-name">Account Name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="goToUserProfile">
              <v-list-item-icon left>
                <v-icon>mdi-account-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Edit Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon left>
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- Separate Account Settings List - Possible Permissions on this group? -->
          <v-list tile dense>
            <v-subheader>ACCOUNT SETTINGS</v-subheader>
            <v-list-item to="/account-settings" target="_blank">
              <v-list-item-icon left>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Account Info</v-list-item-title>
            </v-list-item>
            <v-list-item to="/accountsettings/manage-team" target="_blank">
              <v-list-item-icon left>
                <v-icon>mdi-account-group-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Team Members</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component({})
export default class SbcHeader extends Vue {
  get username () : string {
    return sessionStorage.getItem('USER_FULL_NAME') || '-'
  }

  get authorized () : boolean {
    let auth = sessionStorage.getItem('KEYCLOAK_TOKEN')
    return !!auth
  }

  get showLogin () : boolean {
    let featureHide: any
    let config = sessionStorage.getItem('AUTH_API_CONFIG') || '{}'
    const authApiConfig = JSON.parse(config)

    if (authApiConfig) {
      featureHide = authApiConfig['VUE_APP_FEATURE_HIDE']
    }
    if (featureHide && featureHide.BCSC) {
      return false
    }
    return true
  }

  logout () {
    window.location.assign('/cooperatives/auth/signout')
  }

  login () {
    window.location.assign('/cooperatives/auth/signin/bcsc')
  }

  goToUserProfile () {
    window.location.assign('/cooperatives/auth/userprofile')
  }

  goToAccountSettings () {
    window.location.assign('/cooperatives/auth/accountsettings')
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

$app-header-font-color: #ffffff;
$account-name-font-size: 0.8rem;

.app-header {
  height: 70px;
  color: $app-header-font-color;
  border-bottom: 2px solid $BCgovGold5;
  background-color: $BCgovBlue5;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.app-header__actions {
  margin-left: auto;

  .v-btn {
    margin-right: 0;
  }
}

.brand {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  text-decoration: none;
  color: inherit;
}

.brand__image {
  display: block;
  margin-right: 1.25rem;
  max-height: 70px;
}

.brand__title {
  font-size: 1rem;
  font-weight: 700;
}

@media (max-width: 600px) {
  .brand__image {
    margin-right: 0.75rem;
    margin-left: -0.15rem;
  }

  .brand__title {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .brand__title--wrap {
    display: block;
  }
}

.v-list {
  border-radius: 0;

  .v-list-item__title,
  .v-list-item__subtitle {
    color: $gray9 !important;
    line-height: normal !important;
  }
}

.v-list .v-list-item__title.user-name,
.user-name {
  font-size: 0.875rem;
  font-weight: 700;
}

.v-list .v-list-item__subtitle.account-name,
.account-name {
  font-size: $account-name-font-size;
}

@media (max-width: 960px) {
  .user-name {
    display: none;
  }
}

.user-account-menu {
  background: #ffffff;
}

.user-avatar {
  border-radius: 0.15rem;
  background-color: $BCgovBlue3;
  font-size: 1rem;
  font-weight: 400;
}

.log-in-btn {
  color: $BCgovBlue5;
  background-color: $BCgovGold4;
  font-weight: 700;
}

.v-btn.user-account-btn {
  color: $app-header-font-color;
  text-align: left;
}

.user-account-menu__info {
  font-size: 0.875rem;
}

.v-list--dense .v-subheader {
  padding-right: 1rem;
  padding-left: 1rem;
}

.v-subheader {
  color: $gray9 !important;
  font-size: 0.875rem;
  font-weight: 700;
}
</style>
