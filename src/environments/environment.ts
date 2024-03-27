// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // API_BASE_URL: 'http://localhost:8080',
  // API_URL: 'http://baiwa.ddns.net:9440/COFFEE/api',
  // API_MAIN: 'http://baiwa.ddns.net:9440/COFFEE/',
  // API_BEAN_URL: 'http://baiwa.ddns.net:9440/coffee-beans/api',
  // API_BEAN_MAIN: 'http://baiwa.ddns.net:9440/coffee-beans/',
  // FILE_UPLOAD_URL: '',
  // IMG_URL: ''

  API_BASE_URL: 'http://localhost:8080',
  API_URL: 'http://localhost:8080/COFFEE/api',
  // API_MAIN: 'http://localhost:8080/COFFEE/',
  // API_URL: 'https://finnbet.com/COFFEE/api',
  // API_MAIN: 'https://finnbet.com/COFFEE/',

  API_IMG_URL: 'http://localhost:8084/COFFEE-FILE/api',
  API_IMG_MAIN: 'http://localhost:8084/COFFEE-FILE/',
  API_BEAN_URL: 'http://localhost:8082/coffee-beans/api',
  API_BEAN_MAIN: 'http://localhost:8082/coffee-beans/',
  API_WEBPLAYER_URL: 'http://localhost:8080/COFFEE/api',
  API_WEBPLAYER_MAIN: 'http://localhost:8080/COFFEE/',
  FILE_UPLOAD_URL: '',
  API_BEAN_SOCKET: 'ws://172.19.50.118:8082/coffee-beans/socket',
  DEBUG_SOCKET: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
