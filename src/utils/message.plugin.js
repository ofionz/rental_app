/* eslint-disable */
export default {
  install(Vue, options) {
    Vue.prototype.$message = function(html) {
      M.toast({ html, classes: 'messageToast', displayLength: 6000 });
    };
    Vue.prototype.$error = function(html) {
      M.toast({ html: `[Ошибка]: ${html}`, classes: 'errorToast', displayLength: 6000});
    };
  }
};
