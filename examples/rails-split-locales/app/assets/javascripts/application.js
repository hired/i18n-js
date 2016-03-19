//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_self
//= require i18n
//= require_tree ./application/utils
//= require_tree ./application/pages
//= require application/boot

$(function() {
  I18n.defaultLocale = $("html").data("default-lang")
  I18n.locale = $("html").attr("lang");
});
