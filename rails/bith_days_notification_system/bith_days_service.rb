module Notifications
  class BirthDaysService < Notifications::BaseService
    def create_notifications
      Resident.all.find_each do |resident|
        next if resident.date_of_birth.nil?

        birthday_date =
            Date.new(Time.zone.today.year, resident.date_of_birth.month, resident.date_of_birth.day)
        days_left = (Time.zone.today - birthday_date).to_i.days
        time = Notification::BIRTHDAYS_MEANING.find do |_meaning, days_amount|
          days_amount.eql?(days_left)
        end
        meaning = time.first if time.present?
        remind_users(resident, meaning) if time.present?
      end
    end

    private

    def remind_users(birthday_man, meaning)
      recipients = birthday_man.company.users
      message = I18n.t("notifications.birthdays.#{meaning}", name: resident_name(birthday_man))
      recipients.find_each do |recipient|
        create_notification(meaning, recipient, message, "/residents/#{birthday_man.id}")
      end
    end

    def resident_name(user)
      %w[first_name middle_name last_name].map { |kind_name| user[kind_name] }
          .compact
          .join(' ')
    end
  end
end