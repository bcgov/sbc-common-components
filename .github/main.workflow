workflow "publish on release" {
  on = "push"
  resolves = ["publish"]
}

action "publish" {
  uses = "actions/npm@zackify"
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
