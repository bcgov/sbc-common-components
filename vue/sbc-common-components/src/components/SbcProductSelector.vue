<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn text large v-on="on" class="product-selector-btn" data-test="product-selector-btn">
          <span>Products & Services</span>
          <v-icon small class="ml-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-card>
        <header class="app-header">
          <div class="container">
            <a class="brand">
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
              <v-btn text large @click="dialog = false" class="close-btn" data-test="close-btn">
                <span>Close</span>
              </v-btn>
            </div>
          </div>
        </header>
        <div>
          <article>
            <div class="light-bg">
              <v-container class="section-container">
                <section class="text-left">
                  <div class="view-header">
                    <v-btn large icon color="secondary" class="back-btn mr-3" @click="dialog = false">
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <div>
                      <h2>BC Registry Products and Services</h2>
                      <p>Easy access to a wide range of information products and services, including access <br>to British Columbia Provincial and Municipal Government information.</p>
                    </div>
                  </div>
                  <v-row class="product-blocks" align="center" justify="center">
                    <v-col cols="12" md="4" v-for="(product, index) in products" :key="index">
                      <v-hover v-slot:default="{ hover }">
                        <v-card :elevation="hover ? 6 : 2" :class="{ 'on-hover': hover }" class="product-block text-center" @click="goToProductPage(product)">
                          <v-icon x-large color="BCgovBlue" class="product-block__icon--large mb-4">mdi-image-outline</v-icon>
                          <h3>{{product.name}}</h3>
                          <p class="mb-0">{{product.description}}</p>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </section>
              </v-container>
            </div>
            <div class="grey lighten-4">
              <v-container class="section-container">
                <section class="text-center">
                  <h2>Our Partners</h2>
                  <p>Leverage the security and functionality of your BC Registries account <br>when accessing any of our trusted partner applications.</p>
                  <v-row class="partner-blocks" align="center" justify="center">
                    <v-col cols="12" sm="4" md="2" v-for="(partner, index) in partners" :key="index">
                      <v-hover v-slot:default="{ hover }">
                        <v-card :elevation="hover ? 6 : 2" :class="{ 'on-hover': hover }" class="partner-block text-center" @click="goToPartnerPage(partner)">
                          <v-icon large color="grey lighten4" class="product-block__icon mb-4">mdi-image-outline</v-icon>
                          <div>
                            <strong>{{partner.name}}</strong>
                          </div>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </section>
              </v-container>
            </div>
          </article>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import ConfigHelper from '../util/config-helper'

interface ProductItem {
  name: string;
  description: string;
  url: string;
  mdiName?: string;
}

interface PartnerItem {
  name: string;
  url: string;
  mdiName?: string;
}

@Component({
  name: 'SbcProductSelector'
})
export default class SbcProductSelector extends Vue {
  private dialog = false
  products: ProductItem[] = [
    {
      name: 'Business Registry',
      description: 'Easy access to a wide range of information products and services, including access to British Columbia Provincial and Municipal Government information.',
      url: ConfigHelper.getAuthContextPath()
    },
    {
      name: 'Personal Property Registry',
      description: 'View and maintain records of charges such as liens, security interests, and encumberances filed against personal property.',
      url: 'https://www.google.com'
    },
    {
      name: 'Manufactured Homes Registry',
      description: 'Access for qualified suppliers to view and maintain information and records on manufactured homes in British Columbia.',
      url: 'https://www.bing.com'
    }
  ]

  partners: PartnerItem[] = [
    {
      name: 'BC Assessment',
      url: 'https://www.bcassessment.ca'
    },
    {
      name: 'Vital Statistics',
      url: 'https://www2.gov.bc.ca/gov/content/family-social-supports/seniors/health-safety/health-care-programs-and-services/vital-statistics'
    }
  ]

  private goToProductPage (product: ProductItem): void {
    window.location.href = product.url
  }

  private goToPartnerPage (partner: PartnerItem): void {
    window.open(partner.url, '_blank')
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

$app-header-font-color: #ffffff;

.app-header {
  height: 70px;
  color: $app-header-font-color;
  border-bottom: 2px solid $BCgovGold5;
  background-color: #003366;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
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
  letter-spacing: -0.03rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: inherit;
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

.v-btn.product-selector-btn {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
  text-align: left;
  color: $app-header-font-color;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
  margin-right: 1em;

  span {
    line-height: 1.125rem;
    font-size: 0.75rem;
  }
}

.v-btn.close-btn {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
  text-align: left;
  color: $app-header-font-color;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
  margin-right: 1em;

  span {
    line-height: 1.125rem;
    font-size: 0.75rem;
  }
}

.v-card.product-block:not(.on-hover), .v-card.partner-block:not(.on-hover) {
  opacity: 0.9;
 }

</style>
