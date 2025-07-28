/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { defaults } from "@/plugins/vuetify/defaults"
import { light } from "@/plugins/vuetify/themes"
import { createVuetify, type VuetifyOptions } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { aliases, mdi } from "vuetify/iconsets/mdi"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export const defaultOptions: VuetifyOptions = {
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  defaults,
  theme: {
    themes: {
      light,
      dark: {},
    },
  },
  components,
  directives,
}

export default createVuetify(defaultOptions)
