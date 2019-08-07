# == Schema Information
#
# Table name: notifications
#
#  id         :bigint(8)        not null, primary key
#  link       :string
#  meaning    :string
#  message    :string
#  status     :string           default("new")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Notification < ApplicationRecord
  STATUSES = %w[new readed removed].freeze

  BIRTHDAYS_MEANING = {
      'remind_bd_3_days': 3.days,
      'remind_bd_2_days': 2.days,
      'remind_bd_tomorrow': 1.day,
      'remind_bd_today': 0.days
  }.freeze

  VALID_MEANING_STAGES = Notification::BIRTHDAYS_MEANING.keys.map(&:to_s)

  belongs_to :user

  scope :active, -> { where(status: %i[new readed]) }
  validates :meaning, inclusion: { in: VALID_MEANING_STAGES }
  validates :status, inclusion: { in: STATUSES }
end