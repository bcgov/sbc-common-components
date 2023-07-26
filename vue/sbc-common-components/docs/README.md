# SBC Common Library

This is the shared space where all UI/UX Vue Components common to SBC lives.

_**`The library tries to address a few concerns`**_

**Eliminate inconsistencies** in the product design. All layouts ,headers, footers will be used from this repo ongoing

**share your cool** component! and no way to share it across teams. Host it here

**develop reusable code** .Think in terms of reusable pieces and avoid tightly coupled components

**NOTE** when using this package in other repos, the following code may need to be added to the vue.config.js of the repo
The following block of code is used to fix the warning: 
"Vue3: resolveComponent can only be used in render() or setup()".
This warning was preventing components in Sbc-common-components to be rendered.

module.exports = {
    ...
    configureWebpack:{
        resolve:{
            alias:{
               vue: path.resolve('./node_modules/vue')
            }
        }
    }
}
**END NOTE**


