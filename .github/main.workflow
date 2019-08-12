workflow "publish on release" {
  on = "push"
  resolves = ["publish"]
}

action "publish" {
  uses = "actions/npm@master"
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
  env = {
      DIR = "./vue/sbc-common-components"
    }
}
