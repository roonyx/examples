namespace :notifications do
  desc 'Recalling birthdays'
  task birthdays: :environment do
    Notifications::BirthDaysService.new.create_notifications
  end
end