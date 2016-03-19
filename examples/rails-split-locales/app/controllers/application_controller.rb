class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_locale

  private

  def set_locale
    I18n.locale = begin
      locale = I18n.default_locale
      locale = params[:locale] if I18n.available_locales.map(&:to_s).include?(params[:locale])
      locale
    end
  end

  def default_url_options
    {locale: I18n.locale}
  end
end
