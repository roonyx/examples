class CoverVoluntaryWorker < Cover
  validates :volunteer_hours, :weekly_accident, :capital_benefits, presence: true
  validates :volunteer_hours, allow_nil: true, numericality: { less_than: 201,
                                                               message: "Can't be more than 200 hours."}
  def abbreviation
    'VO'
  end
end
