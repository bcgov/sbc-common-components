
### Prerequisites

[How To Install the dependency](../install/README.md) 

 
## How to use the component

#### Sample Parent Component

```typescript
@Component({
  components: {
    'some-address': BaseAddress
  }
})
export default class ParentClass extends Vue {
  private address: object = { streetAddress: '1234 Main Street' }
  private isAddressEditing: boolean = false
  private isAddressModified: boolean = false
  private isAddressValid: boolean = false
  const addressSchema = {
    streetAddress: { required },
    streetAddressAdditional: { },
    addressCity: { required },
    addressCountry: { required },
    addressRegion: { required },
    postalCode: { required },
    deliveryInstructions: { }
  }
  
  /// ...etc...
}
```

#### Sample Parent Template

```html
  <...>
    <some-address :address.sync="address"
                  :editing="isAddressEditing"
                  :schema="addressSchema"
                  @modified="isAddressModified"
                  @valid="isAddressValid"
    />
  </...>
```

#### Validation
The `schema` property is used to construct Vuelidate validations (which are used to determine component validity) and Vuetify rules (which are used to display error messages and styling).

In addition to `required`, other validations may be specified, for example:
- `minLength: minLength(5)`
- `maxLength: maxLength(50)`
- `isCanada: (val) => (val.toLower() === 'canada')`

Many other validations are possible but only the above are currently implemented.

See `mixin/validation-mixin.ts` for more information.

#### Sample Usage with Canada Post AddressComplete

This component will work with the AddressComplete APIs from Canada Post. If you have an account to use
AddressComplete, the following setup will turn it on for all instances of the component.

```html
  <html>
    <head>
      <!-- Include the CSS and JS from Canada Post -->
      <link rel="stylesheet" type="text/css" href="http://ws1.postescanada-canadapost.ca/css/addresscomplete-2.00.min.css"/>
      <script type="text/javascript" src="http://ws1.postescanada-canadapost.ca/js/addresscomplete-2.00.min.js"></script>

      <script type="text/javascript">
        // The key for your account.
        window.addressCompleteKey = 'AB12-CD34-EF56-GH78'
      </script>
    [...]
```
