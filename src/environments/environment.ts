// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tzTacosContract: 'KT1C3wqB8qMn7jheM2eCSTCyKGPUi3aFMLkZ',
  rpcUrl: 'https://edonet-tezos.giganode.io/',
  appName: 'tezostaco.shop',
  tacosBigmapMetaUrl:
    'https://api.better-call.dev/v1/bigmap/edo2net/10193/keys?q=&offset=0&size=10000',
  tacosBigmapOwnerUrl:
    'https://api.better-call.dev/v1/bigmap/edo2net/10191/keys?q=&offset=0&size=10000',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
