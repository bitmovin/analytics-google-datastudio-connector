# analytics-google-datastudio-connector
Connector for Google Data Studio to Bitmovin Analytics

## Set up development environment
https://github.com/google/clasp

## Debugging 
The bet way to debug variables in the online environment is to throw Exceptions with the content of the variables as JSON strings:
`throw new Error(JSON.stringify(options));`

Make sure to change to admin mode first by adding the following function, otherwise error messages won't be displayed:
```
function isAdminUser() {
  return true;
}
```
