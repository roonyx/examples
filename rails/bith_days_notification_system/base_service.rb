module Notifications
  class BaseService
    protected

    def create_notification(meaning, user, message, link)
      Notification.create(meaning: meaning, user: user, message: message, link: link)
    end
  end
end