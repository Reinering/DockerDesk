import { defineBoot } from '#q-app/wrappers'
import { Lang } from 'quasar'
import { isEmptyStr } from 'src/utils/common.js'


// relative path to your node_modules/quasar/..
// change to YOUR path
// const langList = import.meta.glob('../../node_modules/quasar/lang/*.js')
// or just a select few (example below with only DE and FR):
// import.meta.glob('../../node_modules/quasar/lang/(de|fr).js')
const langList = import.meta.glob('../../node_modules/quasar/lang/(en-US|zh-CN).js')


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async (/* { app, router, ... } */) => {
  // something to do

  let lang = ''
  if (!isEmptyStr(localStorage.getItem('config'))) {
    lang = JSON.parse(localStorage.getItem('config')).lang
  }

  const langIso = lang || 'zh-CN' // ... some logic to determine it (use Cookies Plugin?)

  try {
    langList[ `../../node_modules/quasar/lang/${ langIso }.js` ]().then(lang => {
      Lang.set(lang.default)
    })
  }
  catch (err) {
    console.error(err)
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }

})


